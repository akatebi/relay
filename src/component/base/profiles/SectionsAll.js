import React from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';
import { Alert } from 'react-bootstrap';
import Spinner from '../Spinner';
import SectionsAll from '../../profiles/SectionsAll';
import { getEnvironment } from '../environment';

const debug = require('debug')('app:base:profiles:SectionsAll');

const Root = ({ location, location: { pathname } }) => {
  const path = pathname.split('/all')[0];
  debug('path', path);
  return (
    <QueryRenderer
      environment={getEnvironment()}
      query={graphql`
        query SectionsAllQuery($path: String!) {
          associations(path: $path) {
            ...Identity_associations
          }
          controlNumberSequence(path: $path) {
            ...SectionsAll_controlNumberSequence
          }
          identity(path: $path) {
            ...SectionsAll_identity
          }
          lockStatus(path: $path) {
            ...Identity_lockStatus
            ...SectionsAll_lockStatus
          }
          selfRolesLookup {
            ...Identity_selfRolesLookup
          }
          sectionsAll(path: $path) {
            ...SectionsAll_sectionsAll
          }
          valueVMOptions {
            ...SectionsAll_valueVMOptions
          }
          valueVMTypeOptions(path: $path) {
            ...SectionsAll_valueVMTypeOptions
          }
        }
      `}
      variables={{ path }}
      render={({ error, props: cprops }) => {
        if (error) {
          return (<Alert bsStyle="danger">{error.message}</Alert>);
        } else if (cprops) {
          return (
            <SectionsAll
              associations={cprops.associations}
              controlNumberSequence={cprops.controlNumberSequence}
              identity={cprops.identity}
              location={location}
              lockStatus={cprops.lockStatus}
              sectionsAll={cprops.sectionsAll}
              selfRolesLookup={cprops.selfRolesLookup}
              showHeader={cprops.showHeader}
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
