import { getToken, cleanLog, graphql, writeFile, fixGUIDS } from '../../../__tests__/service';
import { EntityTypes } from '../../../../../share/entityTypes';
import { getProfileList } from '../../../../../server/data/database/profileList';
import { getIdentity } from '../../../../../server/data/database/identity';
import { getEntityUrl, entityRevRouteMap } from '../../../../../share/entityRouteMaps';
import query from './query/identity';

const debug = require('debug')('app:component:base:profiles:identity');

const dirname = `${__dirname}/logs/identity`;
const writeIdentity = writeFile.bind(this, dirname);

////////////////////// M O D I F Y V A R I A B L E S ////////////////////////////
const docCount = 1;
const entityTypeRegExp = /./;
/////////////////////////////////////////////////////////////////////////////////

describe('identity', async () => {

  beforeAll(getToken);
  beforeAll(cleanLog.bind(this, dirname));

  EntityTypes.filter(en => entityTypeRegExp.test(en)).map(entityType =>
    test(entityType, async () => {
      const { token } = global;
      const entity = `/${getEntityUrl(entityType)}/ids`;
      const profileList = await getProfileList(token, entity);
      // debug('profileList', profileList);
      await writeIdentity(entityType, 'profileList', profileList);
      const count = Math.min(docCount, profileList.length);
      for (let i = 0; i < count; i++) {
        const item = profileList[i];
        const path = `/${entityRevRouteMap(entityType)}/${item}`;
        debug('path', path);
        const response = await getIdentity(token, path);
        expect(fixGUIDS(response)).toMatchSnapshot();
        const result = await graphql(query, { path });
        await writeIdentity(entityType, i, 'result', result);
        expect(result.errors).toBeUndefined();
        expect(fixGUIDS(result.data)).toMatchSnapshot();
      }
    }));

});
