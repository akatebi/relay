import myFetch from './myFetch';
import { serverPath, fetchOptions } from './constant';

export const getAllCultures = (token) => {
  const url = `${serverPath}/cultures`;
  const options = fetchOptions(token);
  return myFetch(url, options);
};

export const getEnabledCultures = (token) => {
  const url = `${serverPath}/cultures/active/true`;
  const options = fetchOptions(token);
  return myFetch(url, options)
    .then(data => data.sort((a, b) => a.displayName.localeCompare(b.displayName)));
};

export const putEnabledCultures = (token, cultures) => {
  const url = `${serverPath}/cultures/active`;
  return Promise.all(cultures.map((culture) => {
    const options = {
      method: 'PUT',
      body: JSON.stringify(culture),
      ...fetchOptions(token),
    };
    return myFetch(url, options);
  }));
};
