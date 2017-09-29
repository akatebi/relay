import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import { getAssociations } from './database/associations';
import { GraphQLEntityVMType } from './entityVM';

import { getToken } from './database/constant';

export const GraphQLAssociations = new GraphQLObjectType({
  name: 'Associations',
  fields: {
    list: {
      type: (new GraphQLList(GraphQLEntityVMType)),
      resolve: x => x,
    },
  },
});

export const associations = {
  type: new GraphQLNonNull(GraphQLAssociations),
  args: {
    path: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: (...args) => {
    const token = getToken(args[2], args[0]);
    const { path } = args[1];
    return getAssociations(token, path);
  },
};
