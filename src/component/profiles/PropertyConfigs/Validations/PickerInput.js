import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Select from 'react-select';

class PickerInput extends Component {

  static propTypes = {
    action: PropTypes.string.isRequired,
    isEditable: PropTypes.bool.isRequired,
    headerLabel: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      }),
    ).isRequired,
    placeholder: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const value = this.getValue();
    this.setState({ value });
  }

  componentWillReceiveProps({ action, isEditable }) {
    const { action: oldAction } = this.props;
    if (oldAction !== action) {
      if (oldAction === 'edit' && isEditable) {
        const value = this.getValue();
        this.setState({ value });
      }
    }
  }

  getValue = () => {
    const { options, type } = this.props;
    const value = options.find(({ label }) => type === label);
    return value;
  }

  render() {
    const { action, isEditable, headerLabel, placeholder, options } = this.props;
    const pickerOptions = ({
      multi: false,
      autoBlur: true,
      options,
      placeholder,
      value: this.state.value,
      onChange: (value) => {
        this.setState({ value });
        this.props.onChange(this.getValue().label, value.label);
      },
    });
    if (action === 'edit' && isEditable) {
      return (
        <div>
          <span className="property-label">{headerLabel}</span>
          <Select {...pickerOptions} />
        </div>
      );
    }
    return (
      <div>
        <span className="property-label">{headerLabel}</span>
        <span className="value-md">{this.state.value.label}</span>
      </div>
    );
  }
}

export default PickerInput;
