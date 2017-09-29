import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';

import { getToken } from './database/constant';

import { getUsers } from './database/users';
import {
  GraphQLEntityVMType,
} from './entityVM';

const GraphQLUser = new GraphQLObjectType({
  name: 'User',
  fields: {
    user: {
      type: new GraphQLNonNull(GraphQLEntityVMType),
      resolve: x => x,
    },
  },
});

const GraphQLUsers = new GraphQLObjectType({
  name: 'Users',
  fields: {
    list: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLUser)),
      resolve: x => x,
    },
  },
});

export const users = {
  type: GraphQLUsers,
  resolve: (...args) => {
    const token = getToken(args[2], args[0]);
    return getUsers(token);
  },
};
