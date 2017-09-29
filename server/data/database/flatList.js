import myFetch from './myFetch';
import { serverPath, fetchOptions } from './constant';
import { flatListMap } from './maps/flatListMaps';
import { treeChildrenMap } from './maps/entityMaps';
import { entityFamilyRouteMap } from '../../../share/entityRouteMaps';

export const getFlatList = (token, hierarchy) => {
  const url = `${serverPath}${hierarchy}`;
  const options = fetchOptions(token);
  return myFetch(url, options)
    .then(data => flatListMap(data))
    .then(list => list.sort((a, b) => a.label.localeCompare(b.label)));
};

export const getSubTree = (token, hierarchy, id) => {
  const url = `${serverPath}${hierarchy}/${id}/hierarchy/flat`;
  // global.log('SUBTREE url', url);
  const options = fetchOptions(token);
  return myFetch(url, options)
    .then(data => treeChildrenMap(data))
  // .then(data => global.log(data, 'SubTree MAPPED'))
    .catch(error => error);
};

export const getLinkRevId = (token, entityType, entityId) => {
  const famToRevPath = (entityType, entityId) =>
    `${entityFamilyRouteMap(entityType)}/${entityId}/activeid`;
  const activePath = famToRevPath(entityType, entityId);
  const url = `${serverPath}/${activePath}`;
  const options = fetchOptions(token);
  return myFetch(url, options);
};
