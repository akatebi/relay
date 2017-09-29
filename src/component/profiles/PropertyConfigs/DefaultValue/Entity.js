import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import Select from 'react-select';
import { normalize } from '../../normalize';
import { getEntityLabelByType } from '../../../../../share/entityRouteMaps';

const debug = require('debug')('app:component:profiles:PropertyConfigs:DefaultValue:Entity');

class EntityProp extends Component {

  static propTypes = {
    action: PropTypes.string.isRequired,
    isEditable: PropTypes.bool.isRequired,
    headerLabel: PropTypes.string.isRequired,
    property: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    typeOptions: PropTypes.shape({
      entityOptions: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
          entityType: PropTypes.string.isRequired,
          familyId: PropTypes.string.isRequired,
          isFamily: PropTypes.bool.isRequired,
          cultureCode: PropTypes.string,
          operation: PropTypes.string.isRequired,
          reportingKey: PropTypes.string,
        }),
      ).isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    debug('props', this.props);
    const { valueVMEntity } = this.props.property.defaultValue;
    this.setState({ valueVMEntity });
  }

  valueVMEntity() {
    const { typeOptions: { entityOptions } } = this.props;
    return entityOptions.map(x => ({ value: x.id, ...x }));
  }

  render() {
    const { property: { customAttributes } } = this.props;
    const { value } = customAttributes.find(attrib => attrib.name === 'ValueType');
    debug('Entity Default Value entityType', value);
    const { valueCategory: { value: entityType } } = value;

    const {
      action,
      isEditable,
      headerLabel,
      onChange,
      property: { defaultValue: { valueVMEntity } },
    } = this.props;

    if (!valueVMEntity) {
      return <span className="property-label">{headerLabel}:</span>;
    }

    const placeholder = () =>
      ([
        'ApplicationRole',
        'ApprovalCycleConfig',
        'OrganizationHierarchy',
        'Organization',
      ].includes(entityType)
        ? `Choose an ${getEntityLabelByType(entityType)}`
        : `Choose a ${getEntityLabelByType(entityType)}`);

    const getValue = l => (l ? ({ value: l.id, ...l }) : null);

    const x = this.state.valueVMEntity;
    const pickerOptions =
      ({
        multi: false,
        autoBlur: true,
        placeholder: placeholder(),
        value: getValue(x),
        options: this.valueVMEntity(),
        onChange: (valueVMEntity) => {
          // window.log(valueVMEntity);
          this.setState({ valueVMEntity });
          const value = normalize(valueVMEntity);
          const { property: { propertyType, defaultValue: { valueVMEntity: val } } } = this.props;
          const defaultValue = normalize(val);
          onChange(propertyType, defaultValue, value);
        },
      });

    return (
      <div>
        <span className="property-label">{headerLabel}</span>
        {(action === 'edit' && isEditable) ?
          <Select {...pickerOptions} /> :
          <span className="value-md">{valueVMEntity.label}</span>
        }
      </div>
    );
  }
}

export default createFragmentContainer(EntityProp, {
  property: graphql`
    fragment Entity_property on PropertyConfig {
      propertyType
      customAttributes {
        name
        value {
          ... on CategoryAttr {
            valueCategory {
              value
            }
          }
        }
      }
      defaultValue {
        ... on EntityProp {
          valueVMEntity {
            id
            label
            entityType
            familyId
            isFamily
            cultureCode
            operation
            reportingKey
          }
        }
      }
    }
  `,
  typeOptions: graphql`
    fragment Entity_typeOptions on ValueVMTypeOptions {
      entityOptions {
        id
        label
        entityType
        familyId
        isFamily
        cultureCode
        operation
        reportingKey
      }
    }
  `,
});
