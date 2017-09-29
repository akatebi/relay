import {
  commitMutation,
  graphql,
} from 'react-relay';

const mutation = graphql`
  mutation addCulturesMutation($input: AddCulturesMutationInput!) {
    addCulturesMutation(input: $input) {
      cultures {
        id
        enabled {
          cultureCode
          displayName
          nativeName
        }
      }
    }
  }
`;

export const addCulturesMutation = (
  environment,
  { id, enabled, pending },
  onCompleted,
  onError,
) => commitMutation(
  environment,
  {
    mutation,
    variables: { input: { pending } },
    onCompleted,
    onError,
    optimisticResponse: ({
      addToEnabledCultures: {
        cultures: {
          id,
          enabled: [...enabled, ...pending],
        },
      },
    }),
  },
);
