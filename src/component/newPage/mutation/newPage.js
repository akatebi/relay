import {
  commitMutation,
  graphql,
} from 'react-relay';

const mutation = graphql`
  mutation newPageMutation($input: NewPageMutationInput!) {
    newPageMutation(input: $input) {
      newRevision {
        id
        entityType
        flagCarrierId
        label
      }
    }
  }
`;

export const newPageMutation = (
  environment,
  { entityRoute, org, type, layout, title, documentKind },
  onCompleted,
  onError,
) => commitMutation(
  environment,
  {
    mutation,
    variables: { input: { entityRoute, org, type, layout, title, documentKind } },
    onCompleted,
    onError,
  },
);
