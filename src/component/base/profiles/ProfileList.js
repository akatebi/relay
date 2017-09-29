import React from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';
import { Alert } from 'react-bootstrap';
import Spinner from '../Spinner';
import ProfileList from '../../profiles/ProfileList';
import { getEnvironment } from '../environment';

const debug = require('debug')('app:component:base:profiles:ProfileList');

const Root = ({ location, location: { pathname: entity }, history }) => {
  debug('entity', entity);
  return (
    <QueryRenderer
      environment={getEnvironment()}
      query={graphql`
        query ProfileListQuery($entity: String!) {
          profileList(entity: $entity) {
            ...ProfileList_profileList
          }
        }
      `}
      variables={{ entity }}
      render={({ error, props: cprops }) => {
        if (error) {
          return (<Alert bsStyle="danger">{error.message}</Alert>);
        } else if (cprops) {
          return (
            <ProfileList
              history={history}
              location={location}
              profileList={cprops.profileList}
            />
          );
        }
        return <Spinner />;
      }}
    />);
};

Root.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default Root;
