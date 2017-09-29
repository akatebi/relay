import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import { FormControl } from 'react-bootstrap';

// const debug = require('debug')('app:component:profiles:Property:IntegerProp');

class IntegerProp extends Component {

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
    const { property: { defaultValue: { valueVMInteger } } } = this.props;
    this.setState({ valueVMInteger });
  }

  render() {
    const {
      action,
      isEditable,
      onChange,
      headerLabel,
      property: { defaultValue: { valueVMInteger } },
    } = this.props;

    const editProps = {
      bsSize: 'sm',
      style: { textAlign: 'left' },
      type: 'number',
      label: headerLabel,
      value: this.state.valueVMInteger,
      onChange: ({ target: { value: val } }) => {
        const value = parseInt(val, 10);
        this.setState({ valueVMInteger: value });
        const { property: { propertyType, defaultValue: { valueVMInteger: defaultValue } } } = this.props;
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
        <span className="value-md">{valueVMInteger}</span>
      </div>
    );
  }
}


export default createFragmentContainer(IntegerProp, {
  property: graphql`
  fragment Integer_property on PropertyConfig {
    propertyType
    defaultValue {
      ... on IntegerProp {
        valueVMInteger
      }
    }
  }
  `,
});
