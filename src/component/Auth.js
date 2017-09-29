import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import Loader from 'react-loader';
import { Button, FormGroup, FormControl, ControlLabel, Modal } from 'react-bootstrap';

import { signInMutation } from './mutation/signIn';
import { signOutMutation } from './mutation/signOut';
import { signInTokenKey } from '../constant/app';

const debug = require('debug')('app:Auth');

class Auth extends Component {

  static propTypes = {
    location: PropTypes.object.isRequired,
    relay: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    viewer: PropTypes.object,
  };

  state = {};

  componentWillMount() {
    const {
      location: { pathname },
      viewer,
    } = this.props;
    if (pathname === '/signout') {
      this.signOut();
    } else if (pathname === '/signin') {
      if (!viewer) {
        this.setState({ showModal: true });
      }
    }
  }

  onRequestToken(type, evt) {
    evt.preventDefault();
    switch (type) {
      case 'username':
        this.setState({ username: evt.target.value });
        break;
      case 'password':
        this.setState({ password: evt.target.value });
        break;
      case 'submit':
      {
        const onCompleted = (response) => {
          debug('Mutation completed!', response);
          const { signInMutation: { viewer: { userIdentity: { token } } } } = response;
          const { history, location: { state } = {} } = this.props;
          this.setState({ fetching: false });
          this.setLocalStorage(token);
          this.setState({ showModal: false });
          if (state && state.from) {
            history.replace(state.from);
          } else {
            this.props.history.replace('/');
          }
        };
        const onError = (error) => {
          debug('Mutation error', error);
          this.setState({ fetching: false });
        };
        const { username, password } = this.state;
        this.setState({ fetching: true });
        signInMutation(
          this.props.relay.environment,
          { username, password },
          onCompleted,
          onError,
        );
        break;
      }
      default:
        break;
    }
  }

  onHideModal = () => {
    this.signOut();
    this.props.history.goBack();
  }

  setLocalStorage = (token) => {
    if (token) {
      debug('Save Token LocalStorage', `${token.slice(0, 26)}....`);
      localStorage.setItem(signInTokenKey, token);
    } else {
      debug('Remove Token LocalStorage');
      localStorage.removeItem(signInTokenKey);
    }
  };

  signOut = () => {
    debug('SIGN OUT');
    this.setLocalStorage();
    const onCompleted = () => this.props.history.replace('/');
    signOutMutation(
      this.props.relay.environment,
      onCompleted,
    );
  }

  render() {
    const { showModal, fetching } = this.state;
    const { error } = this.props.viewer || {};
    return (
      <div>
        <Modal bsSize="small" show={showModal} onHide={this.onHideModal}>
          <Loader color="grey" loaded={!fetching} />
          <Modal.Header closeButton>
            <Modal.Title className="text-danger">
              {error || '\xa0'}
            </Modal.Title>
          </Modal.Header>
          <form onSubmit={this.onRequestToken.bind(this, 'submit')}>
            <Modal.Body>
              <FormGroup>
                <ControlLabel>Username</ControlLabel>
                <FormControl
                  type="text"
                  autoFocus
                  onChange={this.onRequestToken.bind(this, 'username')}
                  placeholder="Enter username"
                  required
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Password</ControlLabel>
                <FormControl
                  type="password"
                  onChange={this.onRequestToken.bind(this, 'password')}
                  placeholder="Enter password"
                  required
                />
              </FormGroup>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.onHideModal}>Cancel</Button>
              <Button type="submit" bsStyle="primary">Sign In</Button>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
    );
  }
}

export default createFragmentContainer(Auth, {
  viewer: graphql`
    fragment Auth_viewer on Viewer {
      error
      userIdentity {
        token
        user {
          id
          label
          entityType
        }
        organization {
          id
          label
          entityType
        }
      }
    }
  `,
});
