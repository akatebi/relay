import { cleanLog, getToken, graphql, writeFile, fixGUIDS } from './service';
import valueVMOptionsQuery from './query/valueVMOptions';

// const debug = require('debug')('app:server:data:valueVMOptions');

const dirname = `${__dirname}/logs/valueVMOptions`;
const writeVM = writeFile.bind(this, dirname);

////////////////////// M O D I F Y V A R I A B L E S ////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

beforeAll(getToken);
beforeAll(cleanLog.bind(this, dirname));

test('valueVMOptions', async () => {
  const result = await graphql(valueVMOptionsQuery);
  await writeVM('result', result);
  expect(result.errors).toBeUndefined();
  expect(fixGUIDS(result.data)).toMatchSnapshot();
});
