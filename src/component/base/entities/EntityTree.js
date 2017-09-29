import React from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';
import { Alert } from 'react-bootstrap';
import Spinner from '../Spinner';
import EntityTree from '../../entities/EntityTree';
import { getEnvironment } from '../environment';

const debug = require('debug')('app:component:base:entities:EntityTree');

const Root = ({ history, location, location: { pathname: entity } }) => {
  debug('entity', entity);
  return (
    <QueryRenderer
      environment={getEnvironment()}
      query={graphql`
        query EntityTreeQuery($entity: String!) {
          entityTree(entity: $entity) {
            ...EntityTree_entityTree
          }
        }
      `}
      variables={{ entity }}
      render={({ error, props: cprops }) => {
        if (error) {
          return (<Alert bsStyle="danger">{error.message}</Alert>);
        } else if (cprops) {
          return (
            <EntityTree
              location={location}
              history={history}
              entityTree={cprops.entityTree}
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
