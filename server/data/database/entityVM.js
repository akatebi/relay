import { serverPath, fetchOptions } from './constant';
import { entityFamilyRouteMap } from '../../../share/entityRouteMaps';

export const getLinkRevId = (token, entityType, entityId, isFamily, dataLoader) => {
  // console.log('getLinkRevId', token, entityType, entityId, isFamily);
  if (!isFamily) {
    return '';
  }
  const famToRevPath = (entityType, entityId) =>
    `${entityFamilyRouteMap(entityType)}/${entityId}/activeid`;
  const activePath = famToRevPath(entityType, entityId.slice(0, 36));
  const url = `${serverPath}/${activePath}`;
  const options = fetchOptions(token);
  return dataLoader.load({ url, options });
};
