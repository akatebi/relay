import myFetch from './myFetch';
import { serverPath, fetchOptions } from './constant';
import { navMap, choiceListMap } from './maps/entityMaps';

export const getProfileNav = (token, path) => {
  const url = `${serverPath}${path}/nav`;
  const options = fetchOptions(token);
  return myFetch(url, options)
    .then(data => navMap(data))
    .then(data => choiceListMap(data, path));
};
