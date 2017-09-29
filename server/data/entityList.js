import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import {
  getEntityList,
  getEntityListLabels,
} from './database/entityList';

import { getToken } from './database/constant';

const GraphQLLabelType = new GraphQLObjectType({
  name: 'EntityListLabels',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID), resolve: x => `${x.id}-listLabels` },
    label: { type: GraphQLString },
  },
});

const GraphQLEntityListItemType = new GraphQLObjectType({
  name: 'EntityListItem',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: ({ id }) => `${id}-listItem`,
    },
    entityType: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    controlNumber: { type: new GraphQLNonNull(GraphQLString) },
    author: { type: new GraphQLNonNull(GraphQLString) },
    fullStatus: { type: new GraphQLNonNull(GraphQLString) },
    created: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const GraphQLEntityList = new GraphQLObjectType({
  name: 'EntityList',
  fields: {
    list: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLEntityListItemType)),
      resolve: ({ token, entity }) => getEntityList(token, entity),
    },
    labels: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLLabelType)),
      resolve: () => getEntityListLabels(),
    },
  },
});

export const entityList = {
  type: GraphQLEntityList,
  args: {
    entity: { type: GraphQLString },
  },
  resolve: (...args) => {
    const token = getToken(args[2], args[0]);
    const { entity } = args[1];
    return { token, entity };
  },
};
