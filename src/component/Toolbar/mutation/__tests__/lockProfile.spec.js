import { cleanLog, getToken, writeFile, lockDocument, fixGUIDS }
  from '../../../__tests__/service';
import { EntityTypes } from '../../../../../share/entityTypes';
import { getProfileList } from '../../../../../server/data/database/profileList';
import { entityFamilyRouteMap, entityRevRouteMap }
  from '../../../../../share/entityRouteMaps';

const debug = require('debug')('app:component:Toolbar:lock');

////////////////////// M O D I F Y V A R I A B L E S ////////////////////////////
const docCount = 1;
const entityTypeRegExp = /./;
/////////////////////////////////////////////////////////////////////////////////

describe('mutation', () => {

  beforeAll(getToken);
  beforeAll(cleanLog.bind(this, 'lock'));

  const writePS = writeFile.bind(this, 'lock');

  EntityTypes.filter(en => entityTypeRegExp.test(en))
    .map(async entityType =>
      test(`lockProfile ${entityType}`, async () => {
        const entity = `/${entityFamilyRouteMap(entityType)}/revisions/ids`;
        const { token } = global;
        const profileList = await getProfileList(token, entity);
        await writePS(entityType, 'profileList', profileList);
        const count = profileList.length > docCount ? docCount : profileList.length;
        for (let i = 0; i < count; i++) {
          const item = profileList[i];
          const path = `/${entityRevRouteMap(entityType)}/${item}`;
          debug('path', path);
          const result = await lockDocument(path, 'get');
          await writePS(entityType, i, result);
          expect(result.errors).toBeUndefined();
          expect(fixGUIDS(result.data)).toMatchSnapshot();
        }
      }));

});
