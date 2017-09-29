import React from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';
import { Alert } from 'react-bootstrap';
import { getEnvironment } from '../environment';
import Spinner from '../Spinner';
import User from '../../entities/entityData/User';
import { getGUID } from '../service';

const debug = require('debug')('app:component:base:entities:User');

const Root = ({ location, location: { pathname } }) => {
  const docId = getGUID(pathname);
  let path = pathname.split(docId)[0];
  path = `${path}${docId}`;
  debug('User path', path);
  return (
    <QueryRenderer
      environment={getEnvironment()}
      query={graphql`
        query UserQuery($path: String!) {
          entity(path: $path) {
            ...User_entity
          }
          identity(path: $path) {
            ...User_identity
          }
          valueVMOptions {
            ...User_valueVMOptions
          }
          valueVMTypeOptions(path: $path) {
            ...User_valueVMTypeOptions
          }
        }
      `}
      variables={{ path }}
      render={({ error, props: cprops }) => {
        if (error) {
          return (<Alert bsStyle="danger">{error.message}</Alert>);
        } else if (cprops) {
          return (
            <User
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
