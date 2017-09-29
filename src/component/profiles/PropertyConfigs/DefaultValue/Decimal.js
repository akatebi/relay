import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import { FormControl } from 'react-bootstrap';

// const debug = require('debug')('app:component:profiles:Property:DecimalProp');

class DecimalProp extends Component {

  static propTypes = {
    action: PropTypes.string.isRequired,
    isEditable: PropTypes.bool.isRequired,
    headerLabel: PropTypes.string.isRequired,
    property: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { property: { defaultValue: { valueVMDecimal } } } = this.props;
    this.setState({ valueVMDecimal });
  }

  render() {
    const {
      action,
      isEditable,
      onChange,
      headerLabel,
      property: { defaultValue: { valueVMDecimal } },
    } = this.props;

    const editProps = {
      componentClass: 'input',
      style: { textAlign: 'left' },
      type: 'number',
      label: headerLabel,
      value: this.state.valueVMDecimal,
      onChange: ({ target: { value: val } }) => {
        const value = parseFloat(val);
        this.setState({ valueVMDecimal: value });
        const { property: { propertyType, defaultValue: { valueVMDecimal: defaultValue } } } = this.props;
        onChange(propertyType, defaultValue, value);
      },
    };

    if (action === 'edit' && isEditable) {
      return (
        <span>
          {headerLabel && <span className="property-label">{headerLabel}</span>}
          <span><FormControl {...editProps} /></span>
        </span>
      );
    }
    return (
      <div>
        <span className="property-label">{headerLabel}</span>
        <span className="value-md">{valueVMDecimal}</span>
      </div>
    );
  }
}


export default createFragmentContainer(DecimalProp, {
  property: graphql`
  fragment Decimal_property on PropertyConfig {
    propertyType
    defaultValue {
      ... on DecimalProp {
        valueVMDecimal
      }
    }
  }
  `,
});
