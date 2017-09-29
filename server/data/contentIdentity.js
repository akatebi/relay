import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import { GraphQLEntityVMType } from './entityVM';

import { getContentIdentity } from './database/contentIdentity';

import { getToken } from './database/constant';

const GraphQLIsChangeable = new GraphQLObjectType({
  name: 'IsChangeable',
  fields: {
    organization: { type: new GraphQLNonNull(GraphQLBoolean) },
    documentClass: { type: new GraphQLNonNull(GraphQLBoolean) },
    documentType: { type: new GraphQLNonNull(GraphQLBoolean) },
    layout: { type: new GraphQLNonNull(GraphQLBoolean) },
    lifeCycleConfig: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
});

const GraphQLContentIdentity = new GraphQLObjectType({
  name: 'ContentIdentity',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    organization: { type: new GraphQLNonNull(GraphQLEntityVMType) },
    documentClass: { type: new GraphQLNonNull(GraphQLEntityVMType) },
    documentType: { type: new GraphQLNonNull(GraphQLEntityVMType) },
    layout: { type: new GraphQLNonNull(GraphQLEntityVMType) },
    isChangeable: { type: new GraphQLNonNull(GraphQLIsChangeable) },
    documentKind: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export const contentIdentity = {
  type: GraphQLContentIdentity,
  args: {
    entityRoute: { type: GraphQLString },
  },
  resolve: (...args) => {
    const token = getToken(args[2], args[0]);
    const { entityRoute } = args[1];
    return getContentIdentity(token, entityRoute);
  },
};
