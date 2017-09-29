import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import { getToken } from './database/constant';

import { getSelfRolesLookup }
  from './database/selfRolesLookup';

const GraphQLSelfRoleItemType = new GraphQLObjectType({
  name: 'SelfRoleItem',
  fields: {
    label: { type: new GraphQLNonNull(GraphQLString) },
    value: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ id }) => (id.length > 36 ? id.slice(0, 36) : id),
    },
    // -----------------------------------------------
    cultureCode: { type: GraphQLString },
    entityType: { type: new GraphQLNonNull(GraphQLString) },
    familyId: { type: new GraphQLNonNull(GraphQLString) },
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: ({ id }) => (id.length > 36 ? id.slice(0, 36) : id),
    },
    isFamily: { type: new GraphQLNonNull(GraphQLBoolean) },
    operation: { type: new GraphQLNonNull(GraphQLString) },
    reportingKey: { type: GraphQLString },
  },
});

export const GraphQLSelfRolesLookupType = new GraphQLObjectType({
  name: 'SelfRolesLookup',
  fields: {
    selfRoles: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLSelfRoleItemType)),
      resolve: ({ token }) => getSelfRolesLookup(token),
    },
  },
});

export const selfRolesLookup = {
  type: GraphQLSelfRolesLookupType,
  resolve: (...args) => {
    const token = getToken(args[2], args[0]);
    return { token };
  },
};
