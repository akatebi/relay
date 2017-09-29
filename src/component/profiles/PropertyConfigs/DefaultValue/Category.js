import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import Select from 'react-select';
import { getEntityLabelByType } from '../../../../../share/entityRouteMaps';
import { normalize } from '../../normalize';

// const debug = require('debug')('app:component:profiles:PropertyConfigs:DefaultValue:CategoryProp');

class CategoryProp extends Component {

  static propTypes = {
    action: PropTypes.string.isRequired,
    isEditable: PropTypes.bool.isRequired,
    headerLabel: PropTypes.string.isRequired,
    property: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.shape({
      categoryOptions: PropTypes.arrayOf(
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
    const { defaultValue, isMultiSelect } = this.props.property;
    // debug('******* DEFAULT VALUE', window.pretty(defaultValue));
    const { valueVMCategory, valueVMCategory: value } = defaultValue;
    const { entityType } = valueVMCategory[0];
    this.setState({ valueVMCategory: (isMultiSelect ? value : value[0]), entityType });
  }

  requestCategories = () => {
    const { options: { categoryOptions } } = this.props;
    return categoryOptions.map(x => ({ value: x.id, ...x }));
  }

  render() {
    const {
      action,
      isEditable,
      headerLabel,
      property: {
        isMultiSelect,
        defaultValue: { valueVMCategory },
      },
      onChange,
    } = this.props;

    if (!valueVMCategory) {
      return <span className="property-label">{headerLabel}:</span>;
    }

    const getValue = l => (isMultiSelect ?
      l.map(x => ({ value: x.id, ...x })) :
      { value: l.id, ...l });

    const pickerOptions =
      ({
        multi: isMultiSelect,
        autoBlur: true,
        placeholder: `Choose a ${getEntityLabelByType(this.state.entityType)}`,
        value: getValue(this.state.valueVMCategory),
        options: this.requestCategories(),
        onChange: (valueVMCategory) => {
          // window.log(valueVMCategory);
          this.setState({ valueVMCategory });
          const value = normalize(valueVMCategory);
          const { property: { propertyType, defaultValue: { valueVMCategory: val } } } = this.props;
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
            {valueVMCategory.map(({ id, label }) =>
              <span key={id} className="value-md">{label}</span>)}
          </span>
        }
      </div>
    );
  }
}


export default createFragmentContainer(CategoryProp, {
  property: graphql`
    fragment Category_property on PropertyConfig {
      isMultiSelect,
      propertyType
      defaultValue {
        ... on CategoryProp {
          valueVMCategory {
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
  options: graphql`
    fragment Category_options on ValueVMOptions {
      categoryOptions {
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
