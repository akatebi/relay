import clone from 'clone';
import { getToken, cleanLog, writeFile, graphql, getGUID, fixGUIDS } from '../../../__tests__/service';
import { EntityTypes } from '../../../../../share/entityTypes';
import { getProfileList } from '../../../../../server/data/database/profileList';
import { entityRevRouteMap } from '../../../../../share/entityRouteMaps';
import query from './query/treeModeSwitcher';

const debug = require('debug')('app:base:entities:treeModeSwitcher');

const dirname = `${__dirname}/logs/treeModeSwitcher`;
const writeTB = writeFile.bind(this, dirname);

////////////////////// M O D I F Y V A R I A B L E S ////////////////////////////
const docCount = 1;
const entityTypeRegExp = /ChoiceList|Hierarchy$/;
/////////////////////////////////////////////////////////////////////////////////

describe('treeModeSwitcher', () => {

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
        const path = `/${entityRevRouteMap(entityType)}/${item}`;
        const docId = getGUID(path);
        debug('docId', docId);
        const basePath = path.split('/')[1];
        const active = docId || 'active';
        const nestFlatPath = `${basePath}/revisions/${active}`;
        const flatOnly = basePath.includes('choicelists');
        debug('path', path);
        debug('basePath', basePath);
        debug('entityType', entityType);
        debug('flatOnly', flatOnly);
        const params = { nestFlatPath, path, entityType, flatOnly };
        const result = await graphql(query, params);
        await writeTB(entityType, i, 'result', result);
        expect(result.errors).toBeUndefined();
        expect(fixGUIDS(result.data)).toMatchSnapshot();
      }
    });
  });

});
