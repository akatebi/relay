import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import RCCheckbox from 'rc-checkbox';

// const debug = require('debug')('app:component:profiles:Property:BooleanProp');

class BooleanProp extends Component {

  static propTypes = {
    action: PropTypes.string.isRequired,
    isEditable: PropTypes.bool.isRequired,
    property: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { property: { defaultValue: { valueVMBoolean } } } = this.props;
    this.setState({ valueVMBoolean });
  }

  render() {
    const { action, isEditable, onChange } = this.props;
    const boolFun = checked => (checked ?
      <span className="glyphicon glyphicon-ok property-value" /> :
      <span className="glyphicon glyphicon-remove property-value" />);
    const editProps = checked => ({
      checked,
      onChange: ({ target: { checked: value } }) => {
        this.setState({ valueVMBoolean: value });
        const { property: { propertyType, defaultValue: { valueVMBoolean: defaultValue } } } = this.props;
        onChange(propertyType, defaultValue, value);
      },
    });

    if (action === 'edit' && isEditable) {
      return (
        <div>
          <RCCheckbox {...editProps(this.state.valueVMBoolean ? 1 : 0)} />
          &nbsp;{<span className="property-label">Default Value</span>}
        </div>
      );
    }
    return (
      <div>
        <span className="property-label">Default Value</span>
        <span className="value-md">{boolFun(this.state.valueVMBoolean)}</span>
      </div>
    );
  }
}


export default createFragmentContainer(BooleanProp, {
  property: graphql`
    fragment Boolean_property on PropertyConfig {
      propertyType
      defaultValue {
        ... on BooleanProp {
          valueVMBoolean
        }
      }
    }
  `,
});
