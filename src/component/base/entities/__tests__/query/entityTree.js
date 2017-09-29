export default `query EntityTreeQuery($entity: String!) {
  entityTree(entity: $entity) {
    ...EntityTree_entityTree
  }
}

fragment EntityTree_entityTree on EntityTree {
  name
  children {
    name
    children {
      name
      children {
        name
        children {
          name
          children {
            name
            children {
              name
              children {
                name
                children {
                  name
                  children {
                    name
                    children {
                      name
                      children {
                        name
                        children {
                          name
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
}
`;
