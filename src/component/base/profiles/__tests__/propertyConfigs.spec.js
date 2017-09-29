import { getToken, cleanLog, graphql, writeFile, fixGUIDS } from '../../../__tests__/service';
import { EntityTypes } from '../../../../../share/entityTypes';
import { getProfileList } from '../../../../../server/data/database/profileList';
import { getConfig } from '../../../../../server/data/database/config';
import { entityRevRouteMap } from '../../../../../share/entityRouteMaps';
import query from './query/propertyConfigs';

const debug = require('debug')('app:server:data:propertyConfigs');

const dirname = `${__dirname}/logs/propertyConfigs`;
const writepropertyConfigs = writeFile.bind(this, dirname);

////////////////////// M O D I F Y V A R I A B L E S ////////////////////////////
const docCount = 1;
const entityTypeRegExp = /DocumentType/;
/////////////////////////////////////////////////////////////////////////////////

describe('propertyConfigs', async () => {

  beforeAll(getToken);
  beforeAll(cleanLog.bind(this, dirname));

  EntityTypes.filter(en => entityTypeRegExp.test(en)).map(entityType =>
    test(entityType, async () => {
      const { token } = global;
      const entity = `/${entityRevRouteMap(entityType)}/ids`;
      const profileList = await getProfileList(token, entity);
      // debug('profileList', profileList);
      await writepropertyConfigs(entityType, 'profileList', profileList);
      const count = Math.min(docCount, profileList.length);
      for (let i = 0; i < count; i++) {
        const item = profileList[i];
        const path = `/${entityRevRouteMap(entityType)}/${item}`;
        debug('path', path);
        const response = await getConfig(token, path);
        expect(fixGUIDS(response)).toMatchSnapshot();
        const result = await graphql(query, { path });
        await writepropertyConfigs(entityType, i, 'result', result);
        expect(result.errors).toBeUndefined();
        expect(fixGUIDS(result.data)).toMatchSnapshot();
      }
    }));

});
