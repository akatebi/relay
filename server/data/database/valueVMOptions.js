import myFetch from './myFetch';
import { serverPath, fetchOptions } from './constant';
import {
  entityTreeNodeRouteMap,
  entityRevSimpleMap,
} from '../../../share/entityRouteMaps';


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export const getEntityOptionTypeLookup = (token, entityType) => {
  const options = fetchOptions(token);
  const url = `${serverPath}/${entityTreeNodeRouteMap(entityType)}`;
  return myFetch(url, options)
    .then(data => data.sort((a, b) => a.label.localeCompare(b.label)));
};

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
export const getCategoryOptions = (token) => {
  const url = `${serverPath}/dictionaryentries/simple`;
  const options = fetchOptions(token);
  return myFetch(url, options);
};

export const getRoleListOptions = (token) => {
  const url = `${serverPath}/applicationroles/simple`;
  const options = fetchOptions(token);
  return myFetch(url, options);
};

const prefix = `${serverPath}/choiceLists/revisions/key/SYSTEM.DATA.CATEGORY_HIERARCHY`;

export const getEntityTypeOptions = (token) => {
  const options = fetchOptions(token);
  const url = `${prefix}.ENTITY_TYPE/hierarchy/flat`;
  return myFetch(url, options)
    .then(data => data.nodes)
    .then(data => data.filter(({ indent }) => indent));
};

export const getValidationTypeOptions = (token, dataLoader) => {
  const options = fetchOptions(token);
  const url = `${prefix}.VALIDATION_TYPE/hierarchy/flat`;
  return dataLoader.load({ url, options })
    .then(data => data.nodes)
    .then(data => data.filter(({ indent }) => indent));
};

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export const getEntityOptions = (token, entityType, dataLoader) => {
  const path = entityRevSimpleMap(entityType);
  const url = `${serverPath}/${path}`;
  const options = fetchOptions(token);
  if (dataLoader) return dataLoader.load({ url, options });
  return myFetch(url, options);
};

export const getEntityListOptions = (token, entityType, dataLoader) => {
  const path = entityRevSimpleMap(entityType);
  const url = `${serverPath}/${path}`;
  const options = fetchOptions(token);
  if (dataLoader) return dataLoader.load({ url, options });
  return myFetch(url, options);
};
