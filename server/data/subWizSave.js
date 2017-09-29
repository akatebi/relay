import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';

import { mutationWithClientMutationId } from 'graphql-relay';
import { subWizSave } from './database/subWizSave';
import { ApprovalCycleToolbar, GraphQLToolbar } from './toolbar';
import { GraphQLIdentityType } from './identity';
import { getToken } from './database/constant';

const GraphQLApprovalCyclConfigInputType = new GraphQLInputObjectType({
  name: 'ApprovalCyclConfig',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    isFamily: { type: new GraphQLNonNull(GraphQLString) },
    entityType: { type: new GraphQLNonNull(GraphQLString) },
  },
});


const GraphQLLifeCycleToStateInputType = new GraphQLInputObjectType({
  name: 'LifeCycleToState',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    state: { type: new GraphQLNonNull(GraphQLString) },
    entityType: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const GraphQLApprovalSegmentAssigneesInputType = new GraphQLInputObjectType({
  name: 'ApprovalSegmentAssignees',
  fields: {
    segmentId: { type: new GraphQLNonNull(GraphQLID) },
    assignees: { type: new GraphQLNonNull(new GraphQLList(GraphQLApprovalCyclConfigInputType)) },
  },
});

const GraphQLSubmitDataInputType = new GraphQLInputObjectType({
  name: 'SubmitDataInput',
  fields: {
    toState: { type: GraphQLLifeCycleToStateInputType },
    directApproval: { type: new GraphQLNonNull(GraphQLBoolean) },
    isFamily: { type: new GraphQLNonNull(GraphQLBoolean) },
    segmentAssignees: { type: new GraphQLNonNull(new GraphQLList(GraphQLApprovalSegmentAssigneesInputType)) },
    approvalCycleConfig: { type: new GraphQLNonNull(GraphQLApprovalCyclConfigInputType) },
  },
});

export const subWizSaveMutation = mutationWithClientMutationId({
  name: 'SubWizSaveMutation',
  inputFields: {
    docId: { type: new GraphQLNonNull(GraphQLID) },
    submitData: { type: new GraphQLNonNull(GraphQLSubmitDataInputType) },
    path: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    identity: {
      type: new GraphQLNonNull(GraphQLIdentityType),
    },
    toolbar: {
      type: new GraphQLNonNull(GraphQLToolbar),
    },
    approvalCycleToolbar: {
      type: new GraphQLNonNull(ApprovalCycleToolbar),
    },
  },
  mutateAndGetPayload: (...args) => {
    const { docId, submitData, path } = args[0];
    const token = getToken(args[1], args[2].rootValue);
    return subWizSave(token, { docId, submitData, path });
  },
});
