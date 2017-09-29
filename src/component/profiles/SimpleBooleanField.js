import PropTypes from 'prop-types';
import React, { Component } from 'react';

// const debug = require('debug')('app:component:profiles:Property:SimpleBooleanField');

class SimpleBooleanField extends Component {

  static propTypes = {
    action: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { value } = this.props;
    this.setState({ value });
  }

  render() {
    const {
      action,
      onChange,
      value,
      label,
    } = this.props;

    const editMode = action === 'edit';

    const glyphicon = value ? 'glyphicon glyphicon-ok' : 'glyphicon glyphicon-remove';

    const editProps = {
      type: 'checkbox',
      checked: this.state.value,
      onChange: ({ target: { checked: value } }) => {
        this.setState({ value });
        const { value: origValue } = this.props;
        onChange({ origValue, value });
      },
    };

    return (
      <div className="row" style={{ marginBottom: 5, marginTop: 5 }} >
        <div className="col-sm-3 property-label">{label}</div>

        {editMode ?
          <div className="col-sm-4 leftpadding">
            <form className="form-horizontal">
              <input {...editProps} />
            </form>
          </div> :
          <div className="col-sm-4 leftpadding">
            <span className={`${glyphicon} property-value`} />
          </div>
        }
      </div>
    );
  }
}

export default SimpleBooleanField;
