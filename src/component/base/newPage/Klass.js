import React from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';
import { Alert } from 'react-bootstrap';
import Spinner from '../Spinner';
import Klass from '../../newPage/Klass';
import { getEnvironment } from '../environment';
import { allParams } from '../service';

const debug = require('debug')('app:component:base:newpage:Klass');

const Root = ({ history, location, match, params }) => {
  const paramsAll = allParams({ location, match, params, name: ':klass' });
  const { entityRoute, org } = paramsAll;
  debug('paramsAll', paramsAll);
  return (
    <QueryRenderer
      environment={getEnvironment()}
      query={graphql`
        query KlassQuery($entityRoute: String!, $org: String!) {
          contentIdentity(entityRoute: $entityRoute) {
            ...Klass_contentIdentity
          }
          newPageKlass(org: $org) {
            ...Klass_newPageKlass
          }
        }
      `}
      variables={{ entityRoute, org }}
      render={({ error, props: cprops }) => {
        if (error) {
          return (<Alert bsStyle="danger">{error.message}</Alert>);
        } else if (cprops) {
          return (
            <Klass
              history={history}
              location={location}
              match={match}
              params={paramsAll}
              newPageKlass={cprops.newPageKlass}
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
