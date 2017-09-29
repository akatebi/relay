import deepmerge from 'deepmerge';
import { serverPath, getToken } from '../constant/app';

const debug = require('debug')('app:service:apiFetch');

function apiFetch(apiUrl, extraOptions = {}) {
  const url = `${serverPath}/${apiUrl}`;
  const Authorization = `Bearer ${getToken()}`;
  const options = deepmerge({
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization,
    },
  }, extraOptions);
  debug(url);
  // debug(options);
  return fetch(url, options)
    .then((resp) => {
      if (!resp.ok) {
        const error = { error: `${resp.status}-${resp.statusText}` };
        throw error;
      }
      // debug('resp:', resp);
      return resp;
    })
    .catch((error) => {
      debug('API-FETCH Error:', error);
      throw error;
    });
}

export default apiFetch;

export const myFetch = (url, extraOptions = {}) => {
  const Authorization = `Bearer ${getToken()}`;
  const options = deepmerge({
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization,
    },
  }, extraOptions);
  // debug(url);
  // debug(options);
  return fetch(url, options);
};
