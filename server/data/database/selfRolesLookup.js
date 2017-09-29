import myFetch from './myFetch';
import { serverPath, fetchOptions } from './constant';

export const getSelfRolesLookup = (token) => {
  const url = `${serverPath}/applicationroles/simple`;
  const options = {
    ...fetchOptions(token),
    method: 'POST',
    body: JSON.stringify(['UserIdentity']),
  };
  return myFetch(url, options)
    .then(data => data.sort((a, b) => a.label.localeCompare(b.label)));
};
