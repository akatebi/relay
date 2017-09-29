import {
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';

import { GraphQLEntityVMType } from './entityVM';

import { getEntityOptionTypeLookup }
  from './database/valueVMOptions';

import { getToken } from './database/constant';

export const GraphQLEntityOptionLookupsType = new GraphQLObjectType({
  name: 'EntityOptionLookups',
  fields: {
    options: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLEntityVMType)),
      resolve: x => x,
    },
  },
});

export const entityOptionLookups = {
  type: GraphQLEntityOptionLookupsType,
  args: {
    entityType: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: (...args) => {
    const token = getToken(args[2], args[0]);
    const { entityType } = args[1];
    return getEntityOptionTypeLookup(token, entityType);
  },
};
