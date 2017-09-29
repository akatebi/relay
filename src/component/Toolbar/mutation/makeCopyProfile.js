import {
  commitMutation,
  graphql,
} from 'react-relay';

const mutation = graphql`
  mutation makeCopyProfileMutation($input: MakeCopyProfileMutationInput!) {
    makeCopyProfileMutation(input: $input) {
      id
    }
  }
`;

export const makeCopyProfileMutation = (
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
