import { getToken, cleanLog, graphql, writeFile, fixGUIDS } from '../../../__tests__/service';
import { EntityTypes } from '../../../../../share/entityTypes';
import { getProfileList } from '../../../../../server/data/database/profileList';
import { getEntityUrl, entityRevRouteMap } from '../../../../../share/entityRouteMaps';
import query from './query/sectionsAll';

const debug = require('debug')('app:server:data:sectionsAll');

const dirname = `${__dirname}/logs/sectionsAll`;
const writesectionsAll = writeFile.bind(this, dirname);

////////////////////// M O D I F Y V A R I A B L E S ////////////////////////////
const docCount = 1;
const entityTypeRegExp = /./;
/////////////////////////////////////////////////////////////////////////////////

describe('sectionsAll', async () => {

  beforeAll(getToken);
  beforeAll(cleanLog.bind(this, dirname));

  EntityTypes.filter(en => entityTypeRegExp.test(en)).map(entityType =>
    test(entityType, async () => {
      const { token } = global;
      const entity = `/${getEntityUrl(entityType)}/ids`;
      const profileList = await getProfileList(token, entity);
      // debug('profileList', profileList);
      await writesectionsAll(entityType, 'profileList', profileList);
      const count = Math.min(docCount, profileList.length);
      for (let i = 0; i < count; i++) {
        const item = profileList[i];
        const path = `/${entityRevRouteMap(entityType)}/${item}`;
        debug('path & navLinksPath', path);
        const result = await graphql(query, { path });
        await writesectionsAll(entityType, i, 'result', result);
        expect(result.errors).toBeUndefined();
        expect(fixGUIDS(result.data)).toMatchSnapshot();
      }
    }));

});
