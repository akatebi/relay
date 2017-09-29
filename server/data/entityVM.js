import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
  GraphQLObjectType,
  GraphQLInputObjectType,
} from 'graphql';

import { getToken } from './database/constant';
import { getLinkRevId } from './database/entityVM';

export const GraphQLEntityVMType = new GraphQLObjectType({
  name: 'EntityVM',
  fields: () => ({
    cultureCode: { type: GraphQLString },
    entityType: { type: new GraphQLNonNull(GraphQLString) },
    familyId: { type: new GraphQLNonNull(GraphQLString) },
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: ({ id }) => (id.length > 36 ? id : `${id}-entityVM`),
    },
    isFamily: { type: new GraphQLNonNull(GraphQLBoolean) },
    label: { type: GraphQLString }, // TODO - make non-null
    operation: { type: new GraphQLNonNull(GraphQLString) },
    reportingKey: { type: GraphQLString },
    /////////////////////////////////////////////////////////////
    state: { type: GraphQLString },
    value: { type: GraphQLString },
    revId: {
      type: GraphQLString,
      resolve: ({ entityType, id, isFamily }, ...args) => {
        const { rootValue: { dataLoader, token } } = args[2];
        const tok = getToken(args[1], { token });
        return getLinkRevId(tok, entityType, id, isFamily, dataLoader);
      },
    },
  }),
});

export const GraphQLEntityVMInputType = new GraphQLInputObjectType({
  name: 'EntityVMInput',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    cultureCode: { type: new GraphQLNonNull(GraphQLString) },
    entityType: { type: new GraphQLNonNull(GraphQLString) },
    familyId: { type: new GraphQLNonNull(GraphQLString) },
    isFamily: { type: new GraphQLNonNull(GraphQLBoolean) },
    label: { type: new GraphQLNonNull(GraphQLString) },
    operation: { type: new GraphQLNonNull(GraphQLString) },
    reportingKey: { type: GraphQLString },
    revId: { type: GraphQLString },
  },
});

export const GraphQLControlNumberVMInputType = new GraphQLInputObjectType({
  name: 'ControlNumberVMInput',
  fields: () =>
    ({
      // type: { type: new GraphQLNonNull(GraphQLString) },
      // configId: { type: new GraphQLNonNull(GraphQLString) },
      prefix: { type: new GraphQLNonNull(GraphQLString) },
      suffix: { type: new GraphQLNonNull(GraphQLString) },
      sequenceNumber: { type: new GraphQLNonNull(GraphQLString) },
      controlNumberString: { type: new GraphQLNonNull(GraphQLString) },
      sequenceType: { type: new GraphQLNonNull(GraphQLString) },
      version: { type: new GraphQLNonNull(GraphQLString) },
      draftVersion: { type: GraphQLString },
    }),
});
