import React from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';
import { Alert } from 'react-bootstrap';
import Spinner from '../Spinner';
import ProfileNav from '../../profiles/ProfileNav';
import { getEnvironment } from '../environment';

const debug = require('debug')('app:base:profiles:ProfileNav');

const Root = ({ history, location, match }) => {
  const { url: path } = match;
  debug('path', path);
  return (
    <QueryRenderer
      environment={getEnvironment()}
      query={graphql`
        query ProfileNavQuery($path: String!) {
          profileNav(path: $path) {
            ...ProfileNav_profileNav
          }
        }
      `}
      variables={{ path }}
      render={({ error, props: cprops }) => {
        if (error) {
          return (<Alert bsStyle="danger">{error.message}</Alert>);
        } else if (cprops) {
          return (
            <ProfileNav
              history={history}
              location={location}
              match={match}
              profileNav={cprops.profileNav}
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
