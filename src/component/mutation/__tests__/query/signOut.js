export default `
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
