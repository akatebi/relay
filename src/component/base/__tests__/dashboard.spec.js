import { getToken, cleanLog, writeFile, graphql, fixGUIDS } from '../../__tests__/service';
import query from './query/dashboard';

// const debug = require('debug')('app:server:data:dashboard');

const dirname = `${__dirname}/logs/dashboard`;
const writeNav = writeFile.bind(this, dirname);

beforeAll(getToken);
beforeAll(cleanLog.bind(this, dirname));

test('dashboard', async () => {
  const { token } = global;
  const result = await graphql(query, { token });
  await writeNav('result', result);
  expect(result.errors).toBeUndefined();
  expect(fixGUIDS(result.data)).toMatchSnapshot();
});
