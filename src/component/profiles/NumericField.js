import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormControl, OverlayTrigger, Tooltip } from 'react-bootstrap';

// const debug = require('debug')('component:profiles:NumericField');

class NumericField extends Component {

  static propTypes = {
    field: PropTypes.object.isRequired,
    classNameOverride: PropTypes.string,
    isTextArea: PropTypes.bool,
    action: PropTypes.string.isRequired,
    maxValue: PropTypes.number,
    minValue: PropTypes.number,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { field: { value }, isTextArea } = this.props;
    this.setState({ value, isTextArea });
    // console.log('CWM', window.pretty(this.props));
  }

  render() {

    const {
      action,
      onChange,
      classNameOverride,
      minValue,
      maxValue,
      field: { label, value, id, isRequired },
    } = this.props;

    const className = classNameOverride || 'property-value-md';

    const editMode = action === 'edit';

    const requiredIcon = (
      <span>
        {isRequired &&
        <span>
          <span>&nbsp;&nbsp;&nbsp;</span>
          <OverlayTrigger
            placement="top"
            overlay={id ? <Tooltip id={id}>(required)</Tooltip> : <Tooltip />}
          >
            <span className="glyphicon glyphicon-star required-icon" style={{ marginTop: 12 }} />
          </OverlayTrigger>
        </span>}
      </span>
    );

    const filterKeys = (e) => {
      // only allow integers
      const re = /[0-9]+/g;
      // console.log('$$$$$$ filterKeys >> e.key', e.key);
      if (!re.test(e.key)) {
        e.preventDefault();
      }
    };

    const editProps = {
      bsSize: 'sm',
      style: { textAlign: 'left' },
      type: 'text',
      componentClass: this.state.isTextArea && 'textarea',
      value: this.state.value || '',
      onChange: ({ target: { value } }) => {
        // console.log('$$$$$$ onChange >> value', value);
        if (value < minValue || value > maxValue) {
          // console.log('$$$$$$ onChange >> error out of range', minValue, ' to ', maxValue);
        } else {
          this.setState({ value });
          onChange(this.props.field.value || '', value);
        }
      },
    };

    return (
      <div className="row" >
        <span className="property-label-color col-sm-4" style={{ marginTop: 6 }} >
          {`${label}: `}
        </span>

        <span className={className} >
          {editMode ?
            <span>
              <span className="col-sm-8">
                <form className="form-horizontal">
                  <FormControl
                    {...editProps}
                    onKeyPress={e => filterKeys(e)}
                  />
                </form>
              </span>
              {requiredIcon}
            </span> :
            <span className={className}>{value}</span>
          }
        </span>
      </div>
    );
  }
}


export default NumericField;
