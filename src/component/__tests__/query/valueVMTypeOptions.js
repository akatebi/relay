export default `
  query valueVMTypeOptions($path: String!) {
    valueVMTypeOptions(path: $path) {
      entityOptions {
        id
        label
        entityType
        familyId
        isFamily
        cultureCode
        operation
        reportingKey
      }
      entityListOptions {
        id
        label
        entityType
        familyId
        isFamily
        cultureCode
        operation
        reportingKey
      }
    }
  }
`;
