import myFetch from './myFetch';
import { serverPath, fetchOptions } from './constant';
import { query, postBody } from './service/newpage';

export const getNewPageOrg = (token) => {
  const url = `${serverPath}/organizations`;
  const options = fetchOptions(token);
  return myFetch(url, options)
    .then(data => data.sort((a, b) => a.label.localeCompare(b.label)));
};

export const getNewPageKlass = (token, org) => {
  const url = `${serverPath}/documentclasses/query`;
  const post = query('Organization', org, true);
  const options = {
    ...fetchOptions(token),
    method: 'POST',
    body: JSON.stringify(post),
  };
  return myFetch(url, options)
    .then(data => data.sort((a, b) => a.label.localeCompare(b.label)));
};


export const getNewPageType = (token, klass) => {
  const url = `${serverPath}/documenttypes/query`;
  const post = query('DocumentClass', klass, true);
  const options = {
    ...fetchOptions(token),
    method: 'POST',
    body: JSON.stringify(post),
  };
  return myFetch(url, options)
    .then(data => data.sort((a, b) => a.label.localeCompare(b.label)));
};

export const getNewPageLayout = (token, type) => {
  const url = `${serverPath}/templatelayouts/query`;
  const post = query('DocumentType', type, false);
  const options = {
    ...fetchOptions(token),
    method: 'POST',
    body: JSON.stringify(post),
  };
  return myFetch(url, options)
    .then(data => data.sort((a, b) => a.label.localeCompare(b.label)));
};

export const postPageCreate = (token, { org, type, layout, title, documentKind, entityRoute }) => {
  const data = postBody({ org, type, layout, title, documentKind });
  const options = {
    ...fetchOptions(token),
    method: 'POST',
    body: JSON.stringify(data),
  };
  const url = `${serverPath}/${entityRoute}`;
  return myFetch(url, options);
};
