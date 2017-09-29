import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';

import {
  getSection,
} from './database/section';

import { getToken } from './database/constant';
import { GraphQLEntityVMType } from './entityVM';
import { GraphQLRelationshipToPropertyContent } from './identity';

const lineItemContentRelationshipsTail = new GraphQLObjectType({
  name: 'LineItemContentRelationshipsTail',
  fields: {
    config: { type: new GraphQLNonNull(GraphQLID) },
    roleListContentRelationships: { type: new GraphQLNonNull(new GraphQLList(GraphQLRelationshipToPropertyContent)) },
    dateContentRelationships: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLRelationshipToPropertyContent)),
      resolve: ({ dateContentRelationships }) => (dateContentRelationships || []),
    },
    configId: { type: new GraphQLNonNull(GraphQLID) },
    operation: { type: new GraphQLNonNull(GraphQLString) },
    label: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const lineItemContentRelationships = new GraphQLObjectType({
  name: 'LineItemContentRelationships',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    relationshipType: { type: new GraphQLNonNull(GraphQLString) },
    head: { type: new GraphQLNonNull(GraphQLEntityVMType) },
    tail: { type: new GraphQLNonNull(lineItemContentRelationshipsTail) },
    configId: { type: new GraphQLNonNull(GraphQLString) },
    operation: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export const GraphQLSection = new GraphQLObjectType({
  name: 'Section',
  fields: {
    roleListContentRelationships: {
      type: new GraphQLNonNull(new GraphQLList(lineItemContentRelationships)),
    },
    lineItemContentRelationships: {
      type: new GraphQLNonNull(new GraphQLList(lineItemContentRelationships)),
    },
    familyId: { type: new GraphQLNonNull(GraphQLString) },
    isFamily: { type: new GraphQLNonNull(GraphQLBoolean) },
    cultureCode: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLID) },
    entityType: { type: new GraphQLNonNull(GraphQLString) },
    label: { type: new GraphQLNonNull(GraphQLString) },
    operation: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export const section = {
  type: GraphQLSection,
  args: {
    secPath: { type: GraphQLString },
  },
  resolve: (...args) => {
    const token = getToken(args[2], args[0]);
    const { secPath } = args[1];
    return getSection(token, secPath);
  },
};
