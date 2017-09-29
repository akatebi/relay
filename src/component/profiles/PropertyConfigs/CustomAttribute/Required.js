import PropTypes from 'prop-types';
import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const Required = (props) => {
  // console.log('Required Props', window.pretty(props));

  const { id } = props;
  const { config: { validations } } = props.property;
  const isRequired =
    validations.filter(val => val.type === 'Required').length > 0;
  // console.log('Required', window.pretty(validations));

  const requiredIcon =
    isRequired &&
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip id={id}>Required</Tooltip>}
    >
      <span>
        &nbsp;&nbsp;&nbsp;
        <span className="glyphicon glyphicon-star required-icon" style={{ marginTop: 8 }} />
      </span>
    </OverlayTrigger>;

  return requiredIcon;
};

Required.propTypes = {
  property: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
};

export default Required;
