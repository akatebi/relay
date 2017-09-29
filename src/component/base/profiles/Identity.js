import React from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';
import { Alert } from 'react-bootstrap';
import Spinner from '../Spinner';
import Identity from '../../profiles/Identity';
import { getEnvironment } from '../environment';

const debug = require('debug')('app:base:profiles:Identity');

const Root = ({ location, location: { pathname } }) => {
  const path = pathname.split('/identity')[0];
  const docId = path.split('/').pop();
  debug('docId', docId);
  debug('path', path);
  return (
    <QueryRenderer
      environment={getEnvironment()}
      query={graphql`
        query IdentityQuery($path: String!) {
          associations(path: $path) {
            ...Identity_associations
          }
          controlNumberSequence(path: $path) {
            ...Identity_controlNumberSequence
          }
          identity(path: $path) {
            ...Identity_identity
          }
          lockStatus(path: $path) {
            ...Identity_lockStatus
          }
          selfRolesLookup {
            ...Identity_selfRolesLookup
          }
          valueVMOptions {
            ...Identity_valueVMOptions
          }
          valueVMTypeOptions(path: $path) {
            ...Identity_valueVMTypeOptions
          }
        }
      `}
      variables={{ path }}
      render={({ error, props: cprops }) => {
        if (error) {
          return (<Alert bsStyle="danger">{error.message}</Alert>);
        } else if (cprops) {
          return (
            <Identity
              associations={cprops.associations}
              controlNumberSequence={cprops.controlNumberSequence}
              entity={cprops.entity}
              identity={cprops.identity}
              location={location}
              lockStatus={cprops.lockStatus}
              selfRolesLookup={cprops.selfRolesLookup}
              valueVMOptions={cprops.valueVMOptions}
              valueVMTypeOptions={cprops.valueVMTypeOptions}
            />
          );
        }
        return <Spinner />;
      }}
    />
  );
};

Root.propTypes = {
  location: PropTypes.object.isRequired,
};

export default Root;
