import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import { getIdentity } from './database/identity';

import { getToken } from './database/constant';

import {
  getCategoryOptions,
  getEntityOptions,
  getEntityListOptions,
  getRoleListOptions,
  getEntityTypeOptions,
  getValidationTypeOptions,
} from './database/valueVMOptions';

import { GraphQLEntityVMType } from './entityVM';

const GraphQLValueVMOptionsType = new GraphQLObjectType({
  name: 'ValueVMOptions',
  fields: {
    categoryOptions: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLEntityVMType)),
      resolve: ({ token }) => getCategoryOptions(token),
    },
    entityTypeOptions: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLEntityVMType)),
      resolve: ({ token }) => getEntityTypeOptions(token),
    },
    roleListOptions: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLEntityVMType)),
      resolve: ({ token }) => getRoleListOptions(token),
    },
    validationTypeOptions: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLEntityVMType)),
      resolve: ({ token, dataLoader }) => getValidationTypeOptions(token, dataLoader),
    },
  },
});

export const valueVMOptions = {
  type: new GraphQLNonNull(GraphQLValueVMOptionsType),
  resolve: (...args) => {
    const token = getToken(args[2], args[0]);
    const { dataLoader } = args[0];
    return { token, dataLoader };
  },
};

const GraphQLValueVMTypeOptionsType = new GraphQLObjectType({
  name: 'ValueVMTypeOptions',
  fields: {
    entityOptions: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLEntityVMType)),
      resolve: ({ token, entityType, dataLoader }) =>
        getEntityOptions(token, entityType, dataLoader),
    },
    entityListOptions: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLEntityVMType)),
      resolve: ({ token, entityListType, dataLoader }) =>
        getEntityListOptions(token, entityListType, dataLoader),
    },
  },
});

const getEntityType = (customProperty, type) => {
  const { tail: { config, entityType: et } } = customProperty;
  let entityType = et;
  const customAttribute = config.customAttributes.find(({ name }) => name === type);
  const { value: { value } = {} } = customAttribute;
  entityType = value;
  return entityType;
};

export const valueVMTypeOptions = {
  type: new GraphQLNonNull(GraphQLValueVMTypeOptionsType),
  args: {
    path: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: (...args) => {
    const token = getToken(args[2], args[0]);
    const { path } = args[1];
    const { dataLoader } = args[0];
    return getIdentity(token, path, dataLoader)
      .then(({ customProperties }) => {
        const c1 = customProperties.find(({ tail: { propertyType } }) => propertyType === 'Entity');
        const c2 = customProperties.find(({ tail: { propertyType } }) => propertyType === 'EntityList');
        const entityType = getEntityType(c1, 'ValueType');
        const entityListType = getEntityType(c2, 'ListType');
        return { token, dataLoader, entityType, entityListType };
      });
  },
};
