import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormControl } from 'react-bootstrap'; // FormGroup, Panel

class TextInput extends Component {

  static propTypes = {
    action: PropTypes.string.isRequired,
    isEditable: PropTypes.bool.isRequired,
    hide: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
  };

  static defaultProps = {
    hide: false,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.setOrigValue();
  }

  componentWillReceiveProps({ action }) {
    const { action: oldAction, isEditable } = this.props;
    if (oldAction !== action) {
      if (oldAction === 'edit' && isEditable) {
        this.setOrigValue();
      }
    }
  }

  setOrigValue = () => {
    const { value } = this.props;
    const origValue = value || '';
    this.setState({ value: origValue, origValue });
  }

  render() {
    const { action, isEditable, name, hide } = this.props;
    const editProps = (type, value, label) => ({
      bsSize: 'sm',
      style: { textAlign: 'left' },
      label,
      type,
      value,
      onChange: ({ target: { value } }) => {
        this.setState({ value });
        this.props.onChange(this.state.origValue, value);
      },
    });

    if (hide) return false;

    if (action === 'edit' && isEditable) {
      return (
        <span>
          {name && <span className="property-label">{name}</span>}
          <span><FormControl {...editProps('text', this.state.value, name)} /></span>
        </span>
      );
    }
    return (
      <div>
        <span className="property-label">{name}</span>
        <span className="value-md">{this.state.value}</span>
      </div>
    );
  }
}

export default TextInput;
