import {
  commitMutation,
  graphql,
} from 'react-relay';

const mutation = graphql`
  mutation signInMutation($input: SignInMutationInput!) {
    signInMutation(input: $input) {
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

export const signInMutation = (
  environment,
  { username, password },
  onCompleted,
  onError,
) => commitMutation(
  environment,
  {
    mutation,
    variables: { input: { username, password } },
    onCompleted,
    onError,
  },
);
