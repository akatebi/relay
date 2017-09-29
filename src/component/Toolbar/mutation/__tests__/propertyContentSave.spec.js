import { cleanLog, getToken, graphql, writeFile, lockDocument, isNewDocument }
  from '../../../__tests__/service';
import { EntityTypes } from '../../../../../share/entityTypes';
import identityQuery from '../../../base/profiles/__tests__/query/identity';
import propertySaveQuery from './query/propertySave';
import valueVMOptionsQuery from '../../../__tests__/query/valueVMOptions';
import valueVMTypeOptionsQuery from '../../../__tests__/query/valueVMTypeOptions';
import { getProfileList } from '../../../../../server/data/database/profileList';
import { Recorder } from '../../Recorder';
import { changeCustomProperties, testCustomProperties } from './propertyContent';
import { entityRevRouteMap } from '../../../../../share/entityRouteMaps';

const debug = require('debug')('app:component:Toolbar:propertyContentSave');

////////////////////// M O D I F Y V A R I A B L E S ////////////////////////////
const docCount = 1;
const entityTypeRegExp = /./;
/////////////////////////////////////////////////////////////////////////////////

const dirname = `${__dirname}/logs/propertyContentSave`;

beforeAll(getToken);
beforeAll(cleanLog.bind(this, dirname));

const writePS = writeFile.bind(this, dirname);

describe('propertyContentSave', () => {

  EntityTypes.filter(en => entityTypeRegExp.test(en)).map(async (entityType) => {
    test(entityType, async () => {
      debug('entityType', entityType);
      const entity = `/${entityRevRouteMap(entityType)}`;
      const { token } = global;
      let profileList = await getProfileList(token, entity);
      profileList = profileList.tables[0].rows
        .map(({ rowKey: { id }, columns }) => ({ id, value: columns[1].value }))
        .filter(({ value }) => value === 'Draft')
        .map(({ id }) => id);
      await writePS(entityType, 'profileList', profileList);
      let count = docCount;
      await Promise.all(profileList.map(async (item, i) => {
        const path = `/${entityRevRouteMap(entityType)}/${item}`;
        const { data: { identity }, errors } = await graphql(identityQuery, { path });
        expect(errors).toBeUndefined();
        // await writePS(entityType, i, 'identity', identity);
        const { customProperties, standardProperties, id, label } = identity;
        const entityState = standardProperties.find(({ name }) => name === 'Rev_State') || {};
        if (entityState.valueVM !== 'Draft' || count === 0) return;
        count -= 1;
        const recorder = new Recorder();
        const newLabel = 'my-root-field-label-sample';
        recorder.onChangeField(id, 'label', label, newLabel);
        await writePS(entityType, i, 'customProperties', customProperties);
        const { data: { valueVMOptions }, errors: optionErrors } = await graphql(valueVMOptionsQuery);
        expect(optionErrors).toBeUndefined();
        const { data: { valueVMTypeOptions }, errors: optionTypeErrors } = await graphql(valueVMTypeOptionsQuery, { path });
        expect(optionTypeErrors).toBeUndefined();
        expect(valueVMOptions).not.toBeNull();
        const changed = changeCustomProperties({
          customProperties, valueVMOptions,
          valueVMTypeOptions, debug });
        await writePS(entityType, i, 'changed', changed);
        changed.forEach(item => debug(entityType, item));
        changed.forEach(item => recorder.onChangeContent('customProperties', item));
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
          await writePS('lock', entityType, i, result);
        }
        await writePS(entityType, i, 'params', params);
        const dirty = recorder.mutationInputDirty();
        expect(dirty).toBe(true);
        const result = await graphql(propertySaveQuery, params);
        await writePS(entityType, i, 'result', result);
        // printErrors(result);
        expect(result.errors).toBeUndefined();
        const { data: { propertySaveMutation } } = result;
        expect(propertySaveMutation).toBeDefined();
        if (propertySaveMutation) {
          const { propertyContents, identity } = propertySaveMutation;
          expect(identity.label).toBe(newLabel);
          await writePS(entityType, i, 'propertyContents', propertyContents);
          testCustomProperties({ changed, propertyContents, debug, entityType });
        }
      }));
    });
  });

});
