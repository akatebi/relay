
import {
  commitMutation,
  graphql,
} from 'react-relay';

const mutation = graphql`
  mutation pageSaveMutation($input: PageSaveMutationInput!) {
    pageSaveMutation(input: $input) {
      identity {
        id
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
                  controlNumberString
                  draftVersion
                  version
                }
              }
            }
          }
        }
      }
      approvalCycleToolbar {
        id
        readMode {
          toolbarKey
          toolbarName
          children {
            toolbarKey
            toolbarName
          }
        }
        editMode {
          toolbarKey
          toolbarName
          children {
            toolbarKey
            toolbarName
          }
        }
      }
      toolbar {
        id
        readMode {
          toolbarKey
          toolbarName
          children {
            toolbarKey
            toolbarName
          }
        }
        editMode {
          toolbarKey
          toolbarName
          children {
            toolbarKey
            toolbarName
          }
        }
      }
    }
  }
`;

export const pageSaveMutation = (
  environment,
  { path, docId },
  onCompleted,
  onError,
) => commitMutation(
  environment,
  {
    mutation,
    variables: { input: { path, docId } },
    onCompleted,
    onError,
  },
);
