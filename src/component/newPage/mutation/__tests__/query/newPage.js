export default `
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
