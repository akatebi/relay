import myFetch from './myFetch';
import { serverPath, fetchOptions } from './constant';

export const getContentIdentity = (token, entityRoute) => {
  const path = `${serverPath}/${entityRoute}/defaultcontentidentityset`;
  const options = fetchOptions(token);
  return myFetch(path, options);
};
