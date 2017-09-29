import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import { getIdentity } from './database/identity';

import { getToken } from './database/constant';

const GraphQLDraftVersion = new GraphQLObjectType({
  name: 'DraftVersion',
  fields: {
    type: { type: new GraphQLNonNull(GraphQLString) },
    value: { type: new GraphQLNonNull(GraphQLInt) },
  },
});

const GraphQLSequencingType = new GraphQLObjectType({
  name: 'SequencingType',
  fields: {
    value: { type: new GraphQLNonNull(GraphQLString) },
    // entityVM
    familyId: { type: new GraphQLNonNull(GraphQLString) },
    isFamily: { type: new GraphQLNonNull(GraphQLBoolean) },
    cultureCode: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLID) },
    entityType: { type: new GraphQLNonNull(GraphQLString) },
    label: { type: new GraphQLNonNull(GraphQLString) },
    operation: { type: new GraphQLNonNull(GraphQLString) },
    reportingKey: { type: GraphQLString },
  },
});

const GraphQLSequenceData = new GraphQLObjectType({
  name: 'SequenceData',
  fields: {
    prefix: { type: new GraphQLNonNull(GraphQLString) },
    suffix: { type: GraphQLString },
    nextSequenceNumber: { type: new GraphQLNonNull(GraphQLInt) },
    increment: { type: new GraphQLNonNull(GraphQLInt) },
    isGlobal: { type: new GraphQLNonNull(GraphQLBoolean) },
    // entityVM
    familyId: { type: new GraphQLNonNull(GraphQLString) },
    isFamily: { type: new GraphQLNonNull(GraphQLBoolean) },
    cultureCode: { type: GraphQLString },
    id: { type: new GraphQLNonNull(GraphQLID) },
    entityType: { type: new GraphQLNonNull(GraphQLString) },
    label: { type: new GraphQLNonNull(GraphQLString) },
    operation: { type: new GraphQLNonNull(GraphQLString) },
    reportingKey: { type: GraphQLString },
  },
});

const GraphQLControlNumberSequence = new GraphQLObjectType({
  name: 'ControlNumberSequence',
  fields: {
    sequences: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLSequenceData)),
      resolve: (obj) => {
        const seqs = obj.find(prop => prop.name === 'Sequences');
        const values = seqs.value.$values;
        // global.log(values, '*** sequences');
        return values;
      },
    },
    sequencingType: {
      type: new GraphQLNonNull(GraphQLSequencingType),
      // resolve: ({ value }) => global.log(value, '*** sequencingType'),
      resolve: (obj) => {
        const sequencingType = obj.find(prop => prop.name === 'SequencingType');
        // global.log(sequencingType.value, '*** sequencingType');
        return sequencingType.value;
      },
    },
    defaultVersion: {
      type: new GraphQLNonNull(GraphQLDraftVersion),
      resolve: (obj) => {
        const defaultVersion = obj.find(prop => prop.name === 'DefaultVersion');
        // global.log(defaultVersion, '*** defaultVersion');
        return defaultVersion;
      },
    },
  },
});

export const controlNumberSequence = {
  type: GraphQLControlNumberSequence,
  args: {
    path: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: (...args) => {
    const token = getToken(args[2], args[0]);
    const { path } = args[1];
    const { dataLoader } = args[0];
    // return getControlNumberSequenceData(token, path);
    return getIdentity(token, path, dataLoader)
      .then(({ identities }) =>
        identities.find(({ relationshipType }) =>
          /ControlNumberContent/.test(relationshipType)))
      .then(data => data.tail.config.customAttributes);
  },
};
