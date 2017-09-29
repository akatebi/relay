import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const Label = ({
  propertyContent: {
    propertyType,
    /* config: {
      propertyBehavior,
    }, */
    id,
    label,
  },
}) => {
  /*
  const isClassify = propertyBehavior === 'Classification';
  const classifyIcon = isClassify ?
    (<OverlayTrigger
      placement="top"
      overlay={<Tooltip id={id}>Classification</Tooltip>}>
      <span style={{ marginLeft: 20 }}>
        <span className="glyphicon glyphicon-flag classify-icon" />
      </span>
    </OverlayTrigger>) :
    <span className="propertyContent-label" style={{ marginLeft: 20 }} />;
  */

  const getLabel = (
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip id={id}>{propertyType}</Tooltip>}
    >
      <span
        className="property-label pull-right"
        style={{ paddingRight: '2px' }}
      >{label}</span>
    </OverlayTrigger>
  );

  return (
    <div>
      {/* classifyIcon */}
      {getLabel}
    </div>

  );
};

Label.propTypes = {
  propertyContent: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    config: PropTypes.shape({
      propertyBehavior: PropTypes.string.isRequired,
    }).isRequired,
    propertyType: PropTypes.string.isRequired,
  }),
};

export default createFragmentContainer(Label, {
  propertyContent: graphql`
    fragment Label_propertyContent on PropertyContent {
      id
      label
      config {
        propertyBehavior
      }
      propertyType
    }
  `,
});
