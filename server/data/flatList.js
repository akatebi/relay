import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import {
  getFlatList,
  getSubTree,
} from './database/flatList';

import { getToken } from './database/constant';

import { GraphQLEntityVMType } from './entityVM';

const GraphQLSubTreeType = new GraphQLObjectType({
  name: 'SubTreeItem',
  fields: {
    indent: { type: GraphQLInt },
    entityVM: { type: GraphQLEntityVMType },
  },
});

const GraphQLListItemType = new GraphQLObjectType({
  name: 'FlatListItem',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    entityType: { type: GraphQLString },
    label: { type: GraphQLString },
    subtree: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLSubTreeType)),
      resolve: ({ token, entity, id }) => getSubTree(token, entity, id),
    },
  },
});

const GraphQLFlatList = new GraphQLObjectType({
  name: 'FlatList',
  fields: {
    list: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLListItemType)),
      resolve: ({ token, entity }) =>
        getFlatList(token, entity).then(x => x.map(y => ({ ...y, token, entity }))),
    },
    // labels: {
    //   type: new GraphQLNonNull(new GraphQLList(GraphQLLabelType)),
    //   resolve: () => getProfileListLabels(),
    // },
  },
});

export const flatList = {
  type: GraphQLFlatList,
  args: {
    entity: { type: GraphQLString },
  },
  resolve: (...args) => {
    const token = getToken(args[2], args[0]);
    const { entity } = args[1];
    return { token, entity };
  },
};
