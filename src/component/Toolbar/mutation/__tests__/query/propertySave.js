export default `
mutation propertySaveMutation($input: PropertySaveMutationInput!) {
  propertySaveMutation(input: $input) {
    lockStatus {
      id
      isLocked
      lockedBy {
        id
        isFamily
        label
        revId
      }
    }
    identity {
      id
      label
      entityType
      formHeader
      reportingKey
      standardProperties {
        name
        label
        valueVM
      }
      identities {
        tail {
          propertyType
          valueVM {
            __typename
            ... on ControlNumberProp {
              valueVMControlNumber {
                prefix
                suffix
                sequenceNumber
                controlNumberString
                sequenceType
                version
                draftVersion
              }
            }
          }
          id
        }
        id
      }
    }
    propertyConfigs {
      isMasterData
      id
      group
      label
      isVisible
      entityType
      propertyType
      reportingKey
      url
      isMultiSelect
      masterDataType
      masterDataPropertyConfig
      propertyLabel {
        id
        value
      }
      validations {
        type
        messageText
        regex
      }
      defaultValue {
        __typename
        ... on BooleanProp {
          valueVMBoolean
        }
        ... on ControlNumberProp {
          valueVMControlNumber {
            type
            prefix
            suffix
            sequenceNumber
            controlNumberString
            sequenceType
            version
            draftVersion
            configId
          }
        }
        ... on DateProp {
          valueVMDate
        }
        ... on DecimalProp {
          valueVMDecimal
        }
        ... on EntityProp {
          valueVMEntity {
            label
            id
          }
        }
        ... on CategoryProp {
          valueVMCategory {
            label
            id
          }
        }
        ... on FloatProp {
          valueVMFloat
        }
        ... on IntegerProp {
          valueVMInteger
        }
        ... on RichTextProp {
          valueVMRichText
        }
        ... on RoleListProp {
          valueVMRoleList {
            label
            id
          }
        }
        ... on TextProp {
          valueVMText
        }
        ... on EntityListProp {
          valueVMEntityList {
            label
            id
          }
        }
      }
      customAttributes {
        name
        type
        value {
          __typename
          ... on BooleanAttr {
            valueBoolean
          }
          ... on ControlNumberAttr {
            valueControlNumber {
              type
              prefix
              suffix
              sequenceNumber
              controlNumberString
              sequenceType
              version
              draftVersion
              configId
            }
          }
          ... on DateAttr {
            valueDate
          }
          ... on DecimalAttr {
            valueDecimal
          }
          ... on EntityAttr {
            valueEntity {
              label
              id
            }
          }
          ... on CategoryAttr {
            valueCategory {
              label
              id
            }
          }
          ... on FloatAttr {
            valueFloat
          }
          ... on IntegerAttr {
            valueInteger
          }
          ... on RichTextAttr {
            valueRichText
          }
          ... on RoleListAttr {
            valueRoleList {
              label
              id
            }
          }
          ... on TextAttr {
            valueText
          }
          ... on EntityListAttr {
            valueEntityList {
              label
              id
            }
          }
        }
      }
    }
    propertyContents {
      id
      propertyType
      valueVM {
        __typename
        ... on BooleanProp {
          valueVMBoolean
        }
        ... on ControlNumberProp {
          valueVMControlNumber {
            type
            prefix
            suffix
            sequenceNumber
            controlNumberString
            sequenceType
            version
            draftVersion
            configId
          }
        }
        ... on DateProp {
          valueVMDate
        }
        ... on DecimalProp {
          valueVMDecimal
        }
        ... on EntityProp {
          valueVMEntity {
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
        ... on CategoryProp {
          valueVMCategory {
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
        ... on FloatProp {
          valueVMFloat
        }
        ... on IntegerProp {
          valueVMInteger
        }
        ... on RichTextProp {
          valueVMRichText
        }
        ... on RoleListProp {
          valueVMRoleList {
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
        ... on TextProp {
          valueVMText
        }
        ... on EntityListProp {
          valueVMEntityList {
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
    }
  }
}
`;
