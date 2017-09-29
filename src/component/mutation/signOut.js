import {
  commitMutation,
  graphql,
} from 'react-relay';

const mutation = graphql`
  mutation signOutMutation($input: SignOutMutationInput!) {
    signOutMutation(input: $input) {
      viewer {
        error
        userIdentity {
          token
          user {
            id
            label
            entityType
          }
          organization {
            id
            label
            entityType
          }
        }
      }
    }
  }
`;

export const signOutMutation = (
  environment,
  onCompleted,
  onError,
) => commitMutation(
  environment,
  {
    mutation,
    variables: { input: {} },
    onCompleted,
    onError,
  },
);
