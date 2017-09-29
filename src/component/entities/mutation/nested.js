import {
  commitMutation,
  graphql,
} from 'react-relay';

const mutation = graphql`
  mutation nestedMutation($input: NestedMutationInput!) {
    nestedMutation(input: $input) {
      id
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
  }
`;

const optimisticResponse = nested =>
  ({ nestedMutation: { nodes: { nested } } });

export const nestedMutation = (
  environment,
  { nested, basePath },
  onCompleted,
  onError,
) => commitMutation(
  environment,
  {
    mutation,
    variables: { input: { nested, basePath } },
    onCompleted,
    onError,
    optimisticResponse: optimisticResponse(nested),
    // updater: store => console.log(store),
  },
);
