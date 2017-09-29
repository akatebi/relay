import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import React, { Component } from 'react';
import { FormControl } from 'react-bootstrap';

// const debug = require('debug')('app:component:profiles:Property:RichTextAttr');

class RichTextAttr extends Component {

  static propTypes = {
    action: PropTypes.string.isRequired,
    isEditable: PropTypes.bool.isRequired,
    customAttr: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { customAttr: { value: { valueRichText } } } = this.props;
    this.setState({ valueRichText });
  }

  render() {
    const {
      action,
      isEditable,
      onChange,
      customAttr: {
        name: headerLabel,
        value: { valueRichText },
      },
    } = this.props;

    const editProps = {
      style: { textAlign: 'left' },
      type: 'text',
      value: this.state.valueVMRichText,
      onChange: ({ target: { value } }) => {
        this.setState({ valueVMRichText: value });
        const { customAttr: { name, type, value: { valueVMRichText } } } = this.props;
        onChange(name, type, valueVMRichText, value);
      },
    };

    if (action === 'edit' && isEditable) {
      return (
        <span>
          {headerLabel && <span className="property-label">{headerLabel}</span>}
          <span><FormControl {...editProps('text', headerLabel)} /></span>
        </span>
      );
    }
    return (
      <div>
        <span className="property-label">{headerLabel}</span>
        <span className="value-md">{valueRichText}</span>
      </div>
    );
  }
}


export default createFragmentContainer(RichTextAttr, {
  customAttr: graphql`
    fragment RichText_customAttr on CustomAttribute {
      type
      name
      value {
        ... on RichTextAttr {
          valueRichText
        }
      }
    }
  `,
});
