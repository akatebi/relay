import React from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';
import { Alert } from 'react-bootstrap';
import Spinner from '../Spinner';
import Type from '../../newPage/Type';
import { getEnvironment } from '../environment';
import { allParams } from '../service';

const debug = require('debug')('app:component:base:newpage:Type');

const Root = ({ history, location, match, params }) => {
  const paramsAll = allParams({ location, match, params, name: ':type' });
  const { entityRoute, klass } = paramsAll;
  debug('paramsAll', paramsAll);
  return (
    <QueryRenderer
      environment={getEnvironment()}
      query={graphql`
        query TypeQuery($entityRoute: String!, $klass: String!) {
          contentIdentity(entityRoute: $entityRoute) {
            ...Type_contentIdentity
          }
          newPageType(klass: $klass) {
            ...Type_newPageType
          }
        }
      `}
      variables={{ entityRoute, klass }}
      render={({ error, props: cprops }) => {
        if (error) {
          return (<Alert bsStyle="danger">{error.message}</Alert>);
        } else if (cprops) {
          return (
            <Type
              history={history}
              location={location}
              match={match}
              params={paramsAll}
              newPageType={cprops.newPageType}
              contentIdentity={cprops.contentIdentity}
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
  match: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
};

export default Root;
