import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import React, { Component } from 'react';
import RCCheckbox from 'rc-checkbox';

// const debug = require('debug')('app:component:profiles:Property:BooleanProp');

class BooleanProp extends Component {

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
    const { customAttr: { value: { valueBoolean } } } = this.props;
    this.setState({ valueBoolean });
  }

  render() {
    const { action, isEditable, onChange, customAttr: { name } } = this.props;
    const boolFun = checked => (checked ?
      <span className="glyphicon glyphicon-ok property-value" /> :
      <span className="glyphicon glyphicon-remove property-value" />);
    const editProps = (checked, name) => ({
      name,
      checked,
      onChange: ({ target: { checked: value } }) => {
        this.setState({ valueBoolean: value });
        const { customAttr: { name, type, value: { valueBoolean } } } = this.props;
        onChange(name, type, valueBoolean, value);
      },
    });

    if (action === 'edit' && isEditable) {
      return (
        <div>
          <RCCheckbox {...editProps(this.state.valueBoolean ? 1 : 0, name)} />
          &nbsp;{name && <span className="property-label">{name}</span>}
        </div>
      );
    }
    return (
      <div>
        <span className="property-label">{name}</span>
        <span className="value-md">{boolFun(this.state.valueBoolean)}</span>
      </div>
    );
  }
}

export default createFragmentContainer(BooleanProp, {
  customAttr: graphql`
    fragment Boolean_customAttr on CustomAttribute {
      type
      name
      value {
        ... on BooleanAttr {
          valueBoolean
        }
      }
    }
  `,
});
