import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import { FormControl } from 'react-bootstrap';

// const debug = require('debug')('component:profiles:Property:FloatProp');

class FloatProp extends Component {

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
    const { property: { defaultValue: { valueVMFloat } } } = this.props;
    this.setState({ valueVMFloat });
  }

  render() {
    const {
      action,
      isEditable,
      onChange,
      headerLabel,
      property: { defaultValue: { valueVMFloat } },
    } = this.props;

    const editProps = {
      style: { textAlign: 'left' },
      type: 'number',
      label: 'headerLabel',
      step: '0.01',
      value: this.state.valueVMFloat,
      onChange: ({ target: { value: val } }) => {
        const value = parseFloat(val);
        this.setState({ valueVMFloat: value });
        const { property: { propertyType, defaultValue: { valueVMFloat: defaultValue } } } = this.props;
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
        <span className="value-md">{valueVMFloat}</span>
      </div>
    );
  }
}


export default createFragmentContainer(FloatProp, {
  property: graphql`
  fragment Float_property on PropertyConfig {
    propertyType
    defaultValue {
      ... on FloatProp {
        valueVMFloat
      }
    }
  }
  `,
});
