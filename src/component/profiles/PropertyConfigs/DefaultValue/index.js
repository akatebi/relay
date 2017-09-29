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

const DefaultValue = ({
  action,
  isEditable,
  onChange,
  headerLabel,
  propertyConfig: property,
  propertyConfig: { propertyType },
  valueVMOptions: options,
  valueVMTypeOptions: typeOptions,
}) => {
  const props = {
    action,
    isEditable,
    headerLabel,
    onChange,
    property,
  };
  const props2 = {
    action,
    isEditable,
    headerLabel,
    onChange,
    property,
    options,
  };
  const props3 = {
    action,
    isEditable,
    headerLabel,
    onChange,
    property,
    typeOptions,
  };
  switch (propertyType) {
    case 'Boolean': return <Boolean {...props} />;
    case 'Category': return <Category {...props2} />;
    case 'ControlNumber': return <ControlNumber {...props} />;
    case 'Date': return <Date {...props} />;
    case 'Decimal': return <Decimal {...props} />;
    case 'Entity': return <Entity {...props3} />;
    case 'EntityList': return <EntityList {...props3} />;
    case 'Float': return <Float {...props} />;
    case 'Integer': return <Integer {...props} />;
    case 'RichText': return <RichText {...props} />;
    case 'RoleList': return <RoleList {...props2} />;
    case 'Text': return <Text {...props} />;
    default:
      return (
        <div>
          <span className="property-label">
            Default Value: </span>
          Warning - Property Type Unknown: {propertyType}
        </div>
      );
  }
};

DefaultValue.propTypes = {
  action: PropTypes.string.isRequired,
  isEditable: PropTypes.bool.isRequired,
  headerLabel: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  propertyConfig: PropTypes.object.isRequired,
  valueVMOptions: PropTypes.object.isRequired,
  valueVMTypeOptions: PropTypes.object.isRequired,
};


export default createFragmentContainer(DefaultValue, {
  propertyConfig: graphql`
    fragment DefaultValue_propertyConfig on PropertyConfig {
      propertyType
      ...Boolean_property
      ...Category_property
      ...ControlNumber_property
      ...Date_property
      ...Decimal_property
      ...EntityList_property
      ...Entity_property
      ...Float_property
      ...Integer_property
      ...RichText_property
      ...RoleList_property
      ...Text_property
    }
  `,
  valueVMOptions: graphql`
    fragment DefaultValue_valueVMOptions on ValueVMOptions {
      ...Category_options
      ...RoleList_options
    }
  `,
  valueVMTypeOptions: graphql`
    fragment DefaultValue_valueVMTypeOptions on ValueVMTypeOptions {
      ...Entity_typeOptions
      ...EntityList_typeOptions
    }
  `,
});
