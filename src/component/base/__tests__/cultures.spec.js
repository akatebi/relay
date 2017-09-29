import { getToken, cleanLog, writeFile, graphql, fixGUIDS } from '../../__tests__/service';
import query from './query/cultures';

// const debug = require('debug')('app:server:data:cultures');

const dirname = `${__dirname}/logs/cultures`;
const writeNav = writeFile.bind(this, dirname);

beforeAll(getToken);
beforeAll(cleanLog.bind(this, dirname));

test('cultures', async () => {
  const result = await graphql(query);
  await writeNav('result', result);
  expect(result.errors).toBeUndefined();
  expect(fixGUIDS(result.data)).toMatchSnapshot();
});
