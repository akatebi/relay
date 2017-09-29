import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import { FormControl } from 'react-bootstrap';

// const debug = require('debug')('app:component:profiles:Property:RichTextProp');

class RichTextProp extends Component {

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
    const { property: { defaultValue: { valueVMRichText } } } = this.props;
    this.setState({ valueVMRichText });
  }

  render() {
    const {
      action,
      isEditable,
      onChange,
      headerLabel,
      property: { defaultValue: { valueVMRichText } },
    } = this.props;

    const editProps = {
      style: { textAlign: 'left' },
      type: 'text',
      label: headerLabel,
      value: this.state.valueVMRichText,
      onChange: ({ target: { value } }) => {
        this.setState({ valueVMRichText: value });
        const { property: { propertyType, defaultValue: { valueVMRichText: defaultValue } } } = this.props;
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
        <span className="value-md">{valueVMRichText}</span>
      </div>
    );
  }
}


export default createFragmentContainer(RichTextProp, {
  property: graphql`
  fragment RichText_property on PropertyConfig {
    propertyType
    defaultValue {
      ... on RichTextProp {
        valueVMRichText
      }
    }
  }
  `,
});
