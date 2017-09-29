import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLObjectType,
} from 'graphql';

import {
  getMyTaskList,
  getMyTrackingList,
} from './database/dashboard';

import { GraphQLEntityVMType } from './entityVM';

import { getToken } from './database/constant';

export const GraphQLMyTaskType = new GraphQLObjectType({
  name: 'MyTask',
  fields: {
    assignmentType: { type: new GraphQLNonNull(GraphQLString) },
    segmentContent: { type: new GraphQLNonNull(GraphQLEntityVMType) },
    state: { type: new GraphQLNonNull(GraphQLString) },
    assignee: { type: new GraphQLNonNull(GraphQLEntityVMType) },
    claimable: { type: new GraphQLNonNull(GraphQLBoolean) },
    index: { type: new GraphQLNonNull(GraphQLInt) },
    primaryAssignment: { type: GraphQLEntityVMType },
    attachRevision: {
      type: new GraphQLNonNull(GraphQLEntityVMType),
      resolve: ({ attachRevision }) => {
        if (!attachRevision) {
          throw new Error('https://ibsamerica.visualstudio.com/Linqoln/Linqoln%20Team/_queries?id=3109&triage=false&_a=edit');
        }
        return attachRevision;
      },
    },
    cultureCode: { type: GraphQLString },
    entityType: { type: new GraphQLNonNull(GraphQLString) },
    familyId: { type: new GraphQLNonNull(GraphQLString) },
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: ({ id }) => (id.length > 36 ? id : `${id}-entityVM`),
    },
    isFamily: { type: new GraphQLNonNull(GraphQLBoolean) },
    label: { type: new GraphQLNonNull(GraphQLString) },
    operation: { type: new GraphQLNonNull(GraphQLString) },
    reportingKey: { type: GraphQLString },
  },
});

const GraphQLDashboard = new GraphQLObjectType({
  name: 'Dashboard',
  fields: {
    myTaskList: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLMyTaskType)),
      resolve: token => getMyTaskList(token),
    },
    myTrackingList: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLEntityVMType)),
      resolve: token => getMyTrackingList(token),
    },
  },
});

export const dashboard = {
  type: GraphQLDashboard,
  resolve: (...args) => getToken(args[2], args[0]),
};
