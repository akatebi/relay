import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';
import React, { Component } from 'react';
import { lockProfileMutation } from '../Toolbar/mutation/lockProfile';
import { infoAlert, errorAlert } from '../../service/alert';

const debug = require('debug')('app:component:profiles:Lock');

class Lock extends Component {
  static propTypes = {
    lockStatus: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired,
    relay: PropTypes.object.isRequired,
  };

  state = {};

  getLockStatus = (evt) => {
    evt.preventDefault();
    // const { lockStatus: { lockedBy, isLocked } } = this.props;
    const { path } = this.props;
    lockProfileMutation(
      this.props.relay.environment,
      { path, method: 'get' },
      (resp) => {
        debug('resp', resp);
        const { lockProfileMutation: { lockStatus: { isLocked, lockedBy, timeLocked } } } = resp;
        const msg = isLocked ? `Locked by ${lockedBy.label}` : 'Not Locked';
        if (isLocked) infoAlert(msg, timeLocked);
        else infoAlert(msg);
      },
      (error) => {
        debug('error', error);
        errorAlert(error.message);
      },
    );
  }

  render() {
    const { isLocked } = this.props.lockStatus;
    // debug('isLocked', isLocked);
    return isLocked ? (
      <span
        className="fa fa-lock link"
        aria-hidden="true"
        style={{ fontSize: '1.5em' }}
        onClick={this.getLockStatus}
      />
    ) : (
      <span
        className="fa fa-unlock link"
        aria-hidden="true"
        style={{ fontSize: '1.5em' }}
        onClick={this.getLockStatus}
      />
    );
  }
}

export default createFragmentContainer(Lock, {
  lockStatus: graphql`
    fragment Lock_lockStatus on LockStatus {
      id
      isLocked
      lockedBy {
        id
        label
        revId
      }
      timeLocked
      msg
    }
  `,
});
