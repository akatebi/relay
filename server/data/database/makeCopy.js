import myFetch from './myFetch';
import { serverPath, fetchOptions } from './constant';

export const makeCopyProfile = (token, { path, id }) => {
  const options = {
    ...fetchOptions(token),
  };
  const url = `${serverPath}${path}${id}/makecopy`;
  return myFetch(url, { ...options, method: 'POST' })
    .then(({ id }) => ({ id }));
};
