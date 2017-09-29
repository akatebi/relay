import {
  commitMutation,
  graphql,
} from 'react-relay';

const mutation = graphql`
  mutation modifyProfileMutation($input: ModifyProfileMutationInput!) {
    modifyProfileMutation(input: $input) {
      id
    }
  }
`;

export const modifyProfileMutation = (
  environment,
  { path, id },
  onCompleted,
  onError,
) => commitMutation(
  environment,
  {
    mutation,
    variables: { input: { path, id } },
    onCompleted,
    onError,
  },
);
