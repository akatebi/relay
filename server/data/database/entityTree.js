import myFetch from './myFetch';
import { serverPath, fetchOptions } from './constant';
import { nestedEntityMap } from './maps/entityMaps';


export const getEntityTree = (token, entity) => {
  const url = `${serverPath}${entity}`;
  const options = fetchOptions(token);
  return myFetch(url, options)
    .then(data => nestedEntityMap(data.nodes))
    .then(data => data[0]);
};
