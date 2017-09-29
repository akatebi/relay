import { getToken, cleanLog, writeFile, graphql } from '../../__tests__/service';
import query from './query/auth';

// const debug = require('debug')('app:server:data:auth');

const dirname = `${__dirname}/logs/auth`;
const writeNav = writeFile.bind(this, dirname);

beforeAll(getToken);
beforeAll(cleanLog.bind(this, dirname));

test('auth', async () => {
  const result = await graphql(query);
  await writeNav('result', result);
  expect(result.errors).toBeUndefined();
  expect(result.data.viewer).toBeNull();
});
