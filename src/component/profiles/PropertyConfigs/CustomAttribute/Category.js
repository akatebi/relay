import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import React, { Component } from 'react';
import Select from 'react-select';
// import { getEntityLabelByType } from '../../../../../share/entityRouteMaps';
import { normalize } from '../../normalize';

const debug = require('debug')('app:component:profiles:PropertyConfigs:CustomAttribute:Category');

class CategoryAttr extends Component {

  static propTypes = {
    action: PropTypes.string.isRequired,
    isEditable: PropTypes.bool.isRequired,
    customAttr: PropTypes.object.isRequired,
    optionsAttr: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { value: { valueCategory } } = this.props.customAttr;
    this.setState({ valueCategory });
  }

  requestCategories = () => {
    const { optionsAttr: { entityTypeOptions } } = this.props;
    return entityTypeOptions.map(x => ({ value: x.id, ...x }));
  }

  render() {
    const {
      action,
      isEditable,
      customAttr: {
        name: headerLabel,
        value: { valueCategory },
      },
      onChange,
    } = this.props;

    // window.log(this.props.customAttr);

    if (!valueCategory) {
      return <span className="customAttr-label">{headerLabel}:</span>;
    }

    const getValue = l => (l ? ({ value: l.id, ...l }) : null);

    const pickerOptions =
      ({
        multi: false,
        autoBlur: true,
        placeholder: 'Choose a Category',
        value: getValue(this.state.valueCategory),
        options: this.requestCategories(),
        onChange: (v) => {
          debug('onChange', v);
          this.setState({ valueCategory: v });
          const value = normalize(v);
          const { customAttr: { name, type, value: { valueCategory: val } } } = this.props;
          const valueCategory = normalize(val);
          onChange(name, type, valueCategory, value);
        },
      });

    return (
      <div>
        <span className="property-label">{headerLabel}</span>
        {(action === 'edit' && isEditable) ?
          <Select {...pickerOptions} /> :
          <span className="value-md">{valueCategory.label}&nbsp;&nbsp;</span>
        }
      </div>
    );
  }
}


export default createFragmentContainer(CategoryAttr, {
  customAttr: graphql`
    fragment Category_customAttr on CustomAttribute {
      type
      name
      value {
        ... on CategoryAttr {
          valueCategory {
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
  optionsAttr: graphql`
    fragment Category_optionsAttr on ValueVMOptions {
      entityTypeOptions {
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
