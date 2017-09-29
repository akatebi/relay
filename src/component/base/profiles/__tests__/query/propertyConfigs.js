export default `query PropertyConfigsQuery($path: String!) {
  config(path: $path) {
    ...PropertyConfigs_config
  }
  identity(path: $path) {
    ...PropertyConfigs_identity
    id
  }
  valueVMOptions {
    ...PropertyConfigs_valueVMOptions
  }
  valueVMTypeOptions(path: $path) {
    ...PropertyConfigs_valueVMTypeOptions
  }
}

fragment PropertyConfigs_config on PropertyConfigs {
  list {
    id
    propertyLabel {
      value
      id
    }
    ...PropertyConfig_propertyConfig
  }
}

fragment PropertyConfigs_identity on Identity {
  ...IdentityHeader_identity
}

fragment PropertyConfigs_valueVMOptions on ValueVMOptions {
  ...PropertyConfig_valueVMOptions
}

fragment PropertyConfigs_valueVMTypeOptions on ValueVMTypeOptions {
  ...PropertyConfig_valueVMTypeOptions
}

fragment PropertyConfig_valueVMTypeOptions on ValueVMTypeOptions {
  ...DefaultValue_valueVMTypeOptions
}

fragment DefaultValue_valueVMTypeOptions on ValueVMTypeOptions {
  ...Entity_typeOptions
  ...EntityList_typeOptions
}

fragment Entity_typeOptions on ValueVMTypeOptions {
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
}

fragment EntityList_typeOptions on ValueVMTypeOptions {
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

fragment PropertyConfig_valueVMOptions on ValueVMOptions {
  ...CustomAttribute_valueVMOptions
  ...DefaultValue_valueVMOptions
  ...Validations_valueVMOptions
}

fragment CustomAttribute_valueVMOptions on ValueVMOptions {
  ...Category_optionsAttr
  ...Entity_optionsAttr
  ...EntityList_optionsAttr
  ...RoleList_optionsAttr
}

fragment DefaultValue_valueVMOptions on ValueVMOptions {
  ...Category_options
  ...RoleList_options
}

fragment Validations_valueVMOptions on ValueVMOptions {
  validationTypeOptions {
    id
    label
  }
}

fragment Category_options on ValueVMOptions {
  categoryOptions {
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

fragment RoleList_options on ValueVMOptions {
  roleListOptions {
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

fragment Category_optionsAttr on ValueVMOptions {
  entityTypeOptions {
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

fragment Entity_optionsAttr on ValueVMOptions {
  entityTypeOptions {
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

fragment EntityList_optionsAttr on ValueVMOptions {
  entityTypeOptions {
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

fragment RoleList_optionsAttr on ValueVMOptions {
  entityTypeOptions {
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

fragment IdentityHeader_identity on Identity {
  id
  label
  entityType
  documentType {
    id
    ...EntityLink_entityVM
  }
  formHeader
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
            controlNumberString
            draftVersion
            version
          }
        }
      }
      id
    }
    id
  }
}

fragment EntityLink_entityVM on EntityVM {
  id
  entityType
  label
  isFamily
  revId
}

fragment PropertyConfig_propertyConfig on PropertyConfig {
  id
  url
  group
  label
  operation
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
    ... on EntityListProp {
      valueVMEntityList {
        id
        familyId
        label
        entityType
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
        familyId
        label
        entityType
        isFamily
        cultureCode
        operation
        reportingKey
      }
    }
    ... on TextProp {
      valueVMText
    }
    ... on EntityProp {
      valueVMEntity {
        id
        familyId
        label
        entityType
        isFamily
        cultureCode
        operation
        reportingKey
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
      ... on EntityListAttr {
        valueEntityList {
          id
          familyId
          label
          entityType
          isFamily
          cultureCode
          operation
          reportingKey
        }
      }
      ... on CategoryAttr {
        valueCategory {
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
          id
          familyId
          label
          entityType
          isFamily
          cultureCode
          operation
          reportingKey
        }
      }
      ... on TextAttr {
        valueText
      }
      ... on EntityAttr {
        valueEntity {
          id
          familyId
          label
          entityType
          isFamily
          cultureCode
          operation
          reportingKey
          value
        }
      }
    }
    ...CustomAttribute_customAttribute
  }
  ...DefaultValue_propertyConfig
  ...Validations_propertyConfig
}

fragment CustomAttribute_customAttribute on CustomAttribute {
  type
  ...Boolean_customAttr
  ...Category_customAttr
  ...ControlNumber_customAttr
  ...Date_customAttr
  ...Decimal_customAttr
  ...EntityList_customAttr
  ...Entity_customAttr
  ...Float_customAttr
  ...Integer_customAttr
  ...RichText_customAttr
  ...RoleList_customAttr
  ...Text_customAttr
}

fragment DefaultValue_propertyConfig on PropertyConfig {
  propertyType
  ...Boolean_property
  ...Category_property
  ...ControlNumber_property
  ...Date_property
  ...Decimal_property
  ...EntityList_property
  ...Entity_property
  ...Float_property
  ...Integer_property
  ...RichText_property
  ...RoleList_property
  ...Text_property
}

fragment Validations_propertyConfig on PropertyConfig {
  validations {
    type
    messageText
    regex
  }
}

fragment Boolean_property on PropertyConfig {
  propertyType
  defaultValue {
    __typename
    ... on BooleanProp {
      valueVMBoolean
    }
  }
}

fragment Category_property on PropertyConfig {
  isMultiSelect
  propertyType
  defaultValue {
    __typename
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
  }
}

fragment ControlNumber_property on PropertyConfig {
  label
  propertyType
  defaultValue {
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
}

fragment Date_property on PropertyConfig {
  propertyType
  defaultValue {
    __typename
    ... on DateProp {
      valueVMDate
    }
  }
}

fragment Decimal_property on PropertyConfig {
  propertyType
  defaultValue {
    __typename
    ... on DecimalProp {
      valueVMDecimal
    }
  }
}

fragment EntityList_property on PropertyConfig {
  isMultiSelect
  propertyType
  defaultValue {
    __typename
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
  customAttributes {
    name
    value {
      __typename
      ... on CategoryAttr {
        valueCategory {
          value
          id
        }
      }
    }
  }
}

fragment Entity_property on PropertyConfig {
  propertyType
  defaultValue {
    __typename
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
  }
}

fragment Float_property on PropertyConfig {
  propertyType
  defaultValue {
    __typename
    ... on FloatProp {
      valueVMFloat
    }
  }
}

fragment Integer_property on PropertyConfig {
  propertyType
  defaultValue {
    __typename
    ... on IntegerProp {
      valueVMInteger
    }
  }
}

fragment RichText_property on PropertyConfig {
  propertyType
  defaultValue {
    __typename
    ... on RichTextProp {
      valueVMRichText
    }
  }
}

fragment RoleList_property on PropertyConfig {
  isMultiSelect
  propertyType
  defaultValue {
    __typename
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
  }
}

fragment Text_property on PropertyConfig {
  propertyType
  defaultValue {
    __typename
    ... on TextProp {
      valueVMText
    }
  }
}

fragment Boolean_customAttr on CustomAttribute {
  type
  name
  value {
    __typename
    ... on BooleanAttr {
      valueBoolean
    }
  }
}

fragment Category_customAttr on CustomAttribute {
  type
  name
  value {
    __typename
    ... on CategoryAttr {
      valueCategory {
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

fragment ControlNumber_customAttr on CustomAttribute {
  type
  value {
    __typename
    ... on ControlNumberAttr {
      valueControlNumber {
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

fragment Date_customAttr on CustomAttribute {
  type
  name
  value {
    __typename
    ... on DateAttr {
      valueDate
    }
  }
}

fragment Decimal_customAttr on CustomAttribute {
  type
  name
  value {
    __typename
    ... on DecimalAttr {
      valueDecimal
    }
  }
}

fragment EntityList_customAttr on CustomAttribute {
  type
  name
  value {
    __typename
    ... on EntityListAttr {
      valueEntityList {
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

fragment Entity_customAttr on CustomAttribute {
  type
  name
  value {
    __typename
    ... on EntityAttr {
      valueEntity {
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

fragment Float_customAttr on CustomAttribute {
  type
  name
  value {
    __typename
    ... on FloatAttr {
      valueFloat
    }
  }
}

fragment Integer_customAttr on CustomAttribute {
  type
  name
  value {
    __typename
    ... on IntegerAttr {
      valueInteger
    }
  }
}

fragment RichText_customAttr on CustomAttribute {
  type
  name
  value {
    __typename
    ... on RichTextAttr {
      valueRichText
    }
  }
}

fragment RoleList_customAttr on CustomAttribute {
  type
  name
  value {
    __typename
    ... on RoleListAttr {
      valueRoleList {
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

fragment Text_customAttr on CustomAttribute {
  type
  name
  value {
    __typename
    ... on TextAttr {
      valueText
    }
  }
}
`;
