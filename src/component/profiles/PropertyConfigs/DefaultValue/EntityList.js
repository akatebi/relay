import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import Select from 'react-select';
import { getEntityLabelByType } from '../../../../../share/entityRouteMaps';
import { normalize } from '../../normalize';

const debug = require('debug')('component.profiles.EntityListProp');

class EntityListProp extends Component {

  static propTypes = {
    action: PropTypes.string.isRequired,
    isEditable: PropTypes.bool.isRequired,
    headerLabel: PropTypes.string.isRequired,
    property: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    typeOptions: PropTypes.shape({
      entityListOptions: PropTypes.arrayOf(
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
    const { defaultValue, isMultiSelect, customAttributes } = this.props.property;
    const { valueVMEntityList: x } = defaultValue;
    this.setState({ valueVMEntityList: isMultiSelect ? x : x[0] });
    const customAttribute = customAttributes.find(({ name }) => name === 'ListType');
    if (customAttribute) {
      debug(customAttribute.value.valueCategory.value);
    }
  }

  requestEntities() {
    const { typeOptions: { entityListOptions } } = this.props;
    return entityListOptions.map(x => ({ value: x.id, ...x }));
  }

  render() {
    const {
      action,
      isEditable,
      onChange,
      headerLabel,
      property: {
        isMultiSelect,
        defaultValue: { valueVMEntityList },
      },
    } = this.props;

    const entityType = 'ApplicationRole';

    if (!valueVMEntityList) {
      return false;
    }

    const placeholder = () =>
      ([
        'ApplicationRole',
        'ApprovalCycleConfig',
        'CategoryHierarchy',
        'Organization',
      ].includes(entityType)
        ? `Choose an ${getEntityLabelByType(entityType)}`
        : `Choose a ${getEntityLabelByType(entityType)}`);


    const getValue = l => (isMultiSelect ?
      l.map(x => ({ value: x.id, ...x })) :
      { value: l.id, ...l });

    const pickerOptions =
      ({
        multi: isMultiSelect,
        autoBlur: true,
        placeholder: placeholder(),
        value: this.state.valueVMEntityList ? getValue(this.state.valueVMEntityList) : null,
        options: this.requestEntities(),
        onChange: (valueVMEntityList) => {
          // window.log(valueVMEntityList);
          this.setState({ valueVMEntityList });
          const value = normalize(valueVMEntityList);
          const { property: { propertyType, defaultValue: { valueVMEntityList: val } } } = this.props;
          const defaultValue = normalize(val[0]);
          onChange(propertyType, defaultValue, value);
        },
      });

    return (
      <div>
        <span className="property-label">{headerLabel}</span>
        {(action === 'edit' && isEditable) ?
          <Select {...pickerOptions} /> :
          <span>
            {valueVMEntityList.map(({ id, label }) =>
              <span key={id} className="value-md">{label}</span>)}
          </span>
        }
      </div>
    );
  }
}


export default createFragmentContainer(EntityListProp, {
  property: graphql`
    fragment EntityList_property on PropertyConfig {
      isMultiSelect
      propertyType
      defaultValue {
        ... on EntityListProp {
          valueVMEntityList {
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
    }
    `,
  typeOptions: graphql`
    fragment EntityList_typeOptions on ValueVMTypeOptions {
      entityListOptions {
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
