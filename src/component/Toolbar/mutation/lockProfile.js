import {
  commitMutation,
  graphql,
} from 'react-relay';

const mutation = graphql`
  mutation lockProfileMutation($input: LockProfileMutationInput!) {
    lockProfileMutation(input: $input) {
      lockStatus {
        id
        isLocked
        lockedBy {
          id
          isFamily
          label
          revId
        }
        timeLocked
        msg
      }
    }
  }
`;

const optimisticResponse = (id, method) => {
  if (method === 'put') {
    return {
      lockProfileMutation: {
        lockStatus: {
          id,
          isLocked: true,
        },
      },
    };
  }
  return null;
};

export const lockProfileMutation = (
  environment,
  { id, path, method = 'put' },
  onCompleted,
  onError,
) => commitMutation(
  environment,
  {
    mutation,
    variables: { input: { path, method } },
    onCompleted,
    onError,
    optimisticResponse: optimisticResponse(id, method),
  },
);
