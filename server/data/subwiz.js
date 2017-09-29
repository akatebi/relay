import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import { GraphQLEntityVMType } from './entityVM';

import { GraphQLRelationshipToPropertyContent } from './identity';

import {
  getApprovalCycleList,
  getSelectedApprovalCycle,
  getEligibleApprovers,
} from './database/subwiz';

import { getToken } from './database/constant';

////////////////////////////////////////////////////////////////////////////

export const GraphQLApprovalCycleList = new GraphQLObjectType({
  name: 'ApprovalCycleList',
  fields: {
    list: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLEntityVMType)),
      resolve: x => x,
    },
  },
});

export const approvalCycleList = {
  type: new GraphQLNonNull(GraphQLApprovalCycleList),
  args: {
    path: { type: new GraphQLNonNull(GraphQLString) },
    processType: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: (...args) => {
    const token = getToken(args[2], args[0]);
    const { path, processType } = args[1];
    return getApprovalCycleList(token, { path, processType });
  },
};

////////////////////////////////////////////////////////////////////////////

const GraphQLApprovalSegment = new GraphQLObjectType({
  name: 'ApprovalSegment',
  fields: {
    segmentId: { type: GraphQLID },
    assignees: { type: new GraphQLNonNull(new GraphQLList(GraphQLEntityVMType)) },
  },
});

export const GraphQLEligibleApprovers = new GraphQLObjectType({
  name: 'EligibleApprovers',
  fields: {
    list: {
      type: new GraphQLList(GraphQLApprovalSegment),
      resolve: x => x,
    },
  },
});

export const eligibleApprovers = {
  type: GraphQLEligibleApprovers,
  args: {
    path: { type: new GraphQLNonNull(GraphQLString) },
    selectedCycleId: { type: GraphQLString },
  },
  resolve: (...args) => {
    const token = getToken(args[2], args[0]);
    const { path, selectedCycleId } = args[1];
    return selectedCycleId ? getEligibleApprovers(token, { path, selectedCycleId }) : null;
  },
};

////////////////////////////////////////////////////////////////////////////

const GraphQLApprovalSegmentConfig = new GraphQLObjectType({
  name: 'ApprovalSegmentConfig',
  fields: {
    customProperties: { type: new GraphQLNonNull(new GraphQLList(GraphQLRelationshipToPropertyContent)) },
    cultureCode: { type: GraphQLString },
    entityType: { type: new GraphQLNonNull(GraphQLString) },
    familyId: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLID) },
    isFamily: { type: new GraphQLNonNull(GraphQLBoolean) },
    label: { type: new GraphQLNonNull(GraphQLString) },
    operation: { type: new GraphQLNonNull(GraphQLString) },
    reportingKey: { type: GraphQLString },
    // segmentType: { type: new GraphQLNonNull(GraphQLString) },
    // waitForEverybody: { type: GraphQLBoolean },
    // approverSource: { type: new GraphQLNonNull(new GraphQLList(GraphQLEntityVMType)) },
    // selectAllUsers: { type: GraphQLBoolean },
  },
});

export const GraphQLSelectedApprovalCycle = new GraphQLObjectType({
  name: 'SelectedApprovalCycle',
  fields: {
    id: { type: GraphQLID },
    label: { type: GraphQLString },
    entityType: { type: new GraphQLNonNull(GraphQLString) },
    processType: { type: new GraphQLNonNull(GraphQLString) },
    waitForEverybody: { type: GraphQLBoolean },
    approvalSegmentConfigs: { type: new GraphQLNonNull(new GraphQLList(GraphQLApprovalSegmentConfig)) },
  },
});

export const selectedApprovalCycle = {
  type: GraphQLSelectedApprovalCycle,
  args: {
    selectedCycleId: { type: GraphQLString },
  },
  resolve: (...args) => {
    const token = getToken(args[2], args[0]);
    const { selectedCycleId } = args[1];
    // global.log(selectedCycleId, 'selectedCycleId');
    return selectedCycleId ? getSelectedApprovalCycle(token, selectedCycleId) : null;
  },
};
