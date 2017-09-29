import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import { getIdentity } from './database/identity';

import { GraphQLEntityVMType } from './entityVM';

import { getToken } from './database/constant';

import {
  GraphQLPropertyUnionType,
  GraphQLPropertyContentConfig,
} from './valueVM';

export const GraphQLPropertyStandardType = new GraphQLObjectType({
  name: 'PropertyStandard',
  fields: {
    name: { type: GraphQLString },
    propertyType: { type: new GraphQLNonNull(GraphQLString) },
    entityType: { type: new GraphQLNonNull(GraphQLString) },
    label: { type: new GraphQLNonNull(GraphQLString) },
    operation: { type: new GraphQLNonNull(GraphQLString) },
    config: { type: new GraphQLNonNull(GraphQLPropertyContentConfig) },
    valueVM: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export const GraphQLPropertyContentType = new GraphQLObjectType({
  name: 'PropertyContent',
  fields: {
    name: { type: GraphQLString },
    id: { type: new GraphQLNonNull(GraphQLID) },
    propertyType: { type: new GraphQLNonNull(GraphQLString) },
    reportingKey: { type: GraphQLString },
    entityType: { type: new GraphQLNonNull(GraphQLString) },
    isEditable: { type: new GraphQLNonNull(GraphQLBoolean) },
    label: { type: new GraphQLNonNull(GraphQLString) },
    operation: { type: new GraphQLNonNull(GraphQLString) },
    config: { type: new GraphQLNonNull(GraphQLPropertyContentConfig) },
    valueVM: {
      type: new GraphQLNonNull(GraphQLPropertyUnionType),
      resolve: ({ valueVM, propertyType }) => ({ valueVM, propertyType }),
    },
  },
});

export const GraphQLRelationshipToPropertyContent = new GraphQLObjectType({
  name: 'RelationshipToPropertyContent',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    relationshipType: { type: new GraphQLNonNull(GraphQLString) },
    head: { type: new GraphQLNonNull(GraphQLEntityVMType) },
    tail: { type: new GraphQLNonNull(GraphQLPropertyContentType) },
    configId: { type: new GraphQLNonNull(GraphQLString) },
    operation: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const GraphQLLifeCycleStateContent = new GraphQLObjectType({
  name: 'LifeCycleStateContent',
  fields: {
    config: { type: new GraphQLNonNull(GraphQLEntityVMType) },
    state: { type: new GraphQLNonNull(GraphQLString) },
    completed: { type: new GraphQLNonNull(GraphQLBoolean) },
    familyId: { type: new GraphQLNonNull(GraphQLString) },
    isFamily: { type: new GraphQLNonNull(GraphQLBoolean) },
    cultureCode: { type: GraphQLString },
    id: { type: new GraphQLNonNull(GraphQLID) },
    reportingKey: { type: GraphQLString },
    entityType: { type: new GraphQLNonNull(GraphQLString) },
    label: { type: new GraphQLNonNull(GraphQLString) },
    operation: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const GraphQLLifeCycle = new GraphQLObjectType({
  name: 'LifeCycle',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      // resolve: ({ id }) => global.log(id, '######ID LifeCycle'),
    },
    lifeCycleStateContents: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLLifeCycleStateContent)),
    },
  },
});

export const GraphQLIdentityType = new GraphQLObjectType({
  name: 'Identity',
  fields: {
    organization: { type: new GraphQLNonNull(GraphQLEntityVMType) },
    documentType: { type: new GraphQLNonNull(GraphQLEntityVMType) },
    documentClass: { type: new GraphQLNonNull(GraphQLEntityVMType) },
    lifeCycle: { type: new GraphQLNonNull(GraphQLLifeCycle) },
    reportingKey: { type: GraphQLString },
    formHeader: { type: GraphQLString },
    locked: { type: GraphQLBoolean },
    lockedBy: { type: GraphQLString },
    standardProperties: { type: new GraphQLNonNull(new GraphQLList(GraphQLPropertyStandardType)) },
    customProperties: { type: new GraphQLNonNull(new GraphQLList(GraphQLRelationshipToPropertyContent)) },
    identities: { type: new GraphQLNonNull(new GraphQLList(GraphQLRelationshipToPropertyContent)) },
    familyId: { type: new GraphQLNonNull(GraphQLString) },
    isFamily: { type: new GraphQLNonNull(GraphQLBoolean) },
    cultureCode: { type: new GraphQLNonNull(GraphQLString) },
    id: {
      type: new GraphQLNonNull(GraphQLID),
      // resolve: ({ id }) => global.log(id, '######ID Identity'),
    },
    entityType: { type: new GraphQLNonNull(GraphQLString) },
    label: { type: new GraphQLNonNull(GraphQLString) },
    operation: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export const identity = {
  type: GraphQLIdentityType,
  args: {
    path: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: (...args) => {
    const token = getToken(args[2], args[0]);
    const { path } = args[1];
    const { dataLoader } = args[0];
    return getIdentity(token, path, dataLoader);
  },
};
