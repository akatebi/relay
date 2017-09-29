import myFetch from './myFetch';
import {
  serverHost,
  serverPath,
  authOptions,
  fetchOptions,
} from './constant';

export const getUserIdentityByToken = token =>
  myFetch(`${serverPath}/users/identity`, fetchOptions(token))
    .then(userIdentity => ({ userIdentity: { ...userIdentity, token } }));
  // .catch(global.error);

export const getAccessToken = (username, password) =>
  myFetch(`${serverHost}/token`, authOptions(username, password))
    .then(json => json.access_token);

export const getUserIdentityByName = (username, password) =>
  getAccessToken(username, password)
    .then(token => getUserIdentityByToken(token));
