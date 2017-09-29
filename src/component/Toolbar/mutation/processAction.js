import {
  commitMutation,
  graphql,
} from 'react-relay';

const mutation = graphql`
  mutation processActionMutation($input: ProcessActionMutationInput!) {
    processActionMutation(input: $input) {
      identity {
        id
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

export const processActionMutation = (
  environment,
  { action, docId, id, path },
  onCompleted,
  onError,
) => commitMutation(
  environment,
  {
    mutation,
    variables: {
      input: { action, docId, id, path },
    },
    onCompleted,
    onError,
  },
);
