import myFetch from './myFetch';
import { serverPath, fetchOptions } from './constant';

export const getFlat = (token, nestFlatPath) => {
  const url = `${serverPath}/${nestFlatPath}/hierarchy/flat`;
  const options = fetchOptions(token);
  return myFetch(url, options);
};

export const getNested = (token, nestFlatPath) => {
  const url = `${serverPath}/${nestFlatPath}/hierarchy/nested`;
  const options = fetchOptions(token);
  return myFetch(url, options)
    .then(data => data.nodes[0]);
};

export const putNested = (token, { nested, basePath }) => {
  const url = `${serverPath}/${basePath}/revisions`;
  const options = {
    ...fetchOptions(token),
    method: 'PUT',
    body: JSON.stringify(nested),
  };
  return myFetch(url, options)
    .then(() => ({ nodes: nested }));
};
