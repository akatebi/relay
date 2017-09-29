import myFetch from './myFetch';
import { serverPath, fetchOptions } from './constant';

export const setModifyProfile = (token, { path, id }) => {
  const options = {
    ...fetchOptions(token),
  };
  const url = `${serverPath}${path}${id}/lock/true`;
  return myFetch(url, { ...options, method: 'PUT' })
    .then(({ id }) => ({ id }));
};
