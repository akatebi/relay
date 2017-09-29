import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import {
  getEntityTree,
} from './database/entityTree';

import { getToken } from './database/constant';

const GraphQLEntityTree = new GraphQLObjectType({
  name: 'EntityTree',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    children: { type: new GraphQLNonNull(new GraphQLList(GraphQLEntityTree)) },
  }),
});

export const entityTree = {
  type: GraphQLEntityTree,
  args: {
    entity: { type: GraphQLString },
  },
  resolve: (...args) => {
    const token = getToken(args[2], args[0]);
    const { entity } = args[1];
    return getEntityTree(token, entity);
  },
};
