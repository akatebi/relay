import React from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';
import { Alert } from 'react-bootstrap';
import Spinner from '../Spinner';
import AppSegments from '../../SubWiz/AppSegments';
import { getEnvironment } from '../environment';
import { getGUID } from '../service';

const debug = require('debug')('app:base:AppSegments');

const Root = ({ history, location, params }) => {
  const { pathname } = location;
  const docId = getGUID(pathname);
  debug('docId', docId);
  const { selectedCycleId } = params;
  debug('selectedCycleId', selectedCycleId);
  const basePath = pathname.split(docId)[0];
  const path = `${basePath}${docId}`;
  debug('path', path);
  return (
    <QueryRenderer
      environment={getEnvironment()}
      query={graphql`
        query AppSegmentsQuery($path: String!, $selectedCycleId: String!) {
          eligibleApprovers(path: $path, selectedCycleId: $selectedCycleId) {
            ...AppSegments_eligibleApprovers
          }
          identity(path: $path) {
            ...AppSegments_identity
          }
          selectedApprovalCycle(selectedCycleId: $selectedCycleId) {
            ...AppSegments_selectedApprovalCycle
          }
        }
      `}
      variables={{ path, selectedCycleId }}
      render={({ error, props: cprops }) => {
        if (error) {
          return (<Alert bsStyle="danger">{error.message}</Alert>);
        } else if (cprops) {
          return (
            <AppSegments
              history={history}
              location={location}
              params={{ ...params, docId, path, selectedCycleId }}
              eligibleApprovers={cprops.eligibleApprovers}
              identity={cprops.identity}
              selectedApprovalCycle={cprops.selectedApprovalCycle}
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
  params: PropTypes.object.isRequired,
};

export default Root;
