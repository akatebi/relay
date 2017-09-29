import {
  cleanLog,
  getToken,
  graphql,
  writeFile,
  lockDocument,
  isNewDocument,
  errorMessage,
} from '../../../__tests__/service';
import configQuery from '../../../base/profiles/__tests__/query/propertyConfigs';
import propertySaveQuery from './query/propertySave';
import { getProfileList } from '../../../../../server/data/database/profileList';
import { changeConfigProperties, checkConfigProperties } from './propertyConfig';
import { Recorder } from '../../Recorder';
import { entityFamilyRouteMap, entityRevRouteMap } from '../../../../../share/entityRouteMaps';

const debug = require('debug')('app:component:Toolbar:propertyConfigSave');

////////////////////// M O D I F Y V A R I A B L E S ////////////////////////////
const docCount = 1;
/////////////////////////////////////////////////////////////////////////////////

let count = docCount;

const dirname = `${__dirname}/logs/propertyConfigSave`;

beforeAll(getToken);
beforeAll(cleanLog.bind(this, dirname));

const writePS = writeFile.bind(this, dirname);

describe('mutation', () => {

  test('propertyConfigSave', async () => {
    const entityType = 'DocumentType';
    const entity = `/${entityFamilyRouteMap(entityType)}/revisions/ids`;
    const { token } = global;
    const profileList = await getProfileList(token, entity);
    await writePS('profileList', profileList);
    await Promise.all(profileList.map(async (item, i) => {
      const path = `/${entityRevRouteMap(entityType)}/${item}`;
      // debug('path', path);
      const configQueryResult = await graphql(configQuery, { path });
      // await writePS(entityType, i, 'configQueryResult', configQueryResult);
      const { data: { config, identity }, errors } = configQueryResult;
      expect(errors).toBeUndefined();
      expect(config).toBeDefined();
      const entityState = identity.standardProperties.find(({ name }) => name === 'Rev_State') || {};
      if (entityState.valueVM !== 'Draft' || count === 0) return;
      count -= 1;
      await writePS(entityType, i, 'config', config.list);
      const recorder = new Recorder();
      changeConfigProperties(config, recorder, debug);
      await writePS(entityType, i, 'write', recorder.mutationInput.configProperties);
      const params = {
        input: {
          ...recorder.mutationInput,
          paths: {
            path,
          },
        },
      };
      if (!isNewDocument(identity)) {
        const result = await lockDocument(path);
        await writePS(entityType, i, 'lock', result);
      }
      await writePS(entityType, i, 'params', params);
      const dirty = recorder.mutationInputDirty();
      expect(dirty).toBe(true);
      const propertySaveQueryResult = await graphql(propertySaveQuery, params);
      await writePS(entityType, i, 'configQueryResult', propertySaveQueryResult);
      if (propertySaveQueryResult.errors) {
        debug('errorMessage', errorMessage(propertySaveQueryResult.errors[0].message));
      }
      expect(propertySaveQueryResult.errors).toBeUndefined();
      expect(propertySaveQueryResult.data.propertySaveMutation).toBeDefined();
      const { propertyConfigs } = propertySaveQueryResult.data.propertySaveMutation;
      await writePS(entityType, i, 'read', propertyConfigs);
      checkConfigProperties(recorder.mutationInput.configProperties, propertyConfigs, debug);
    }));
  });

});
