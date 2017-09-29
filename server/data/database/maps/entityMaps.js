
import moment from 'moment';

const nullLabel = '** ERROR - null **';

export const lookupMap = list => list.map(entity => ({ value: entity.id, label: entity.label }));
export const orgLookupMap = orgs => ([...lookupMap(orgs)]);
export const userLookupMap = users => ([...lookupMap(users)]);

/* Entity List Maps */

export const entityListMap = data =>
  data.map(entity => ({
    id: entity.id,
    label: entity.label || nullLabel,
    // entityType: entity.entityType,
    state: entity.standardProperties
      .find(prop => prop.name === 'Rev_FullStatus').valueVM,
    modifiedDate: moment(entity.standardProperties
      .find(prop => prop.name === 'Rev_Utc_Modified').valueVM).format('lll'),
    docId: entity.profileDocument.id,
  }));

export const flatListMap = data =>
  data.map(entity => ({
    id: entity.id,
    familyId: entity.familyId,
    label: entity.label || nullLabel,
    entityType: entity.entityType,
  }));


export const navMap = data =>
  data.nodes
    .map(({ url, label }) => {
      if (!url) url = 'all';
      return { url, label };
    });

/* Entity Maps */
export const entityMap = entity =>
  ({
    id: entity.id,
    familyId: entity.familyId,
    entityType: entity.entityType,
    isFamily: entity.isFamily,
    cultureCode: entity.cultureCode,
    label: entity.label || '(none)',
    operation: entity.operation,
  });

export const nestedNodeMap = nodes =>
  nodes.map(({
    children,
    nodeObj: {
      id, label, entityType, familyId, isFamily, operation,
    } }) => {
    const obj = {
      module: label,
      entityVM: {
        id,
        entityType,
        familyId,
        isFamily,
        label,
        operation,
      },
    };
    if (children && children.length) {
      obj.collapsed = false;
      obj.children = nestedNodeMap(children);
    } else {
      obj.leaf = true;
    }
    return obj;
  });

export const nestedEntityMap = nodes =>
  nodes.map((node) => {
    const obj = { name: node.nodeObj.label, children: [] };
    if (node.children && node.children.length) {
      obj.children = nestedEntityMap(node.children);
    }
    return obj;
  });

export const treeChildrenMap = tree =>
  tree.nodes.map(item =>
    ({
      indent: item.indent,
      entityVM: {
        id: item.id,
        familyId: item.familyId,
        entityType: item.entityType,
        isFamily: item.isFamily,
        label: item.label,
        cultureCode: item.cultureCode,
        operation: item.operation,
      },
    }),
  ).slice(1);

export const choiceListMap = (list, path) => {
  const base = path.split('/')[1];
  // global.log('choiceListMap PATH', base);
  return list.map((item) => {
    // global.log('*** ITEM', item.label);
    if (item.label === 'CategoryHierarchy') {
      if (base === 'choicelists') {
        return ({
          url: item.url,
          label: 'Choice List',
        });
      }
      return ({
        url: item.url,
        label: 'Category Hierarchy',
      });
    }
    return item;
  });
};

export default entityMap;
