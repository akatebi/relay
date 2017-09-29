import React from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';
import { Alert } from 'react-bootstrap';
import Spinner from '../Spinner';
import PropertyConfigs from '../../profiles/PropertyConfigs';
import { getEnvironment } from '../environment';

// const debug = require('debug')('app:base:profiles:PropertyConfigs');

const Root = ({ history, location, location: { pathname } }) => {
  const path = pathname.split('/configs')[0];
  // debug('path', path);
  return (
    <QueryRenderer
      environment={getEnvironment()}
      query={graphql`
        query PropertyConfigsQuery($path: String!) {
          config(path: $path) {
            ...PropertyConfigs_config
          }
          identity(path: $path) {
            ...PropertyConfigs_identity
          }
          valueVMOptions {
            ...PropertyConfigs_valueVMOptions
          }
          valueVMTypeOptions(path: $path) {
            ...PropertyConfigs_valueVMTypeOptions
          }
        }
      `}
      variables={{ path }}
      render={({ error, props: cprops }) => {
        if (error) {
          return (<Alert bsStyle="danger">{error.message}</Alert>);
        } else if (cprops) {
          return (
            <PropertyConfigs
              history={history}
              location={location}
              config={cprops.config}
              identity={cprops.identity}
              valueVMOptions={cprops.valueVMOptions}
              valueVMTypeOptions={cprops.valueVMTypeOptions}
              validationLookup={cprops.validationLookup}
            />
          );
        }
        return <Spinner />;
      }}
    />
  );
};

Root.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default Root;
