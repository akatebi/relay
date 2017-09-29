import myFetch from './myFetch';
import { serverPath, fetchOptions } from './constant';

export const getLockStatus = (token, path) => {
  const options = fetchOptions(token);
  const url = `${serverPath}${path}/lock`;
  return myFetch(url, options);
};

export const setLockProfile = (token, path) => {
  const options = {
    method: 'PUT',
    ...fetchOptions(token),
  };
  const url = `${serverPath}${path}/lock/false`;
  if (process.platform === 'linux') {
    const isLocked = true;
    const id = url.split('/').slice(-2, -1).pop();
    return { isLocked, id };
  }
  return myFetch(url, options);
};

export const unlockProfile = (token, path) => {
  const options = {
    method: 'PUT',
    ...fetchOptions(token),
  };
  const url = `${serverPath}${path}/unlock`;
  return myFetch(url, options);
};
