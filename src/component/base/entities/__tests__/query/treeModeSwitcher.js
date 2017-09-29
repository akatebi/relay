export default `query TreeModeSwitcherQuery($entityType: String!, $nestFlatPath: String!, $path: String!, $flatOnly: Boolean!) {
  identity(path: $path) {
    ...TreeModeSwitcher_identity
    id
  }
  entity(path: $path) {
    ...TreeModeSwitcher_entity
    id
  }
  entityOptionLookups(entityType: $entityType) {
    ...TreeModeSwitcher_entityOptionLookups
  }
  nested(nestFlatPath: $nestFlatPath, flatOnly: $flatOnly) {
    ...TreeModeSwitcher_nested @skip(if: $flatOnly)
    id
  }
  flat(nestFlatPath: $nestFlatPath) {
    ...TreeModeSwitcher_flat
  }
}

fragment TreeModeSwitcher_identity on Identity {
  ...NestedAndFlat_identity
  ...ManageList_identity
  ...ManageTree_identity
}

fragment TreeModeSwitcher_entity on Entity {
  id
  entityType
}

fragment TreeModeSwitcher_entityOptionLookups on EntityOptionLookups {
  ...ManageList_entityOptionLookups
  ...ManageTree_entityOptionLookups
}

fragment TreeModeSwitcher_nested on NestedNodes {
  ...NestedAndFlat_nested
  ...ManageTree_nested
}

fragment TreeModeSwitcher_flat on FlatNode {
  nodes {
    id
    label
  }
  ...ManageList_flat
  ...NestedAndFlat_flat
}

fragment ManageList_flat on FlatNode {
  nodes {
    id
    label
  }
}

fragment NestedAndFlat_flat on FlatNode {
  nodes {
    id
    label
    reportingKey
    ...EntityLink_entityVM
  }
}

fragment EntityLink_entityVM on EntityVM {
  id
  entityType
  label
  isFamily
  revId
}

fragment NestedAndFlat_nested on NestedNodes {
  nodes @skip(if: $flatOnly) {
    nodeObj {
      ...EntityLink_entityVM
      id
    }
    children {
      nodeObj {
        ...EntityLink_entityVM
        id
      }
      children {
        nodeObj {
          ...EntityLink_entityVM
          id
        }
        children {
          nodeObj {
            ...EntityLink_entityVM
            id
          }
          children {
            nodeObj {
              ...EntityLink_entityVM
              id
            }
            children {
              nodeObj {
                ...EntityLink_entityVM
                id
              }
              children {
                nodeObj {
                  ...EntityLink_entityVM
                  id
                }
                children {
                  nodeObj {
                    ...EntityLink_entityVM
                    id
                  }
                  children {
                    nodeObj {
                      ...EntityLink_entityVM
                      id
                    }
                    children {
                      nodeObj {
                        ...EntityLink_entityVM
                        id
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

fragment ManageTree_nested on NestedNodes {
  nodes {
    nodeObj {
      familyId
      isFamily
      cultureCode
      id
      reportingKey
      entityType
      label
      operation
    }
    children {
      nodeObj {
        familyId
        isFamily
        cultureCode
        id
        reportingKey
        entityType
        label
        operation
      }
      children {
        nodeObj {
          familyId
          isFamily
          cultureCode
          id
          reportingKey
          entityType
          label
          operation
        }
        children {
          nodeObj {
            familyId
            isFamily
            cultureCode
            id
            reportingKey
            entityType
            label
            operation
          }
          children {
            nodeObj {
              familyId
              isFamily
              cultureCode
              id
              reportingKey
              entityType
              label
              operation
            }
            children {
              nodeObj {
                familyId
                isFamily
                cultureCode
                id
                reportingKey
                entityType
                label
                operation
              }
              children {
                nodeObj {
                  familyId
                  isFamily
                  cultureCode
                  id
                  reportingKey
                  entityType
                  label
                  operation
                }
                children {
                  nodeObj {
                    familyId
                    isFamily
                    cultureCode
                    id
                    reportingKey
                    entityType
                    label
                    operation
                  }
                  children {
                    nodeObj {
                      familyId
                      isFamily
                      cultureCode
                      id
                      reportingKey
                      entityType
                      label
                      operation
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

fragment ManageList_entityOptionLookups on EntityOptionLookups {
  options {
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

fragment ManageTree_entityOptionLookups on EntityOptionLookups {
  options {
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

fragment NestedAndFlat_identity on Identity {
  ...IdentityHeader_identity
}

fragment ManageList_identity on Identity {
  ...IdentityHeader_identity
}

fragment ManageTree_identity on Identity {
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
`;
