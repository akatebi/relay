import clone from 'clone';
import { getToken, cleanLog, writeFile, graphql, getGUID, fixGUIDS } from '../../__tests__/service';
import { EntityTypes } from '../../../../share/entityTypes';
import { getProfileList } from '../../../../server/data/database/profileList';
import { getEntityUrl, entityRevRouteMap } from '../../../../share/entityRouteMaps';
import query from './query/toolbar';

const debug = require('debug')('app:src:base:toolbar');

const dirname = `${__dirname}/logs/toolbar`;
const writeTB = writeFile.bind(this, dirname);

////////////////////// M O D I F Y V A R I A B L E S ////////////////////////////
const docCount = 1;
const entityTypeRegExp = /./;
/////////////////////////////////////////////////////////////////////////////////

describe('toolbar', () => {

  beforeAll(getToken);
  beforeAll(cleanLog.bind(this, dirname));

  EntityTypes.filter(en =>
    entityTypeRegExp.test(en)).map(async (entityType) => {
    test(entityType, async () => {
      const { token } = global;
      const entity = `/${getEntityUrl(entityType)}/ids`;
      const profileList = await getProfileList(token, entity);
      expect(fixGUIDS(clone(profileList))).toMatchSnapshot();
      // debug('profileList', profileList);
      await writeTB(entityType, 'profileList', profileList);
      const count = Math.min(docCount, profileList.length);
      for (let i = 0; i < count; i++) {
        const item = profileList[i];
        const path = `/${entityRevRouteMap(entityType)}/${item}`;
        const docId = getGUID(path);
        debug('path', docId, path);
        const result = await graphql(query, { path, docId });
        await writeTB(entityType, i, 'result', result);
        expect(result.errors).toBeUndefined();
        expect(fixGUIDS(result.data)).toMatchSnapshot();
      }
    });
  });

});
