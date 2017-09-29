import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import {
  mutationWithClientMutationId,
} from 'graphql-relay';

import {
  getLockStatus,
  setLockProfile,
  unlockProfile,
} from './database/lock';

import { getToken } from './database/constant';

import { GraphQLEntityVMType } from './entityVM';

export const GraphQLLockStatus = new GraphQLObjectType({
  name: 'LockStatus',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID), resolve: x => `${x.id}-lock` },
    isLocked: { type: new GraphQLNonNull(GraphQLBoolean) },
    lockedBy: { type: GraphQLEntityVMType },
    timeLocked: { type: GraphQLString },
    msg: { type: GraphQLString },
  },
});

export const lockStatus = {
  type: new GraphQLNonNull(GraphQLLockStatus),
  args: {
    path: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: (...args) => {
    const token = getToken(args[2], args[0]);
    const { path } = args[1];
    return getLockStatus(token, path);
  },
};
////////////////////////////////////////////////////////////////////////////////
export const lockProfileMutation = mutationWithClientMutationId({
  name: 'LockProfileMutation',
  inputFields: {
    path: { type: new GraphQLNonNull(GraphQLString) },
    method: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    lockStatus: {
      type: GraphQLLockStatus,
      resolve: x => x,
    },
  },
  mutateAndGetPayload: (...args) => {
    const { path, method } = args[0];
    const token = getToken(args[1], args[2].rootValue);
    return method === 'put' ?
      setLockProfile(token, path) :
      getLockStatus(token, path);
  },
});

export const unlockProfileMutation = mutationWithClientMutationId({
  name: 'UnlockProfileMutation',
  inputFields: {
    path: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    lockStatus: {
      type: GraphQLLockStatus,
      resolve: x => x,
    },
  },
  mutateAndGetPayload: (...args) => {
    const { path } = args[0];
    const token = getToken(args[1], args[2].rootValue);
    return unlockProfile(token, path);
  },
});
