import PropTypes from 'prop-types';
import React from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import Boolean from './Boolean';
import Category from './Category';
import ControlNumber from './ControlNumber';
import Date from './Date';
import Decimal from './Decimal';
import EntityList from './EntityList';
import Entity from './Entity';
import Float from './Float';
import Integer from './Integer';
import RichText from './RichText';
import RoleList from './RoleList';
import Text from './Text';

const CustomAttribute = ({
  action,
  isEditable,
  onChange,
  valueVMOptions: optionsAttr,
  customAttribute: customAttr,
  customAttribute: { type },
}) => {
  const props = {
    action,
    isEditable,
    onChange,
    customAttr,
  };
  const props2 = {
    action,
    isEditable,
    onChange,
    customAttr,
    optionsAttr,
  };
  switch (type) {
    case 'Boolean': return <Boolean {...props} />;
    case 'Category': return <Category {...props2} />;
    case 'ControlNumber': return <ControlNumber {...props} />;
    case 'Date': return <Date {...props} />;
    case 'Decimal': return <Decimal {...props} />;
    case 'EntityList': return <EntityList {...props2} />;
    case 'Entity': return <Entity {...props2} />;
    case 'Float': return <Float {...props} />;
    case 'Integer': return <Integer {...props} />;
    case 'RichText': return <RichText {...props} />;
    case 'RoleList': return <RoleList {...props2} />;
    case 'Text': return <Text {...props} />;
    default:
      return (
        <div>
          <span className="property-label">
            Custom Attribute: </span>
          Warning - Property Type Unknown: {type}
        </div>
      );
  }
};

CustomAttribute.propTypes = {
  action: PropTypes.string.isRequired,
  isEditable: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  customAttribute: PropTypes.object.isRequired,
  valueVMOptions: PropTypes.object.isRequired,
};


export default createFragmentContainer(CustomAttribute, {
  customAttribute: graphql`
    fragment CustomAttribute_customAttribute on CustomAttribute {
      type
      ...Boolean_customAttr
      ...Category_customAttr
      ...ControlNumber_customAttr
      ...Date_customAttr
      ...Decimal_customAttr
      ...EntityList_customAttr
      ...Entity_customAttr
      ...Float_customAttr
      ...Integer_customAttr
      ...RichText_customAttr
      ...RoleList_customAttr
      ...Text_customAttr
    }
  `,
  valueVMOptions: graphql`
    fragment CustomAttribute_valueVMOptions on ValueVMOptions {
      ...Category_optionsAttr
      ...Entity_optionsAttr
      ...EntityList_optionsAttr
      ...RoleList_optionsAttr
    }
  `,
});
