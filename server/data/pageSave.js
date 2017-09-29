import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';

import { mutationWithClientMutationId } from 'graphql-relay';
import { getPageSavePayload } from './database/pageSave';
import { GraphQLIdentityType } from './identity';
import { getToken } from './database/constant';
import {
  GraphQLToolbar,
  ApprovalCycleToolbar,
} from './toolbar';

export const pageSaveMutation = mutationWithClientMutationId({
  name: 'PageSaveMutation',
  inputFields: {
    path: { type: new GraphQLNonNull(GraphQLString) },
    docId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    toolbar: {
      type: new GraphQLNonNull(GraphQLToolbar),
    },
    approvalCycleToolbar: {
      type: new GraphQLNonNull(ApprovalCycleToolbar),
    },
    identity: {
      type: new GraphQLNonNull(GraphQLIdentityType),
    },
  },
  mutateAndGetPayload: (...args) => {
    const { path, docId } = args[0];
    const token = getToken(args[1], args[2].rootValue);
    return getPageSavePayload(token, { docId, path });
  },
});
