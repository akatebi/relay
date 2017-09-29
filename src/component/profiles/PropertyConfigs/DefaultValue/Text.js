import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import { FormControl } from 'react-bootstrap';

// const debug = require('debug')('app:component:profiles:Property:TextProp');

class TextProp extends Component {

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
    const { property: { defaultValue: { valueVMText } } } = this.props;
    this.setState({ valueVMText });
  }

  render() {
    const {
      action,
      isEditable,
      onChange,
      headerLabel,
      property: { defaultValue: { valueVMText } },
    } = this.props;

    const editProps = {
      bsSize: 'sm',
      style: { textAlign: 'left' },
      type: 'text',
      label: headerLabel,
      value: this.state.valueVMText,
      onChange: ({ target: { value } }) => {
        this.setState({ valueVMText: value });
        const { property: { propertyType, defaultValue: { valueVMText: defaultValue } } } = this.props;
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
        <span className="value-md">{valueVMText}</span>
      </div>
    );
  }

}


export default createFragmentContainer(TextProp, {
  property: graphql`
  fragment Text_property on PropertyConfig {
    propertyType
    defaultValue {
      ... on TextProp {
        valueVMText
      }
    }
  }
  `,
});
