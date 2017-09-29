export default `
  mutation unlockProfileMutation($input: LockProfileMutationInput!) {
  unlockProfileMutation(input: $input) {
    lockStatus {
      id
      isLocked
    }
  }
}
`;
