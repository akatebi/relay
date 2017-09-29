import {
  GraphQLInputObjectType,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import {
  mutationWithClientMutationId,
} from 'graphql-relay';


import {
  getAllCultures,
  getEnabledCultures,
  putEnabledCultures,
} from './database/cultures';

import { getToken } from './database/constant';

const GraphQLToolbarLabels = new GraphQLObjectType({
  name: 'ToolbarLabels',
  fields: {
    label: { type: GraphQLString },
  },
});

const GraphQLEnabledLabels = new GraphQLObjectType({
  name: 'EnabledLabels',
  fields: {
    message: { type: GraphQLString },
    headerLabel: { type: GraphQLString },
    nativeNameLabel: { type: GraphQLString },
    cultureCodeLabel: { type: GraphQLString },
  },
});

const GraphQLPendingLabels = new GraphQLObjectType({
  name: 'PendingLabels',
  fields: {
    headerLabel: { type: GraphQLString },
    commitButtonLabel: { type: GraphQLString },
    cancelAllButtonLabel: { type: GraphQLString },
  },
});

const GraphQLSelectedLabels = new GraphQLObjectType({
  name: 'SelectedLabels',
  fields: {
    label: { type: GraphQLString },
    placeholder: { type: GraphQLString },
    addToPendingLabel: { type: GraphQLString },
    cancelLabel: { type: GraphQLString },
  },
});

const GraphQLCultureType = new GraphQLObjectType({
  name: 'Culture',
  fields: {
    displayName: { type: GraphQLString },
    nativeName: { type: GraphQLString },
    cultureCode: { type: GraphQLString },
  },
});

const GraphQLCultures = new GraphQLObjectType({
  name: 'Cultures',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: () => 'cultures unique id........',
    },
    toolbarLabels: {
      type: GraphQLToolbarLabels,
      resolve: () => ({ label: 'Enable Culture' }),
    },
    enabledLabels: {
      type: GraphQLEnabledLabels,
      resolve: () => ({ message: 'No cultures are enabled', headerLabel: 'Enabled Cultures',
        nativeNameLabel: 'Native Name', cultureCodeLabel: 'Culture Code' }),
    },
    pendingLabels: {
      type: GraphQLPendingLabels,
      resolve: () => ({ headerLabel: 'Pending Cultures', commitButtonLabel: 'Enable',
        cancelAllButtonLabel: 'Cancel All' }),
    },
    selectedLabels: {
      type: GraphQLSelectedLabels,
      resolve: () => ({ label: 'Select a Culture', placeholder: ' enter text to search cultures ...',
        addToPendingLabel: 'Add to Pending', cancelLabel: 'Cancel' }),
    },
    all: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLCultureType)),
      // resolve: token => getAllCultures(token),
    },
    enabled: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLCultureType)),
      // resolve: token => getEnabledCultures(token),
    },
  },
});

export const cultures = {
  type: GraphQLCultures,
  resolve: (...args) => {
    const token = getToken(args[2], args[0]);
    const all = getAllCultures(token);
    const enabled = getEnabledCultures(token);
    return { all, enabled };
  },
};

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const GraphQLPendingInput = new GraphQLInputObjectType({
  name: 'PendingInput',
  fields: {
    cultureCode: { type: new GraphQLNonNull(GraphQLString) },
    displayName: { type: new GraphQLNonNull(GraphQLString) },
    nativeName: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export const addCulturesMutation = mutationWithClientMutationId({
  name: 'AddCulturesMutation',
  inputFields: {
    pending: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLPendingInput)),
    },
  },
  outputFields: {
    cultures: {
      type: GraphQLCultures,
      resolve: ({ token }) => {
        const all = getAllCultures(token);
        const enabled = getEnabledCultures(token);
        return { all, enabled };
      },
    },
  },
  mutateAndGetPayload: ({ pending }, ...args) => {
    const token = getToken(args[0], args[1].rootValue);
    return putEnabledCultures(token, pending).then(() => ({ token }));
  },
});
