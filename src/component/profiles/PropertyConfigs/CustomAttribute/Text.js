import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import React, { Component } from 'react';
import { FormControl } from 'react-bootstrap';

// const debug = require('debug')('app:component:profiles:Property:TextAttr');

class TextAttr extends Component {

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
    const { customAttr: { value: { valueText } } } = this.props;
    this.setState({ valueText });
  }

  render() {
    const {
      action,
      isEditable,
      onChange,
      customAttr: {
        name: headerLabel,
        value: { valueText },
      },
    } = this.props;

    const editProps = {
      bsSize: 'sm',
      style: { textAlign: 'left' },
      type: 'text',
      label: headerLabel,
      value: this.state.valueText,
      onChange: ({ target: { value } }) => {
        this.setState({ valueVMText: value });
        const { customAttr: { name, type, value: { valueText } } } = this.props;
        onChange(name, type, valueText, value);
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
        <span className="value-md">{valueText}</span>
      </div>
    );
  }

}


export default createFragmentContainer(TextAttr, {
  customAttr: graphql`
    fragment Text_customAttr on CustomAttribute {
      type
      name
      value {
        ... on TextAttr {
          valueText
        }
      }
    }
  `,
});
