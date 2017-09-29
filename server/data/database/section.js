import myFetch from './myFetch';
import { serverPath, fetchOptions } from './constant';

export const getSection = (token, secPath) => {
  const url = `${serverPath}${secPath}`;
  const options = fetchOptions(token);
  return myFetch(url, options);
};
