import clone from 'clone';
import { getToken, cleanLog, writeFile, graphql, fixGUIDS } from '../../../__tests__/service';
import { EntityTypes } from '../../../../../share/entityTypes';
import { getProfileList } from '../../../../../server/data/database/profileList';
import { entityRevRouteMap } from '../../../../../share/entityRouteMaps';
import query from './query/entityTree';

const debug = require('debug')('app:src:base:entities:entityTree');

const dirname = `${__dirname}/logs/entityTree`;
const writeTB = writeFile.bind(this, dirname);

////////////////////// M O D I F Y V A R I A B L E S ////////////////////////////
const docCount = 1;
const entityTypeRegExp = /OrganizationHierarchy/;
/////////////////////////////////////////////////////////////////////////////////

describe('entityTree', () => {

  beforeAll(getToken);
  beforeAll(cleanLog.bind(this, dirname));

  EntityTypes.filter(en =>
    entityTypeRegExp.test(en)).map(async (entityType) => {
    test(entityType, async () => {
      const { token } = global;
      const entity = `/${entityRevRouteMap(entityType)}/ids`;
      const profileList = await getProfileList(token, entity);
      expect(fixGUIDS(clone(profileList))).toMatchSnapshot();
      // debug('profileList', profileList);
      await writeTB(entityType, 'profileList', profileList);
      const count = Math.min(docCount, profileList.length);
      for (let i = 0; i < count; i++) {
        const item = profileList[i];
        const entity = `/${entityRevRouteMap(entityType)}/${item}/hierarchy/nested`;
        debug('entity', entity);
        const result = await graphql(query, { entity });
        await writeTB(entityType, i, 'result', result);
        expect(result.errors).toBeUndefined();
        expect(fixGUIDS(result.data)).toMatchSnapshot();
      }
    });
  });

});
