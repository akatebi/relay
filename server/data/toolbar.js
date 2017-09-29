import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import { mutationWithClientMutationId } from 'graphql-relay';

import { GraphQLIdentityType } from './identity';

import {
  getToolbar,
  getApprovalCycleToolbar,
  postApproveReject,
  postTerminateClear,
} from './database/toolbar';

import { getToken } from './database/constant';

const GraphQLToolbarButton = new GraphQLObjectType({
  name: 'buttons',
  fields: () => ({
    toolbarKey: { type: GraphQLString },
    toolbarName: { type: GraphQLString },
    children: { type: new GraphQLNonNull(new GraphQLList(GraphQLToolbarButton)) },
  }),
});

export const GraphQLToolbar = new GraphQLObjectType({
  name: 'Toolbar',
  fields: {
    id: {
      type: GraphQLID,
      resolve: () => 'toolbar ID',
    },
    readMode: { type: new GraphQLNonNull(new GraphQLList(GraphQLToolbarButton)) },
    editMode: { type: new GraphQLNonNull(new GraphQLList(GraphQLToolbarButton)) },
  },
});

export const toolbar = {
  type: GraphQLToolbar,
  args: {
    path: { type: GraphQLString },
  },
  resolve: (...args) => {
    const token = getToken(args[2], args[0]);
    const { path } = args[1];
    return getToolbar(token, path);
  },
};

export const ApprovalCycleToolbar = new GraphQLObjectType({
  name: 'ApprovalCycleToolbar',
  fields: {
    id: {
      type: GraphQLID,
      resolve: () => 'approvalCycleToolbar ID',
    },
    readMode: { type: new GraphQLList(GraphQLToolbarButton) },
    editMode: { type: new GraphQLList(GraphQLToolbarButton) },
  },
});

export const approvalCycleToolbar = {
  type: ApprovalCycleToolbar,
  args: {
    docId: { type: GraphQLString },
  },
  resolve: (...args) => {
    const token = getToken(args[2], args[0]);
    const { docId } = args[1];
    return getApprovalCycleToolbar(token, docId);
  },
};

////////////////////////////////////////////////////////////////////////////////

export const processActionMutation = mutationWithClientMutationId({
  name: 'ProcessActionMutation',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    docId: { type: new GraphQLNonNull(GraphQLID) },
    action: { type: new GraphQLNonNull(GraphQLString) },
    path: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    toolbar: {
      type: new GraphQLNonNull(GraphQLToolbar),
    },
    approvalCycleToolbar: {
      type: new GraphQLNonNull(ApprovalCycleToolbar),
    },
    identity: {
      type: new GraphQLNonNull(GraphQLIdentityType),
    },
  },
  mutateAndGetPayload: (...args) => {
    const { action, docId, id, path } = args[0];
    const token = getToken(args[1], args[2].rootValue);
    if (action === 'terminate' || action === 'cancel') {
      return postTerminateClear(token, { action, docId, id, path });
    }
    return postApproveReject(token, { action, docId, id, path });
  },
});
