import { cleanLog, getToken, graphql, writeFile, fixGUIDS } from '../../../__tests__/service';
import { EntityTypes } from '../../../../../share/entityTypes';
import { getProfileList } from '../../../../../server/data/database/profileList';
import { getEntityUrl, entityRevRouteMap } from '../../../../../share/entityRouteMaps';
import AppCycleQuery from './query/appCycle';

const debug = require('debug')('app:component:AppCycle');

const dirname = `${__dirname}/logs/AppCycle`;
const writeVM = writeFile.bind(this, dirname);

////////////////////// M O D I F Y V A R I A B L E S ////////////////////////////
const docCount = 1;
const entityTypeRegExp = /./;
/////////////////////////////////////////////////////////////////////////////////

describe.skip('Approval Cycle', () => {

  beforeAll(getToken);
  beforeAll(cleanLog.bind(this, dirname));

  EntityTypes.filter(en => entityTypeRegExp.test(en))
    .map(async entityType =>
      test(entityType, async () => {
        const entity = `/${getEntityUrl(entityType)}/ids`;
        const { token } = global;
        const profileList = await getProfileList(token, entity);
        await writeVM(entityType, 'profileList', profileList);
        const count = Math.min(docCount, profileList.length);
        for (let i = 0; i < count; i++) {
          const item = profileList[i];
          const path = `/${entityRevRouteMap(entityType)}/${item}`;
          debug('path', path);
          const result = await graphql(AppCycleQuery, { path });
          await writeVM(entityType, i, 'AppCycle', result);
          expect(result.errors).toBeUndefined();
          expect(fixGUIDS(result.data)).toMatchSnapshot();
        }
      }));

});
