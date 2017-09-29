import { cleanLog, getToken, writeFile, graphql, fixGUIDS } from '../../../__tests__/service';
import { EntityTypes } from '../../../../../share/entityTypes';
import query from './query/newPage';

const debug = require('debug')('app:component:newPage:mutation');

const dirname = `${__dirname}/logs`;
const writeNP = writeFile.bind(this, dirname);

////////////////////// M O D I F Y V A R I A B L E S ////////////////////////////
const docCount = 1;
const entityTypeRegExp = /./;
/////////////////////////////////////////////////////////////////////////////////

describe('newPage mutation', async () => {

  beforeAll(getToken);
  beforeAll(cleanLog.bind(this, dirname));

  EntityTypes.filter(en => entityTypeRegExp.test(en)).map(entityType =>
    test(entityType, async () => {
      const params = { input: { username: 'User0', password: 'Password0!' } };
      const result = await graphql(query, params);
      await writeNP('newPage', result);
      expect(result.errors).toBeUndefined();
      expect(fixGUIDS(result.data)).toMatchSnapshot();
    }));

});
