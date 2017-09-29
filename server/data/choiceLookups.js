import {
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';

import { getCreationEntityTypeLookup }
  from './database/choiceLookups';

import { getToken } from './database/constant';

const GraphQLChoiceType = new GraphQLObjectType({
  name: 'ChoiceType',
  fields: () =>
    ({
      value: { type: new GraphQLNonNull(GraphQLString) },
      label: { type: new GraphQLNonNull(GraphQLString) },
    }),
});

export const GraphQLChoiceLookupsType = new GraphQLObjectType({
  name: 'ChoiceLookups',
  fields: {
    creationEntityTypes: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLChoiceType)),
      resolve: ({ token }) => getCreationEntityTypeLookup(token),
    },
  },
});

export const choiceLookups = {
  type: GraphQLChoiceLookupsType,
  resolve: (...args) => {
    const token = getToken(args[2], args[0]);
    return { token };
  },
};
