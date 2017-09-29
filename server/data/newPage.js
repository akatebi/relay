import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import {
  mutationWithClientMutationId,
} from 'graphql-relay';

import {
  postPageCreate,
  getNewPageOrg,
  getNewPageKlass,
  getNewPageType,
  getNewPageLayout,
} from './database/newPage';

import { getToken } from './database/constant';

// import { GraphQLMyTrackingType } from './dashboard';

const GraphQLOptionItemType = new GraphQLObjectType({
  name: 'NewPageItem',
  fields: {
    id: { type: GraphQLString },
    label: { type: GraphQLString },
  },
});

////////////////////////////////////////////////////////////////

const GraphQLNewPageOrg = new GraphQLObjectType({
  name: 'NewPageOrg',
  fields: {
    options: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLOptionItemType)),
      resolve: ({ token, id }) => getNewPageOrg(token, id),
    },
  },
});

export const newPageOrg = {
  type: GraphQLNewPageOrg,
  resolve: (...args) => {
    const token = getToken(args[2], args[0]);
    return { token };
  },
};

////////////////////////////////////////////////////////////////

const GraphQLNewPageKlass = new GraphQLObjectType({
  name: 'NewPageKlass',
  fields: {
    options: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLOptionItemType)),
      resolve: ({ token, org }) => getNewPageKlass(token, org),
    },
  },
});

export const newPageKlass = {
  type: GraphQLNewPageKlass,
  args: {
    org: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: (...args) => {
    const token = getToken(args[2], args[0]);
    const { org } = args[1];
    return { token, org };
  },
};

////////////////////////////////////////////////////////////////

const GraphQLNewPageType = new GraphQLObjectType({
  name: 'NewPageType',
  fields: {
    options: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLOptionItemType)),
      resolve: ({ token, klass }) => getNewPageType(token, klass),
    },
  },
});

export const newPageType = {
  type: GraphQLNewPageType,
  args: {
    klass: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: (...args) => {
    const token = getToken(args[2], args[0]);
    const { klass } = args[1];
    return { token, klass };
  },
};

////////////////////////////////////////////////////////////////

const GraphQLNewPageLayout = new GraphQLObjectType({
  name: 'NewPageLayout',
  fields: {
    options: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLOptionItemType)),
      resolve: ({ token, type }) => getNewPageLayout(token, type),
    },
  },
});

export const newPageLayout = {
  type: GraphQLNewPageLayout,
  args: {
    type: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: (...args) => {
    const token = getToken(args[2], args[0]);
    const { type } = args[1];
    return { token, type };
  },
};

export const GraphQLNewRevisionType = new GraphQLObjectType({
  name: 'NewRevision',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      // resolve: () => 'newPage Revision identitification marker',
    },
    flagCarrierId: { type: GraphQLID },
    entityType: { type: new GraphQLNonNull(GraphQLString) },
    label: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export const newRevision = {
  type: GraphQLNewRevisionType,
  resolve: () => ({
    flagCarrierId: '00000000-0000-0000-0000-000000000000',
    entityType: 'not defined',
    label: 'not defined',
  }),
};

////////////////////////////////////////////////////////////////
//                      M U T A T I I O N                     //
////////////////////////////////////////////////////////////////

export const newPageMutation = mutationWithClientMutationId({
  name: 'NewPageMutation',
  inputFields: {
    org: { type: new GraphQLNonNull(GraphQLString) },
    type: { type: new GraphQLNonNull(GraphQLString) },
    layout: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    documentKind: { type: new GraphQLNonNull(GraphQLString) },
    entityRoute: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    newRevision: {
      type: new GraphQLNonNull(GraphQLNewRevisionType),
      resolve: x => x,
    },
  },
  mutateAndGetPayload: (...args) => {
    const { entityRoute, org, type, layout, title, documentKind } = args[0];
    const token = getToken(args[1], args[2].rootValue);
    return postPageCreate(token, { entityRoute, org, type, layout, title, documentKind });
  },
});
