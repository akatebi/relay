import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';

class Confirm extends Component {

  static propTypes = {
    router: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps({ location: { state: { dirty } } }) {
    const { location: { state: { dirty: old } } } = this.props;
    if (dirty !== old && dirty) {
      this.setState({ show: true });
    }
  }

  onNo = () => {
    // const { router, location: { pathname, query, state } } = this.props;
    // router.push({ pathname, query, state });
    this.setState({ show: false });
  }

  onYes = () => {
    const { router, state: { location: { pathname, query } } = {} } = this.props;
    router.push({ pathname, query, state: { confirmed: true } });
  }

  render() {
    const { show } = this.state;
    return (
      <div className="static-modal">
        <Modal bsSize="small" show={show} >
          <Modal.Header>
            <Modal.Title>You have unsaved changes</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Abandon changes?
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.onNo}>No</Button>
            <Button onClick={this.onYes} bsStyle="primary">Yes</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Confirm;
