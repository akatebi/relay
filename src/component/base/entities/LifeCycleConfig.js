import React from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';
import { Alert } from 'react-bootstrap';
import { getEnvironment } from '../environment';
import Spinner from '../Spinner';
import LifeCycleConfig from '../../entities/entityData/LifeCycleConfig';
import { getGUID } from '../service';

const debug = require('debug')('app:component:base:entities:LifeCycleConfig');

const Root = ({ location, location: { pathname } }) => {
  const docId = getGUID(pathname);
  let path = pathname.split(docId)[0];
  path = `${path}${docId}`;
  debug('path', path);
  return (
    <QueryRenderer
      environment={getEnvironment()}
      query={graphql`
        query LifeCycleConfigQuery($path: String!) {
          entity(path: $path) {
            ...LifeCycleConfig_entity
          }
          identity(path: $path) {
            ...LifeCycleConfig_identity
          }
        }
      `}
      variables={{ path }}
      render={({ error, props: cprops }) => {
        if (error) {
          return (<Alert bsStyle="danger">{error.message}</Alert>);
        } else if (cprops) {
          return (
            <LifeCycleConfig
              location={location}
              entity={cprops.entity}
              identity={cprops.identity}
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
