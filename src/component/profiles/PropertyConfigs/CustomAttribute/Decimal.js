import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import React, { Component } from 'react';
import { FormControl } from 'react-bootstrap';

// const debug = require('debug')('app:component:profiles:Property:DecimalAttr');

class DecimalAttr extends Component {

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
    const { customAttr: { value: { valueDecimal } } } = this.props;
    this.setState({ valueDecimal });
  }

  render() {
    const {
      action,
      isEditable,
      onChange,
      customAttr: {
        name: headerLabel,
        value: { valueDecimal },
      },
    } = this.props;

    const editProps = {
      componentClass: 'input',
      style: { textAlign: 'left' },
      type: 'number',
      label: headerLabel,
      value: this.state.valueDecimal,
      onChange: ({ target: { value: val } }) => {
        const value = parseFloat(val);
        this.setState({ valueDecimal: value });
        const { customAttr: { name, type, value: { valueDecimal } } } = this.props;
        onChange(name, type, valueDecimal, value);
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
        <span className="value-md">{valueDecimal}</span>
      </div>
    );
  }
}


export default createFragmentContainer(DecimalAttr, {
  customAttr: graphql`
  fragment Decimal_customAttr on CustomAttribute {
    type
    name
    value {
      ... on DecimalAttr {
        valueDecimal
      }
    }
  }
  `,
});
