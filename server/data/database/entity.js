import myFetch from './myFetch';
import { serverPath, fetchOptions } from './constant';

export const getEntity = (token, path) => {
  const url = `${serverPath}${path}/entity`;
  const options = fetchOptions(token);
  if (/^\/document/.test(path) || /^\/documenttypes/.test(path)) {
    return Promise.resolve(null);
  }
  return myFetch(url, options);
};

export const getEntityProfile = (token, path) => {
  if (path.includes('documents') || path.includes('documenttypes')) {
    return Promise.resolve({});
  }
  const url = `${serverPath}${path}/identity/entityprofile`;
  const options = fetchOptions(token);
  return myFetch(url, options);
};
