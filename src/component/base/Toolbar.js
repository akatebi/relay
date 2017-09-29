import React from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';
import { Alert } from 'react-bootstrap';
import Spinner from './Spinner';
import Toolbar from '../Toolbar';
import { getEnvironment } from './environment';

const debug = require('debug')('app:base:Toolbar');

const Root = ({ history, location, match, params }) => {
  const { docId } = params;
  const { url: path } = match;
  const variables = { docId, path };
  debug('docId', docId);
  debug('path', path);
  return (
    <QueryRenderer
      environment={getEnvironment()}
      query={graphql`
        query ToolbarQuery($docId: String!, $path: String!) {
          approvalCycleToolbar(docId: $docId) {
            ...Toolbar_approvalCycleToolbar
          }
          identity(path: $path) {
            ...Toolbar_identity
          }
          lockStatus(path: $path) {
            ...Toolbar_lockStatus
          }
          toolbar(path: $path) {
            ...Toolbar_toolbar
          }
        }
      `}
      variables={variables}
      render={({ error, props: cprops }) => {
        if (error) {
          return (<Alert bsStyle="danger">{error.message}</Alert>);
        } else if (cprops) {
          return (
            <Toolbar
              history={history}
              location={location}
              match={match}
              params={params}
              variables={variables}
              approvalCycleToolbar={cprops.approvalCycleToolbar}
              identity={cprops.identity}
              lockStatus={cprops.lockStatus}
              toolbar={cprops.toolbar}
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
