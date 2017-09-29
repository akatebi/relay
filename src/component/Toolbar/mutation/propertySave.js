import {
  commitMutation,
  graphql,
} from 'react-relay';

const mutation = graphql`
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
          }
        }
      }
      propertyConfigs {
        id
        url
        group
        label
        isVisible
        entityType
        propertyType
        reportingKey
        isMasterData
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
          ... on BooleanProp {
            valueVMBoolean
          }
          ... on CategoryProp {
            valueVMCategory {
              label
            }
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
            }
          }
          ... on EntityListProp {
            valueVMEntityList {
              label
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
            }
          }
          ... on TextProp {
            valueVMText
          }
        }
        customAttributes {
          name
          type
          value {
            ... on BooleanAttr {
              valueBoolean
            }
            ... on CategoryAttr {
              valueCategory {
                label
              }
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
              }
            }
            ... on EntityListAttr {
              valueEntityList {
                label
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
              }
            }
            ... on TextAttr {
              valueText
            }
          }
        }
      }
      propertyContents {
          id
          propertyType
          valueVM {
            ... on BooleanProp {
              valueVMBoolean
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
          }
        }
    }
  }
`;

const convert = (obj = {}) => {
  const reduce = (acc, val) => acc.concat(obj[val].map(x => ({ ...x, propertyType: val })));
  const ary = Object.keys(obj).reduce(reduce, []);
  const map = ({ id, valueVM, propertyType }) =>
    ({ id, propertyType, valueVM: { __typename: `${propertyType}Prop`, [`valueVM${propertyType}`]: valueVM } });
  return ary.map(map);
};

const optimistic = ({ identity = {}, identities = {}, customProperties = {} }) => {
  if (identity.standardProperties) {
    identity.standardProperties = identity.standardProperties.map(({ name, label, valueVM }) => {
      if (name === 'Rev_FullStatus') {
        return { name, label, valueVM: 'Draft' };
      }
      return { name, label, valueVM };
    });
  }
  return {
    propertySaveMutation: {
      identity,
      propertyContents: [
        ...convert(identities),
        ...convert(customProperties),
      ],
    },
  };
};

export const propertySaveMutation = (
  environment,
  {
    configProperties,
    sectionContents,
    customProperties,
    identities,
    identity,
    paths,
  },
  onCompleted,
  onError,
) => commitMutation(
  environment,
  {
    mutation,
    variables: {
      input: {
        configProperties,
        sectionContents,
        customProperties,
        identities,
        identity,
        paths,
      },
    },
    onCompleted,
    onError,
    optimisticResponse: optimistic({
      identity,
      identities,
      customProperties,
    }),
  },
);
