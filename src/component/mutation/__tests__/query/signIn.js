export default `
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
