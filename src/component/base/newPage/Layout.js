import React from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';
import { Alert } from 'react-bootstrap';
import Spinner from '../Spinner';
import Layout from '../../newPage/Layout';
import { getEnvironment } from '../environment';
import { allParams } from '../service';

const debug = require('debug')('app:component:base:newpage:Klass');

const Root = ({ history, location, match, params }) => {
  const paramsAll = allParams({ location, match, params, name: ':layout' });
  const { entityRoute, type } = paramsAll;
  debug('paramsAll', paramsAll);
  return (
    <QueryRenderer
      environment={getEnvironment()}
      query={graphql`
        query LayoutQuery($entityRoute: String!, $type: String!) {
          contentIdentity(entityRoute: $entityRoute) {
            ...Layout_contentIdentity
          }
          newPageLayout(type: $type) {
            ...Layout_newPageLayout
          }
        }
      `}
      variables={{ entityRoute, type }}
      render={({ error, props: cprops }) => {
        if (error) {
          return (<Alert bsStyle="danger">{error.message}</Alert>);
        } else if (cprops) {
          return (
            <Layout
              history={history}
              location={location}
              match={match}
              params={paramsAll}
              newPageLayout={cprops.newPageLayout}
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
