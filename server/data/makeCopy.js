import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';

import { mutationWithClientMutationId } from 'graphql-relay';
import { makeCopyProfile } from './database/makeCopy';
import { getToken } from './database/constant';

export const makeCopyProfileMutation = mutationWithClientMutationId({
  name: 'MakeCopyProfileMutation',
  inputFields: {
    path: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  mutateAndGetPayload: (...args) => {
    const { path, id } = args[0];
    const token = getToken(args[1], args[2].rootValue);
    return makeCopyProfile(token, { path, id });
  },
});
