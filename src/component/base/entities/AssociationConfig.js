import React from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';
import { Alert } from 'react-bootstrap';
import { getEnvironment } from '../environment';
import Spinner from '../Spinner';
import AssociationConfig from '../../entities/entityData/AssociationConfig';
import { getGUID } from '../service';

const debug = require('debug')('app:component:base:entities:AssociationConfig');

const Root = ({ location, location: { pathname } }) => {
  const docId = getGUID(pathname);
  let path = pathname.split(docId)[0];
  path = `${path}${docId}`;
  debug('AssociationConfig path', path);
  return (
    <QueryRenderer
      environment={getEnvironment()}
      query={graphql`
        query AssociationConfigQuery($path: String!) {
          entity(path: $path) {
            ...AssociationConfig_entity
          }
          identity(path: $path) {
            ...AssociationConfig_identity
          }
          valueVMOptions {
            ...AssociationConfig_valueVMOptions
          }
          valueVMTypeOptions(path: $path) {
            ...AssociationConfig_valueVMTypeOptions
          }
        }
      `}
      variables={{ path }}
      render={({ error, props: cprops }) => {
        if (error) {
          return (<Alert bsStyle="danger">{error.message}</Alert>);
        } else if (cprops) {
          return (
            <AssociationConfig
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
