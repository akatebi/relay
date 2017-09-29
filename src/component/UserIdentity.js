import PropTypes from 'prop-types';
import React from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import EntityLink from './entities/EntityLink';

const UserIdentity = ({ viewer, location }) => {
  if (!viewer) {
    return false;
  }
  const { userIdentity } = viewer;
  const { user, organization } = userIdentity;
  return (
    <div className="row">
      <div style={{ float: 'right', marginRight: 15 }}>
        <EntityLink entityVM={user} location={location} />
        <span> @ </span>
        <EntityLink entityVM={organization} location={location} />
      </div>
    </div>);
};

UserIdentity.propTypes = {
  location: PropTypes.object.isRequired,
  viewer: PropTypes.object,
};

export default createFragmentContainer(UserIdentity, {
  viewer: graphql`
    fragment UserIdentity_viewer on Viewer {
      error
      userIdentity {
        token
        user {
          ...EntityLink_entityVM
        }
        organization {
          ...EntityLink_entityVM
        }
      }
    }
  `,
});
