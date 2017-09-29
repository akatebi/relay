import {
  commitMutation,
  graphql,
} from 'react-relay';

const mutation = graphql`
  mutation unlockProfileMutation($input: UnlockProfileMutationInput!) {
    unlockProfileMutation(input: $input) {
      lockStatus {
        id
        isLocked
      }
    }
  }
`;

export const unlockProfileMutation = (
  environment,
  { id, path },
  onCompleted,
  onError,
) => commitMutation(
  environment,
  {
    mutation,
    variables: { input: { path } },
    onCompleted,
    onError,
    optimisticResponse: ({
      unlockProfileMutation: {
        lockStatus: {
          id,
          isLocked: false,
        },
      },
    }),
  },
);
