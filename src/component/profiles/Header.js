import PropTypes from 'prop-types';
import React from 'react';

const Header = props => (
  <div className="header">
    <span>{props.label}</span>
  </div>
);

Header.propTypes = {
  label: PropTypes.string.isRequired,
};

export default Header;
