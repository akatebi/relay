import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormControl } from 'react-bootstrap';

// const debug = require('debug')('component:profiles:SimpleTextField');

class SimpleTextField extends Component {

  static propTypes = {
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    // isRequired: PropTypes.bool.isRequired,
    classNameOverride: PropTypes.string,
    // isTextArea: PropTypes.bool,
    action: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { value } = this.props;
    this.setState({ value: value || '' });
  }

  render() {

    const {
      action,
      onChange,
      classNameOverride,
      label,
      value,
    } = this.props;

    const className = classNameOverride || 'property-value-md';

    const editMode = action === 'edit';

    const editProps = {
      bsSize: 'sm',
      style: { textAlign: 'left' },
      type: 'text',
      componentClass: this.state.isTextArea && 'textarea',
      value: this.state.value,
      onChange: ({ target: { value } }) => {
        this.setState({ value });
        onChange(value, this.props.value || '');
      },
    };

    return (
      <div className="row" style={{ marginBottom: 5, marginTop: 5 }} >
        <div className="col-sm-3 property-label">{label}</div>

        <span className={className}>
          {editMode ?
            <div className="col-sm-8 leftpadding">
              <form className="form-horizontal">
                <FormControl {...editProps} />
              </form>
            </div> :
            <div className="col-sm-8 leftpadding">
              <span className={className}>{value}</span>
            </div>
          }
        </span>
      </div>
    );
  }
}

export default SimpleTextField;
