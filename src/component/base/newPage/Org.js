import React from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';
import { Alert } from 'react-bootstrap';
import Spinner from '../Spinner';
import Org from '../../newPage/Org';
import { getEnvironment } from '../environment';
import { allParams } from '../service';

const debug = require('debug')('app:component:base:newpage:Org');

const Root = ({ history, location, match }) => {
  const paramsAll = allParams({ location, match, name: ':org' });
  const { entityRoute } = paramsAll;
  debug('paramsAll', paramsAll);
  return (
    <QueryRenderer
      environment={getEnvironment()}
      query={graphql`
        query OrgQuery($entityRoute: String!) {
          contentIdentity(entityRoute: $entityRoute) {
            ...Org_contentIdentity
          }
          newPageOrg {
            ...Org_newPageOrg
          }
        }
      `}
      variables={{ entityRoute }}
      render={({ error, props: cprops }) => {
        if (error) {
          return (<Alert bsStyle="danger">{error.message}</Alert>);
        } else if (cprops) {
          return (
            <Org
              history={history}
              location={location}
              match={match}
              params={paramsAll}
              newPageOrg={cprops.newPageOrg}
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
};

export default Root;
