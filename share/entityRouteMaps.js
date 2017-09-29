import {
  entityTypeToRevisionRoute,
  entityTypeToFamilyRoute,
  entityTypeToSimpleRoute,
  entityTypeToTreeNode,
  entityLabelToFamilyRoute,
  entityListLabels,
  entityTypeToLabel,
  entityTypeToPluralLabel,
  revisionableList,
  routeToEntityType,
} from './entityTypes';

// const debug = require('debug')('app:share:entityRouteMaps');

// this returns route that returns the ResultSetVM
export const entityRevRouteMap = (entityType) => {
  const route = entityTypeToRevisionRoute[entityType];
  // debug('entityRevRouteMap', entityType, route);
  if (!route) {
    const msg = `entityRevRouteMap(${entityType}) => undefined`;
    console.error(msg);
  }
  return route;
};

export const entityFamilyRouteMap = (entityType) => {
  const route = entityTypeToFamilyRoute[entityType];
  // debug('entityFamilyRouteMap', entityType, route);
  if (!route) {
    const msg = `entityFamilyRouteMap(${entityType}) => undefined`;
    console.error(msg);
  }
  return route;
};

// this returns route that returns an EntityVM list
export const entityRevSimpleMap = (entityType) => {
  const route = entityTypeToSimpleRoute[entityType];
  if (!route) {
    const msg = `entityRevSimpleMap(${entityType}) => undefined`;
    console.error(msg);
  }
  return route;
};

export const entityTreeNodeRouteMap = (entityType) => {
  // console.log('entityTreeNodeRouteMap', entityType);
  const route = entityTypeToTreeNode[entityType];
  if (!route) {
    const msg = `entityTreeNodeRouteMap(${entityType}) => undefined`;
    console.error(msg);
  }
  return route;
};

export const entityCreationFamilyRouteMap = (entityLabel) => {
  const route = entityLabelToFamilyRoute[entityLabel];
  if (!route) {
    const msg = `entityLabelFamily(${entityLabel}) => undefined`;
    console.error(msg);
  }
  return route;
};

export const entityRouteToTypeMap = (pathname) => {
  const entityRevRoute = pathname.split('/')[1];
  const entityType = routeToEntityType[entityRevRoute];
  if (!entityType) {
    const msg = `routeToEntityType(${entityRevRoute}) => undefined`;
    console.error(msg);
  }
  return entityType;
};

export const entityTypeToTreeNodeTypeMap = (entityType) => {
  const treeNodeType = entityTypeToTreeNode[entityType];
  if (!treeNodeType) {
    const msg = `routeToEntityType(${entityType}) => undefined`;
    console.error(msg);
  }
  return treeNodeType;
};

export const getEntityLabelByType = (entityType) => {
  const label = entityTypeToLabel[entityType];
  if (!label) {
    const msg = `entityListLabels has no "${entityType}"`;
    console.error(msg);
  }
  return label;
};

export const getEntityListLabel = () => {
  const entity = location.pathname.slice(1).split('/')[0];
  const key = Object.keys(entityListLabels).find(label =>
    new RegExp(label).test(entity));
  return key ? entityListLabels[key] : 'Unknown Entity';
};

export const getEntityPluralLabelByType = (entityType) => {
  const label = entityTypeToPluralLabel[entityType];
  if (!label) {
    const msg = `getEntityPluralLabelByType(${entityType}) => undefined`;
    console.error(msg);
  }
  return label;
};

export const getEntityPluralLabelByRoute = (pathname) => {
  const entityType = entityRouteToTypeMap(pathname);
  return getEntityPluralLabelByType(entityType);
};

export const isRevisionable = entity => revisionableList.includes(entity);

export const getEntityUrl = entityType =>
  (/LifeCycleConfig|User/.test(entityType) ?
    entityFamilyRouteMap(entityType) :
    entityRevRouteMap(entityType));
