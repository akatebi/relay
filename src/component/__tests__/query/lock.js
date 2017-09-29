export default `
  mutation lockProfileMutation($input: LockProfileMutationInput!) {
  lockProfileMutation(input: $input) {
    lockStatus {
      id
      isLocked
      lockedBy {
        id
        isFamily
        label
        revId
      }
      timeLocked
      msg
    }
  }
}
`;
