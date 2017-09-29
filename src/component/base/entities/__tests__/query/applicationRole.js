export default `query ApplicationRoleQuery($path: String!) {
  entity(path: $path) {
    ...ApplicationRole_entity
    id
  }
  valueVMOptions {
    ...ApplicationRole_valueVMOptions
  }
  valueVMTypeOptions(path: $path) {
    ...ApplicationRole_valueVMTypeOptions
  }
}

fragment ApplicationRole_entity on Entity {
  id
  entityType
  customProperties {
    ...PropertyContent_relationshipToPropertyContent
    id
    tail {
      name
      id
    }
  }
}

fragment ApplicationRole_valueVMOptions on ValueVMOptions {
  ...PropertyContent_valueVMOptions
}

fragment ApplicationRole_valueVMTypeOptions on ValueVMTypeOptions {
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
`;
