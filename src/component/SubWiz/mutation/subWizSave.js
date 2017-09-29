import {
  commitMutation,
  graphql,
} from 'react-relay';

const mutation = graphql`
  mutation subWizSaveMutation($input: SubWizSaveMutationInput!) {
    subWizSaveMutation(input: $input) {
      identity {
        id
        label
        standardProperties {
          name
          label
          valueVM
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

export const subWizSaveMutation = (
  environment,
  { docId, submitData, path },
  onCompleted,
  onError,
) => commitMutation(
  environment,
  {
    mutation,
    variables: {
      input: { docId, submitData, path },
    },
    onCompleted,
    onError,
  },
);
