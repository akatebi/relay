import PropTypes from 'prop-types';
import React, { Component } from 'react';

class Scrollbar extends Component {

  static propTypes = {
    children: PropTypes.element.isRequired,
    // className: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.onHandleResize = this.onHandleResize.bind(this);
    this.state = { height: window.innerHeight - 150 };
  }

  componentDidMount() {
    window.addEventListener('resize', this.onHandleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onHandleResize);
  }

  onHandleResize() {
    this.setState({ height: window.innerHeight - 150 });
  }

  render() {

    const style = {
      overflowX: 'hidden',
      overflowY: 'auto',
      height: this.state.height,
    };

    return (
      <div style={style}>
        {this.props.children}
      </div>
    );
  }
}

export default Scrollbar;
