import React from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';
import { Alert } from 'react-bootstrap';
import { getEnvironment } from '../environment';
import Spinner from '../Spinner';
import ApprovalCycleConfig from '../../entities/entityData/ApprovalCycleConfig';
import { getGUID } from '../service';

const debug = require('debug')('app:component:base:entities:ApprovalCycleConfig');

const Root = ({ location, location: { pathname } }) => {
  const docId = getGUID(pathname);
  let path = pathname.split(docId)[0];
  path = `${path}${docId}`;
  debug('path', path);
  return (
    <QueryRenderer
      environment={getEnvironment()}
      query={graphql`
        query ApprovalCycleConfigQuery($path: String!) {
          entity(path: $path) {
            ...ApprovalCycleConfig_entity
          }
          identity(path: $path) {
            ...ApprovalCycleConfig_identity
          }
          valueVMOptions {
            ...ApprovalCycleConfig_valueVMOptions
          }
          valueVMTypeOptions(path: $path) {
            ...ApprovalCycleConfig_valueVMTypeOptions
          }
        }
      `}
      variables={{ path }}
      render={({ error, props: cprops }) => {
        if (error) {
          return (<Alert bsStyle="danger">{error.message}</Alert>);
        } else if (cprops) {
          return (
            <ApprovalCycleConfig
              location={location}
              entity={cprops.entity}
              identity={cprops.identity}
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
