import {
  GraphQLID,
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInputObjectType,
} from 'graphql';

import {
  mutationWithClientMutationId,
} from 'graphql-relay';

import {
  getFlat,
  getNested,
  putNested,
} from './database/nestedAndFlat';

import { getToken } from './database/constant';

import {
  GraphQLEntityVMType,
  GraphQLEntityVMInputType,
} from './entityVM';

const GraphQLNestedNodeType = new GraphQLObjectType({
  name: 'NestedNode',
  fields: () => ({
    nodeObj: { type: new GraphQLNonNull(GraphQLEntityVMType) },
    children: { type: new GraphQLList(GraphQLNestedNodeType) },
  }),
});

const GraphQLNestedNodesType = new GraphQLObjectType({
  name: 'NestedNodes',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: () => 'some unique id',
    },
    nodes: {
      type: GraphQLNestedNodeType,
      resolve: x => x,
    },
  },
});

export const nested = {
  type: GraphQLNestedNodesType,
  args: {
    flatOnly: { type: new GraphQLNonNull(GraphQLBoolean) },
    nestFlatPath: { type: GraphQLString },
  },
  resolve: (...args) => {
    const token = getToken(args[2], args[0]);
    const { nestFlatPath, flatOnly } = args[1];
    return flatOnly ? null : getNested(token, nestFlatPath);
  },
};

const GraphQLFlatNodeType = new GraphQLObjectType({
  name: 'FlatNode',
  fields: {
    nodes: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLEntityVMType)),
    },
  },
});

export const flat = {
  type: GraphQLFlatNodeType,
  args: {
    nestFlatPath: { type: GraphQLString },
  },
  resolve: (...args) => {
    const token = getToken(args[2], args[0]);
    const { nestFlatPath } = args[1];
    return getFlat(token, nestFlatPath);
  },
};

////////////////////////////////////////////////////////////////
//                      M U T A T I I O N                     //
////////////////////////////////////////////////////////////////

const treeSize = 10;
const types = [];
for (let i = 0; i < treeSize; i++) {
  const GraphQLNestedNodeInputType = new GraphQLInputObjectType({
    name: `NestedNodeInput${i}`,
    fields: () => ((i < treeSize - 1) ?
      ({
        nodeObj: { type: new GraphQLNonNull(GraphQLEntityVMInputType) },
        children: { type: new GraphQLList(types[i + 1]) },
      }) :
      ({
        nodeObj: { type: new GraphQLNonNull(GraphQLEntityVMInputType) },
      })),
  });
  types[i] = GraphQLNestedNodeInputType;
}

export const nestedMutation = mutationWithClientMutationId({
  name: 'NestedMutation',
  inputFields: {
    nested: { type: types[0] },
    basePath: { type: GraphQLString },
  },
  outputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: () => 'some unique id',
    },
    nodes: { type: GraphQLNestedNodeType },
  },
  mutateAndGetPayload: (...args) => {
    const { nested, basePath } = args[0];
    const token = getToken(args[1], args[2].rootValue);
    return putNested(token, { nested, basePath });
  },
});
