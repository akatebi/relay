import myFetch from './myFetch';
import { serverPath, fetchOptions } from './constant';

export const getAssociations = (token, path) => {
  const url = `${serverPath}${path}/associations`;
  const options = fetchOptions(token);
  return myFetch(url, options);
};
