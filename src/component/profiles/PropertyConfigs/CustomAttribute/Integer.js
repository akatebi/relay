import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import React, { Component } from 'react';
import { FormControl } from 'react-bootstrap';

// const debug = require('debug')('app:component:profiles:Property:IntegerAttr');

class IntegerAttr extends Component {

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
    const { customAttr: { value: { valueInteger } } } = this.props;
    this.setState({ valueInteger });
  }

  render() {
    const {
      action,
      isEditable,
      onChange,
      customAttr: {
        name: headerLabel,
        value: { valueInteger },
      },
    } = this.props;

    const editProps = {
      bsSize: 'sm',
      style: { textAlign: 'left' },
      type: 'number',
      label: headerLabel,
      value: this.state.valueInteger,
      onChange: ({ target: { value: val } }) => {
        const value = parseInt(val, 10);
        this.setState({ valueInteger: value });
        const { customAttr: { name, type, value: { valueInteger } } } = this.props;
        onChange(name, type, valueInteger, value);
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
        <span className="value-md">{valueInteger}</span>
      </div>
    );
  }
}


export default createFragmentContainer(IntegerAttr, {
  customAttr: graphql`
    fragment Integer_customAttr on CustomAttribute {
      type
      name
      value {
        ... on IntegerAttr {
          valueInteger
        }
      }
    }
  `,
});
