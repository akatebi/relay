import PropTypes from 'prop-types';
import React from 'react';
import EntityLink from '../entities/EntityLink';

const HeaderLink = ({ entity, location }) => (
  <div className="header">
    <span className="header-link-label">Identity - </span>
    <EntityLink
      entityVM={entity}
      location={location}
      classOverride="header-link2"
    />
  </div>
);

HeaderLink.propTypes = {
  entity: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default HeaderLink;
