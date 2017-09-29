import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import React from 'react';
import Boolean from './Boolean';
import Category from './Category';
// import ControlNumber from './ControlNumber';
import Date from './Date';
import Decimal from './Decimal';
import Entity from './Entity';
import EntityList from './EntityList';
import Float from './Float';
import Integer from './Integer';
import RichText from './RichText';
import RoleList from './RoleList';
import Text from './Text';

const PropertyContent = ({
  action,
  onChange,
  relationshipToPropertyContent: { tail: propertyContent, tail: { propertyType } },
  valueVMOptions,
  valueVMTypeOptions,
}) => {
  const props = {
    action,
    propertyContent,
    onChange,
  };
  const props2 = {
    action,
    propertyContent,
    onChange,
    valueVMOptions,
    valueVMTypeOptions,
  };
  switch (propertyType) {
    case 'Boolean': return <Boolean {...props} />;
    case 'Category': return <Category {...props2} />;
    // case 'ControlNumber': return <ControlNumber {...props} />;
    case 'Date': return <Date {...props} />;
    case 'Decimal': return <Decimal {...props} />;
    case 'Entity': return <Entity {...props2} />;
    case 'EntityList': return <EntityList {...props2} />;
    case 'Float': return <Float {...props} />;
    case 'Integer': return <Integer {...props} />;
    case 'RoleList': return <RoleList {...props2} />;
    case 'RichText': return <RichText {...props} />;
    case 'Text': return <Text {...props} />;
    default:
      return (
        <div style={{ marginLeft: 20 }}>
          Warning - erty Type Unknown:{propertyType}
        </div>
      );
  }
};

PropertyContent.propTypes = {
  action: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  relationshipToPropertyContent: PropTypes.shape({
    tail: PropTypes.shape({
      propertyType: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  valueVMOptions: PropTypes.object.isRequired,
  valueVMTypeOptions: PropTypes.object.isRequired,
};

export default createFragmentContainer(PropertyContent, {
  relationshipToPropertyContent: graphql`
    fragment PropertyContent_relationshipToPropertyContent on RelationshipToPropertyContent {
      tail {
        propertyType
        ...Boolean_propertyContent
        ...Category_propertyContent
        # ...ControlNumber_propertyContent
        ...Date_propertyContent
        ...Decimal_propertyContent
        ...Entity_propertyContent
        ...EntityList_propertyContent
        ...Float_propertyContent
        ...Integer_propertyContent
        ...RichText_propertyContent
        ...RoleList_propertyContent
        ...Text_propertyContent
      }
    }
  `,
  valueVMOptions: graphql`
    fragment PropertyContent_valueVMOptions on ValueVMOptions {
      ...Category_valueVMOptions
      ...RoleList_valueVMOptions
    }
  `,
  valueVMTypeOptions: graphql`
    fragment PropertyContent_valueVMTypeOptions on ValueVMTypeOptions {
      ...Entity_valueVMTypeOptions
      ...EntityList_valueVMTypeOptions
    }
  `,
});
