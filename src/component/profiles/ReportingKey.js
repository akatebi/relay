import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormControl } from 'react-bootstrap';

class ReportingKey extends Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    reportingKey: PropTypes.string,
    onChange: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { id, reportingKey, onChange } = this.props;
    const editProps = {
      componentClass: 'input',
      style: { textAlign: 'left' },
      type: 'text',
      value: reportingKey,
      onChange: (evt) => {
        onChange(evt.target.value, id);
      },
    };

    const { toggle } = this.state;

    return (
      <div>
        <div className="row">
          <div
            style={{ marginBottom: 2, marginTop: 0, fontSize: '0.75em' }}
            onClick={() => this.setState({ toggle: !toggle })}
            className={`fa fa-chevron-${toggle ? 'down' : 'right'} doc-no-link col-sm-4 col-sm-offset-1`}
          />
        </div>
        { toggle &&
        <div className="row" style={{ marginBottom: 2, marginTop: 0 }} >
          <div className="col-sm-3 col-sm-offset-1">
            <span
              className="property-label pull-right"
            >
              Reporting Key:
            </span>
          </div>
          <div>
            <div className="col-sm-6" style={{ paddingLeft: 0 }}>
              <form className="form-horizontal">
                <FormControl {...editProps} />
              </form>
            </div>
          </div>
        </div>
        }
      </div>
    );
  }
}

export default ReportingKey;
