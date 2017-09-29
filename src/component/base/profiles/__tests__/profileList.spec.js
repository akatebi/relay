import { getToken, cleanLog, graphql, writeFile, fixGUIDS } from '../../../__tests__/service';
import { EntityTypes } from '../../../../../share/entityTypes';
import query from './query/profileList';
import { entityRevRouteMap } from '../../../../../share/entityRouteMaps';

const debug = require('debug')('app:server:data:profileList');

const dirname = `${__dirname}/logs/identity`;
const writePL = writeFile.bind(this, dirname);

////////////////////// M O D I F Y V A R I A B L E S ////////////////////////////
const entityTypeRegExp = /./;
/////////////////////////////////////////////////////////////////////////////////

describe('profileList', () => {

  beforeAll(getToken);
  beforeAll(cleanLog.bind(this, dirname));

  EntityTypes.filter(en => entityTypeRegExp.test(en))
    .map(async entityType =>
      test(entityType, async () => {
        const entity = `/${entityRevRouteMap(entityType)}`;
        debug('entity', entity);
        const result = await graphql(query, { entity });
        await writePL(entityType, 'result', result);
        expect(result.errors).toBeUndefined();
        expect(fixGUIDS(result.data)).toMatchSnapshot();
      }));

});
