import PropTypes from 'prop-types';
import React from 'react';

const SubHeader = props => (
  <div className="subheader">
    <span>&nbsp;{props.label}</span>
  </div>);

SubHeader.propTypes = {
  label: PropTypes.string.isRequired,
};

export default SubHeader;
