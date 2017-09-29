import React from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';
import { Alert } from 'react-bootstrap';
import qs from 'qs';
import Spinner from '../Spinner';
import AppCycle from '../../SubWiz/AppCycle';
import { getEnvironment } from '../environment';
import { getGUID } from '../service';

const debug = require('debug')('app:base:SubWiz:AppCycle');

const Root = ({ history, location, match }) => {
  const { pathname, search } = location;
  const docId = getGUID(pathname);
  const { processType } = qs.parse(search, { ignoreQueryPrefix: true });
  // const { processType } = params;
  debug('processType', processType);
  let path = pathname.split(docId)[0];
  debug('docId', docId);
  path = `${path}${docId}`;
  debug('path', path);
  return (
    <QueryRenderer
      environment={getEnvironment()}
      query={graphql`
        query AppCycleQuery($path: String!, $processType: String!) {
          approvalCycleList(path: $path, processType: $processType) {
            ...AppCycle_approvalCycleList
          }
        }
      `}
      variables={{ path, processType }}
      render={({ error, props: cprops }) => {
        if (error) {
          return (<Alert bsStyle="danger">{error.message}</Alert>);
        } else if (cprops) {
          return (
            <AppCycle
              location={location}
              history={history}
              processType={processType}
              match={match}
              approvalCycleList={cprops.approvalCycleList}
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
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  // params: PropTypes.object.isRequired,
};

export default Root;
