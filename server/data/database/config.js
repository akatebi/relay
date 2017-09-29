import myFetch from './myFetch';
import { serverPath, fetchOptions } from './constant';

export const getConfig = (token, path) => {
  const url = `${serverPath}${path}/configs`;
  const options = fetchOptions(token);
  return myFetch(url, options);
};
