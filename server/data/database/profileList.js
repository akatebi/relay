import myFetch from './myFetch';
import { serverPath, fetchOptions } from './constant';

export const getProfileList = (token, entity) => {
  const url = `${serverPath}${entity}`;
  const options = fetchOptions(token);
  return myFetch(url, options);
};
