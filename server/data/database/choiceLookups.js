import myFetch from './myFetch';
import { serverPath, fetchOptions } from './constant';
import { supportedCreationEntities } from '../../../share/entityTypes';

export const getCreationEntityTypeLookup = (token) => {
  const url =
    `${serverPath}/choiceLists/revisions/key/SYSTEM.DATA.CATEGORY_HIERARCHY.ENTITY_TYPE/hierarchy/flat`;
  const options = fetchOptions(token);
  return myFetch(url, options)
    .then(data => data.nodes)
    .then(data => data.filter(type => supportedCreationEntities.includes(type.label)))
    .then(data => data.sort((a, b) => a.label.localeCompare(b.label)))
    .then(data => data.map(x => ({ value: x.id, label: x.label })));
};

export const getValidationTypeLookup = (token) => {
  const url =
    `${serverPath}/choiceLists/revisions/key/SYSTEM.DATA.CHOICELIST.VALIDATION_TYPE/hierarchy/flat`;
  const options = fetchOptions(token);
  return myFetch(url, options)
    .then(data => data.nodes)
    .then(data => data.filter(x => x.indent))
    .then(data => data.map(x => ({ value: x.id, label: x.label })));
};
