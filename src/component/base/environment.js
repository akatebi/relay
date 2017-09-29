
import {
  Environment,
  Network,
  RecordSource,
  RecordSourceInspector,
  Store,
} from 'relay-runtime';

import { graphqlURL, getToken } from '../../constant/app';

// const debug = require('debug')('app:component:base:environment');

// debug('graphqlURL', graphqlURL);

const fetchQuery = (operation, variables) => {
  const Authorization = `Bearer ${getToken()}`;
  // debug('operation', operation.text);
  return fetch(graphqlURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization,
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  })
    .then(response => response.json())
    .then((response) => {
      if (response.errors) {
        // window.log(response.errors);
        throw new Error(response.errors[0].error);
      }
      return response;
    });
};

export const getEnvironment = () => {
  if (!window.environment) {
    const source = new RecordSource();
    const store = new Store(source);
    const network = Network.create(fetchQuery);
    if (process.env.NODE_ENV === 'development') {
      window.inspector = new RecordSourceInspector(source);
    }
    window.environment = new Environment({ network, store });
    // console.log('==> Relay Environment Initialized <==');
  }
  return window.environment;
};
