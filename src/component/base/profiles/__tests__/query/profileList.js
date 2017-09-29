
export default `
query ProfileListQuery($entity: String!) {
  profileList(entity: $entity) {
    ...ProfileList_profileList
  }
}

fragment ProfileList_profileList on ProfileList {
  tables {
    columnHeaders {
      index
      label
      type
    }
    rows {
      rowKey {
        id
        entityType
        cultureCode
        familyId
        isFamily
        label
        operation
        reportingKey
        ...EntityLink_entityVM
      }
      columns {
        index
        propertyType
        value {
          __typename
          ... on TextColumnValue {
            valueText
          }
          ... on DateColumnValue {
            valueDate
          }
          ... on ControlNumberColumnValue {
            valueControlNumber
          }
          ... on RoleListColumnValue {
            valueRoleList {
              label
              id
            }
          }
        }
      }
    }
  }
}

fragment EntityLink_entityVM on EntityVM {
  id
  entityType
  label
  isFamily
  revId
}
`;
