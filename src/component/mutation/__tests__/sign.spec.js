import { cleanLog, writeFile, graphql, fixGUIDS } from '../../__tests__/service';
import querySignIn from './query/signIn';
import querySignOut from './query/signOut';

// const debug = require('debug')('app:component:mutation:sign');

const dirname = `${__dirname}/logs`;
const writeSI = writeFile.bind(this, dirname);

beforeAll(cleanLog.bind(this, dirname));



test('signIn', async () => {
  const params = { input: { username: 'User0', password: 'Password0!' } };
  const result = await graphql(querySignIn, params);
  await writeSI('signIn', result);
  expect(result.errors).toBeUndefined();
  const { token } = result.data.signInMutation.viewer.userIdentity;
  expect(token.length).toBeGreaterThan(500);
  delete result.data.signInMutation.viewer.userIdentity.token;
  expect(fixGUIDS(result.data)).toMatchSnapshot();
  const result2 = await graphql(querySignOut, { input: {} });
  await writeSI('signOut', result2);
  expect(result2.errors).toBeUndefined();
  expect(fixGUIDS(result2.data)).toMatchSnapshot();
});
