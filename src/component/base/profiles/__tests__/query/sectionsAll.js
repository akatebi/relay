export default `query SectionsAllQuery($path: String!) {
  associations(path: $path) {
    ...SectionsAll_associations
  }
  identity(path: $path) {
    ...SectionsAll_identity
    id
  }
  lockStatus(path: $path) {
    ...SectionsAll_lockStatus
    id
  }
  controlNumberSequence(path: $path) {
    ...SectionsAll_controlNumberSequence
  }
  sectionsAll(path: $path) {
    ...SectionsAll_sectionsAll
  }
  selfRolesLookup {
    ...SectionsAll_selfRolesLookup
  }
  valueVMOptions {
    ...SectionsAll_valueVMOptions
  }
  valueVMTypeOptions(path: $path) {
    ...SectionsAll_valueVMTypeOptions
  }
}

fragment SectionsAll_associations on Associations {
  ...Identity_associations
}

fragment SectionsAll_identity on Identity {
  ...Identity_identity
  ...Section_identity
}

fragment SectionsAll_lockStatus on LockStatus {
  ...Identity_lockStatus
}

fragment SectionsAll_controlNumberSequence on ControlNumberSequence {
  ...Identity_controlNumberSequence
}

fragment SectionsAll_sectionsAll on Sections {
  sections {
    ...Section_section
    id
  }
}

fragment SectionsAll_selfRolesLookup on SelfRolesLookup {
  ...Identity_selfRolesLookup
}

fragment SectionsAll_valueVMOptions on ValueVMOptions {
  ...Identity_valueVMOptions
  ...Section_valueVMOptions
}

fragment SectionsAll_valueVMTypeOptions on ValueVMTypeOptions {
  ...Identity_valueVMTypeOptions
  ...Section_valueVMTypeOptions
}

fragment Identity_valueVMTypeOptions on ValueVMTypeOptions {
  ...Customs_valueVMTypeOptions
}

fragment Section_valueVMTypeOptions on ValueVMTypeOptions {
  ...PropertyContent_valueVMTypeOptions
}

fragment PropertyContent_valueVMTypeOptions on ValueVMTypeOptions {
  ...Entity_valueVMTypeOptions
  ...EntityList_valueVMTypeOptions
}

fragment Entity_valueVMTypeOptions on ValueVMTypeOptions {
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

fragment EntityList_valueVMTypeOptions on ValueVMTypeOptions {
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

fragment Customs_valueVMTypeOptions on ValueVMTypeOptions {
  ...PropertyContent_valueVMTypeOptions
}

fragment Identity_valueVMOptions on ValueVMOptions {
  ...Customs_valueVMOptions
}

fragment Section_valueVMOptions on ValueVMOptions {
  ...PropertyContent_valueVMOptions
}

fragment PropertyContent_valueVMOptions on ValueVMOptions {
  ...Category_valueVMOptions
  ...RoleList_valueVMOptions
}

fragment Category_valueVMOptions on ValueVMOptions {
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

fragment RoleList_valueVMOptions on ValueVMOptions {
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

fragment Customs_valueVMOptions on ValueVMOptions {
  ...PropertyContent_valueVMOptions
}

fragment Identity_selfRolesLookup on SelfRolesLookup {
  ...OwnerList_selfRolesLookup
}

fragment OwnerList_selfRolesLookup on SelfRolesLookup {
  selfRoles {
    label
    value
    cultureCode
    entityType
    familyId
    id
    isFamily
    operation
    reportingKey
  }
}

fragment Section_section on Section {
  label
  lineItemContentRelationships {
    id
    tail {
      label
      roleListContentRelationships {
        ...PropertyContent_relationshipToPropertyContent
        id
      }
      dateContentRelationships {
        ...PropertyContent_relationshipToPropertyContent
        id
      }
    }
  }
}

fragment PropertyContent_relationshipToPropertyContent on RelationshipToPropertyContent {
  tail {
    ...EntityList_propertyContent
    propertyType
    ...Category_propertyContent
    ...ControlNumber_propertyContent
    ...Date_propertyContent
    ...Decimal_propertyContent
    ...Entity_propertyContent
    ...Boolean_propertyContent
    ...Float_propertyContent
    ...Integer_propertyContent
    ...RichText_propertyContent
    ...RoleList_propertyContent
    ...Text_propertyContent
    id
  }
}

fragment EntityList_propertyContent on PropertyContent {
  id
  propertyType
  isEditable
  valueVM {
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
  ...Label_propertyContent
}

fragment Category_propertyContent on PropertyContent {
  id
  propertyType
  isEditable
  valueVM {
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
  ...Label_propertyContent
}

fragment ControlNumber_propertyContent on PropertyContent {
  id
  label
  propertyType
  isEditable
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
}

fragment Date_propertyContent on PropertyContent {
  id
  propertyType
  isEditable
  valueVM {
    __typename
    ... on DateProp {
      valueVMDate
    }
  }
  ...Label_propertyContent
}

fragment Decimal_propertyContent on PropertyContent {
  id
  propertyType
  isEditable
  valueVM {
    __typename
    ... on DecimalProp {
      valueVMDecimal
    }
  }
  ...Label_propertyContent
}

fragment Entity_propertyContent on PropertyContent {
  id
  propertyType
  isEditable
  valueVM {
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
  ...Label_propertyContent
}

fragment Boolean_propertyContent on PropertyContent {
  id
  propertyType
  isEditable
  valueVM {
    __typename
    ... on BooleanProp {
      valueVMBoolean
    }
  }
  ...Label_propertyContent
}

fragment Float_propertyContent on PropertyContent {
  id
  propertyType
  isEditable
  valueVM {
    __typename
    ... on FloatProp {
      valueVMFloat
    }
  }
  ...Label_propertyContent
}

fragment Integer_propertyContent on PropertyContent {
  id
  propertyType
  isEditable
  valueVM {
    __typename
    ... on IntegerProp {
      valueVMInteger
    }
  }
  ...Label_propertyContent
}

fragment RichText_propertyContent on PropertyContent {
  id
  propertyType
  isEditable
  valueVM {
    __typename
    ... on RichTextProp {
      valueVMRichText
    }
  }
  ...Label_propertyContent
}

fragment RoleList_propertyContent on PropertyContent {
  id
  propertyType
  isEditable
  valueVM {
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
  ...Label_propertyContent
}

fragment Text_propertyContent on PropertyContent {
  id
  propertyType
  isEditable
  valueVM {
    __typename
    ... on TextProp {
      valueVMText
    }
  }
  ...Label_propertyContent
}

fragment Label_propertyContent on PropertyContent {
  id
  label
  config {
    propertyBehavior
    id
  }
  propertyType
}

fragment Identity_controlNumberSequence on ControlNumberSequence {
  sequences {
    prefix
    id
  }
  ...ControlNumber_controlNumberSequence
}

fragment ControlNumber_controlNumberSequence on ControlNumberSequence {
  sequences {
    label
    prefix
    nextSequenceNumber
    increment
    isGlobal
    entityType
    suffix
    id
    cultureCode
    reportingKey
    familyId
    isFamily
    operation
  }
}

fragment Identity_lockStatus on LockStatus {
  ...Lock_lockStatus
}

fragment Lock_lockStatus on LockStatus {
  id
  isLocked
  lockedBy {
    id
    label
    revId
  }
  timeLocked
  msg
}

fragment Identity_identity on Identity {
  id
  label
  entityType
  formHeader
  reportingKey
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
            sequenceType
          }
        }
      }
      id
    }
    id
  }
  standardProperties {
    name
    label
    valueVM
  }
  documentClass {
    id
    ...EntityLink_entityVM
  }
  documentType {
    id
    ...EntityLink_entityVM
  }
  organization {
    id
    ...EntityLink_entityVM
  }
  ...Customs_identity
  ...OwnerList_identity
  ...ControlNumber_identity
}

fragment Section_identity on Identity {
  ...IdentityHeader_identity
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

fragment Customs_identity on Identity {
  customProperties {
    tail {
      id
      config {
        group {
          id
          cultureCode
          value
        }
        validations {
          type
          messageText
          regex
        }
        id
      }
    }
    ...PropertyContent_relationshipToPropertyContent
    id
  }
}

fragment OwnerList_identity on Identity {
  identities {
    id
    operation
    relationshipType
    tail {
      id
      label
      entityType
      propertyType
      valueVM {
        __typename
        ... on RoleListProp {
          valueVMRoleList {
            id
            cultureCode
            entityType
            familyId
            isFamily
            label
            operation
            reportingKey
          }
        }
      }
    }
  }
}

fragment ControlNumber_identity on Identity {
  identities {
    tail {
      id
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
    }
    id
  }
}

fragment Identity_associations on Associations {
  ...Associations_associations
}

fragment Associations_associations on Associations {
  list {
    ...EntityLink_entityVM
    id
  }
}
`;
