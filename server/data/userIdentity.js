import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import {
  mutationWithClientMutationId,
} from 'graphql-relay';

import {
  getUserIdentityByName,
  getUserIdentityByToken,
} from './database/userIdentity';
import {
  GraphQLEntityVMType,
} from './entityVM';

const GraphQLUserIdentity = new GraphQLObjectType({
  name: 'UserIdentity',
  fields: {
    token: { type: GraphQLString },
    user: {
      type: GraphQLEntityVMType,
      resolve: ({ user, token }) => ({ ...user, token }),
    },
    organization: {
      type: GraphQLEntityVMType,
      resolve: ({ organization, token }) => ({ ...organization, token }) },
  },
});

export const GraphQLViewerType = new GraphQLObjectType({
  name: 'Viewer',
  fields: {
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
    userIdentity: {
      type: new GraphQLNonNull(GraphQLUserIdentity),
      resolve: ({ userIdentity }) => userIdentity,
    },
  },
});

export const viewer = {
  type: GraphQLViewerType,
  args: {
    token: { type: GraphQLString },
  },
  resolve: (_, { token }) => {
    if (token) {
      return getUserIdentityByToken(token);
    }
    return null;
  },
};

//////////////////////////////////////////////////////////////////
//                  M  U  T  A  T  I  O  N                      //
//////////////////////////////////////////////////////////////////

export const signInMutation = mutationWithClientMutationId({
  name: 'SignInMutation',
  inputFields: {
    username: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    viewer: {
      type: GraphQLViewerType,
      resolve: user => user,
    },
  },
  mutateAndGetPayload: ({ username, password }) => getUserIdentityByName(username, password),
});

export const signOutMutation = mutationWithClientMutationId({
  name: 'SignOutMutation',
  outputFields: {
    viewer: {
      type: GraphQLViewerType,
      resolve: () => null,
    },
  },
  mutateAndGetPayload: () => ({}),
});
