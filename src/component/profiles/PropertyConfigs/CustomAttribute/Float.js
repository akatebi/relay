import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import React, { Component } from 'react';
import { FormControl } from 'react-bootstrap';

// const debug = require('debug')('component:profiles:Property:FloatAttr');

class FloatAttr extends Component {

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
    const { customAttr: { value: { valueFloat } } } = this.props;
    this.setState({ valueFloat });
  }

  render() {
    const {
      action,
      isEditable,
      onChange,
      customAttr: {
        name: headerLabel,
        value: { valueFloat },
      },
    } = this.props;

    const editProps = {
      style: { textAlign: 'left' },
      type: 'number',
      label: 'headerLabel',
      step: '0.01',
      value: this.state.valueFloat,
      onChange: ({ target: { value: val } }) => {
        const value = parseFloat(val);
        this.setState({ valueFloat: value });
        const { customAttr: { name, type, value: { valueFloat } } } = this.props;
        onChange(name, type, valueFloat, value);
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
        <span className="value-md">{valueFloat}</span>
      </div>
    );
  }
}


export default createFragmentContainer(FloatAttr, {
  customAttr: graphql`
    fragment Float_customAttr on CustomAttribute {
      type
      name
      value {
        ... on FloatAttr {
          valueFloat
        }
      }
    }
  `,
});
