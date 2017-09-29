import myFetch from './myFetch';
import {
  serverPath,
  fetchOptions,
} from './constant';

export const getUsers = (token) => {
  const url = `${serverPath}/users`;
  const options = fetchOptions(token);
  return myFetch(url, options);
};
