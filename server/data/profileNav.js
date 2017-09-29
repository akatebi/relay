import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import {
  getProfileNav,
} from './database/profileNav';

import { getToken } from './database/constant';

const GraphQLNavItemType = new GraphQLObjectType({
  name: 'GraphQLNavItemType',
  fields: {
    url: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ url, label }) => (label === 'Tree' ? url.slice(7) : url),
    },
    label: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const GraphQLProfileNav = new GraphQLObjectType({
  name: 'ProfileNav',
  fields: {
    navLinks: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLNavItemType)),
      resolve: ({ token, path }) => getProfileNav(token, path),
    },
  },
});

export const profileNav = {
  type: GraphQLProfileNav,
  args: {
    path: { type: GraphQLString },
  },
  resolve: (...args) => {
    const token = getToken(args[2], args[0]);
    const { path } = args[1];
    return { token, path };
  },
};
