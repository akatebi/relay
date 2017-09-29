import PropTypes from 'prop-types';
import React from 'react';

const SubHeaderCollapsible = ({ id, expandId, label, onExpand, onCollapse }) =>
  (
    <div className="subheader">
      {(expandId === id) ?
        (<span
          onClick={evt => onCollapse(evt)}
          className="fa fa-minus-circle link"
          style={{ fontSize: '1.3em', margin: 4 }}
        />) :
        (<span
          onClick={evt => onExpand(id, evt)}
          className="fa fa-plus-circle link"
          style={{ fontSize: '1.3em', margin: 4 }}
        />)}
      <span>&nbsp;&nbsp;&nbsp;{label}</span>
    </div>
  );

SubHeaderCollapsible.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  expandId: PropTypes.string.isRequired,
  onExpand: PropTypes.func.isRequired,
  onCollapse: PropTypes.func.isRequired,
};

export default SubHeaderCollapsible;
