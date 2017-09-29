import { getToken, cleanLog, writeFile, graphql, fixGUIDS } from '../../__tests__/service';
import query from './query/navMenu';

// const debug = require('debug')('app:server:data:navMenu');

const dirname = `${__dirname}/logs/navMenu`;
const writeNav = writeFile.bind(this, dirname);

beforeAll(getToken);
beforeAll(cleanLog.bind(this, dirname));

test('navMenu', async () => {
  const { token } = global;
  const result = await graphql(query, { token });
  expect(result.errors).toBeUndefined();
  await writeNav('result', result);
  const { userIdentity } = result.data.viewer;
  expect(userIdentity.token.length).toBeGreaterThan(500);
  delete userIdentity.token;
  expect(fixGUIDS(result.data)).toMatchSnapshot();
});
