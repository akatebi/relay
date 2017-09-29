import moment from 'moment';
import qs from 'qs';
import { successAlert, errorAlert, infoAlert } from '../../service/alert';
import apiFetch from '../../service/apiFetch';
import { propertySaveMutation } from './mutation/propertySave';
import { pageSaveMutation } from '../profiles/mutation/pageSave';
import { mapArchiveData } from '../../service/profile/subWizMaps';
import { makeCopyProfileMutation } from './mutation/makeCopyProfile';
import { modifyProfileMutation } from './mutation/modifyProfile';
import { lockProfileMutation } from './mutation/lockProfile';
import { unlockProfileMutation } from './mutation/unlockProfile';
import { processActionMutation } from './mutation/processAction';
import { Recorder } from './Recorder';

const debug = require('debug')('app:component:Toolbar:Save');

export class Save extends Recorder {

  constructor(toolbar, props) {
    super();
    this.toolbar = toolbar;
    this.props = props;
  }

  commit = () => {
    if (this.mutationInputDirty()) {
      this.commitDirty();
    } else {
      this.commitNew();
    }
  }

  commitDirty = () => {
    debug('commitDirty', this.mutationInput);
    this.toolbar.setState({ mutating: true });
    const { variables: { path } } = this.props;
    propertySaveMutation(
      this.props.relay.environment,
      { ...this.mutationInput, paths: { path } },
      (response) => {
        debug('onCompleted', response);
        successAlert('Saved!!!');
        this.toolbar.setState({ mutating: false });
      },
      (error) => {
        debug('onError', error);
        errorAlert(error.message);
        this.toolbar.setState({ mutating: false });
      },
    );
    this.mutationInputReset();
  }

  commitNew = () => {
    const {
      identity: { standardProperties },
      params: { docId },
      variables: { path },
      relay: { environment },
    } = this.props;
    const entityState = standardProperties.find(({ name }) => name === 'Rev_State') || {};
    this.unlock();
    if (entityState.valueVM === 'New') {
      this.toolbar.setState({ mutating: true });
      pageSaveMutation(environment, { path, docId, standardProperties },
        (response) => {
          debug('onCompleted', response);
          successAlert('Saved!!!');
          this.toolbar.setState({ mutating: false });
        },
        (error) => {
          debug('onError', error);
          errorAlert(error.message);
          this.toolbar.setState({ mutating: false });
        },
      );
    }
  }

  lock = () => {
    const { lockStatus: { id }, variables: { path }, relay: { environment } } = this.props;
    debug('lockId', id);
    this.toolbar.setState({ mutating: true });
    lockProfileMutation(
      environment,
      { id, path },
      (response) => {
        // debug('onComplete', window.pretty(response.lockProfileMutation));
        this.toolbar.setAction('edit');
        const { lockStatus: { isLocked, lockedBy } } = response.lockProfileMutation;
        if (isLocked) {
          const msg = (lockedBy.label) ?
            `${lockedBy.label} has locked the revision for editing` :
            'The revision is ready for editing';
          successAlert(msg);
        }
        this.toolbar.setState({ mutating: false });
      },
      (error) => {
        debug('lock onError', error);
        this.toolbar.setState({ mutating: false });
        errorAlert(error.message);
      },
    );
  }

  unlock = () => {
    if (!this.props.lockStatus.isLocked) return;
    const { lockStatus: { id }, variables: { path }, relay: { environment } } = this.props;
    this.toolbar.setState({ mutating: true });
    unlockProfileMutation(
      environment,
      { id, path },
      (response) => {
        debug('onComplete', response);
        this.toolbar.setAction('display');
        this.toolbar.setState({ mutating: false });
        infoAlert('Document unlocked');
      },
      (error) => {
        debug('unlock onError', error);
        this.toolbar.setState({ mutating: false });
        errorAlert(error.message);
      },
    );
  }

  makeCopy = () => {
    const { history, params: { docId: id }, relay: { environment } } = this.props;
    const path = location.pathname.split(id)[0];
    this.toolbar.setState({ mutating: true });
    makeCopyProfileMutation(
      environment,
      { path, id },
      (response) => {
        debug('makeCopy response', response);
        const { makeCopyProfileMutation: { id: makeCopyId } } = response;
        successAlert('New copy created');
        const pathname = `${this.getPath(id, makeCopyId)}/identity`;
        const search = qs.stringify({ action: 'edit' });
        history.push({ pathname, search });
        this.toolbar.setState({ mutating: false });
      },
      (error) => {
        debug(error);
        errorAlert(error.message);
        this.toolbar.setState({ mutating: false });
      },
    );
  }

  modify = () => {
    const { history, params: { docId: id }, relay: { environment } } = this.props;
    const path = location.pathname.split(id)[0];
    debug('Toolbar modify path', path, id);
    this.toolbar.setState({ mutating: true });
    modifyProfileMutation(
      environment,
      { path, id },
      (response) => {
        debug('response', response);
        const { modifyProfileMutation: { id: modifyId } } = response;
        successAlert('New revision created');
        const pathname = `${this.getPath(id, modifyId)}/identity`;
        const search = qs.stringify({ action: 'edit' });
        history.push({ pathname, search });
        this.toolbar.setState({ mutating: false });
      },
      (error) => {
        debug(error);
        errorAlert(error.message);
        this.toolbar.setState({ mutating: false });
      },
    );
  }

  getPath = (id, modifyId) => {
    debug('id', id);
    debug('modifyId', modifyId);
    const { location: { pathname } } = this.props;
    const prefix = pathname.split(`/${id}`)[0];
    const path = `${prefix}/${modifyId}`;
    debug('path', path);
    return path;
  }

  processApprove = (id) => {
    const action = 'approve';
    const { variables: { docId, path } } = this.props;
    this.processAction({ action, docId, id, path });
  };

  processReject = (id) => {
    const action = 'reject';
    const { variables: { docId, path } } = this.props;
    this.processAction({ action, docId, id, path });
  };

  processTerminate = () => {
    const action = 'terminate';
    const {
      variables: { docId, path },
      identity: { lifeCycle: { id } },
    } = this.props;
    this.processAction({ action, docId, id, path });
  }

  processClear = () => {
    const action = 'cancel';
    const {
      variables: { docId, path },
      identity: { lifeCycle: { id } },
    } = this.props;
    this.processAction({ action, docId, id, path });
  }

  processAction = ({ action, docId, id, path }) => {
    debug('processAction', action, docId, id, path);
    this.toolbar.setState({ mutating: true });
    processActionMutation(this.props.relay.environment,
      { action, docId, id, path },
      (resp) => {
        // debug('processAction', window.pretty(resp));
        const now = moment().format('lll');
        if (resp.processActionMutation && resp.processActionMutation.approvalCycleToolbar) {
          successAlert(`Success at ${now}`);
        } else {
          errorAlert(`Failed at ${now}`);
        }
        this.toolbar.setState({ mutating: false });
        // this.redirectToIdentity();
      },
      (error) => {
        debug('error', error);
        errorAlert(error.message);
        this.toolbar.setState({ mutating: false });
      },
    );
  };

  redirectToIdentity = (url) => {
    debug('redirectToIdentity', url);
    const arr = url.split('/');
    const pathname = `/${arr.join('/')}/identity`;
    debug('onSubmit str', pathname, `${arr.splice(arr.length - 1, 1)}`);
    const { history, location: { search } } = this.props;
    history.push({ pathname, search });
  }

  redirect = (eventKey, evt) => {
    evt.preventDefault();
    const mapKeyToRoute = {
      btn_submit_review: 'processType=review',
      btn_submit_approval: 'processType=approval',
    };
    const { history } = this.props;
    const { location: { pathname } } = this.props;
    const search = mapKeyToRoute[eventKey];
    debug('pathname', pathname);
    debug('search', search);
    history.push({ pathname, search });
  }

  // Convert to Relay Mutation
  processArchive = () => {
    const { identity: { lifeCycle }, params: { docId } } = this.props;
    // debug('#### onArchive lifeCycle', window.pretty(lifeCycle));

    const archiveData = mapArchiveData(lifeCycle);
    // debug('#### onArchive archiveData', window.pretty(archiveData));

    const { pathname } = location;
    let url = `${pathname.split(docId)[0]}${docId}/promote`;
    url = url.slice(1);
    // debug('#### onArchive url2', url, docId);

    const options = {
      method: 'POST',
      body: JSON.stringify(archiveData),
    };
    return apiFetch(url, options)
      .then(resp => resp.json())
      .then((result) => {
        if (result) {
          debug('****** Archived');
          const now = moment().format('lll');
          const msg = `Archived at ${now}`;
          successAlert(msg);
          // *** refetched Identity - TODO
          // this.props.onClearApprovers(); - TODO
          this.redirectToIdentity(url);
        } else {
          debug('****** NOT archived');
          const now = moment().format('lll');
          const msg = `Archive failed at ${now}`;
          errorAlert(msg);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

}
