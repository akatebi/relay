import PropTypes from 'prop-types';
import React, { Component } from 'react';
import RCCheckbox from 'rc-checkbox';

class Checkbox extends Component {

  static propTypes = {
    action: PropTypes.string.isRequired,
    isEditable: PropTypes.bool.isRequired,
    checked: PropTypes.bool.isRequired,
    hide: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
  };

  static defaultProps = {
    hide: false,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { checked } = this.props;
    this.setState({ checked });
  }

  render() {
    const { action, isEditable, name, hide } = this.props;
    const boolFun = checked => (checked ?
      <span className="glyphicon glyphicon-ok property-value" /> :
      <span className="glyphicon glyphicon-remove property-value" />);
    const editProps = (checked, name) => ({
      name,
      checked,
      onChange: ({ target: { checked } }) => {
        this.setState({ checked });
        this.props.onChange(this.props.checked, checked);
      },
    });

    if (hide) return false;

    if (action === 'edit' && isEditable) {
      return (
        <div>
          <RCCheckbox {...editProps(this.state.checked ? 1 : 0, name)} />
          &nbsp;{name && <span className="property-label">{name}</span>}
        </div>
      );
    }
    return (
      <div>
        <span className="property-label">{name}</span>
        <span className="value-md">{boolFun(this.state.checked)}</span>
      </div>
    );
  }
}

export default Checkbox;
