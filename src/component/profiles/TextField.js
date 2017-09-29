import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormControl, OverlayTrigger, Tooltip } from 'react-bootstrap';

// const debug = require('debug')('app:component:profiles:TextField');

class TextField extends Component {

  static propTypes = {
    field: PropTypes.object.isRequired,
    classNameOverride: PropTypes.string,
    isTextArea: PropTypes.bool,
    maxLength: PropTypes.number,
    action: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  state = {};

  componentWillMount() {
    const { field: { value }, isTextArea } = this.props;
    this.setState({ value, isTextArea });
  }

  checkLength = (val) => {
    const { maxLength } = this.props;
    return !(val.length > maxLength);
  }

  render() {
    const {
      action,
      onChange,
      classNameOverride,
      field: { label, value, id, isRequired },
    } = this.props;
    const className = classNameOverride || 'property-value';
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
      // debug('filterKeys', e.key);
      // only allow printable characters
      const isPrintableChar = e.key.length === 1;
      const noModifier = !e.ctrlKey && !e.metaKey && !e.altKey;
      if (!isPrintableChar || !noModifier) {
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
        if (this.checkLength(value)) {
          this.setState({ value });
          // onChange(this.props.field.value || '', value);
          onChange(value || '', value);
        }
      },
    };

    return (
      <div className="row" >
        <span className="property-label-color col-sm-2" style={{ marginTop: 6, marginLeft: 0 }} >
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

export default TextField;
