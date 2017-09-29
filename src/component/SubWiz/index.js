import PropTypes from 'prop-types';
import React, { Component } from 'react';
import qs from 'qs';
import { Modal } from 'react-bootstrap';
import { Route } from 'react-router-dom';
import AppCycle from '../base/SubWiz/AppCycle';
import AppSegments from '../base/SubWiz/AppSegments';
import labels from './subwizLabels.json';

const debug = require('debug')('app:component:SubWiz');

class SubmitWizard extends Component {

  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    // match: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    // const showModal = true;
    const selectedCycle = null; // obj for the Approval Cycle that was selected
    const selectedCycleId = ''; // id for the Approval Cycle that was selected
    const selectedCycleLabel = ''; // label for the Approval Cycle that was selected
    this.state = { /*showModal, */selectedCycle, selectedCycleId, selectedCycleLabel };
  }

  getHeader = () => {
    const { location: { search } } = this.props;
    const { processType } = qs.parse(search, { ignoreQueryPrefix: true });
    const submitFor = this.getLabel('_SubWiz_SubmitFor');
    let processTypeLabel;
    if (processType === 'review') {
      processTypeLabel = this.getLabel('_SubWiz_Review');
    } else if (processType === 'approval') {
      processTypeLabel = this.getLabel('_SubWiz_Approval');
    } else {
      processTypeLabel = '??';
    }
    return `${submitFor}${processTypeLabel}`;
  };

  getLabel = key => labels.find(label => label.key === key).value;


  updateViewData = ({ selectedCycleId, selectedCycleLabel }) => {
    this.setState({ selectedCycleId, selectedCycleLabel });
    this.refetch(selectedCycleId);
  };

  closeModal = () => {
    const { history, location: { pathname } } = this.props;
    debug('history', history);
    history.replace(pathname);
  }

  render() {
    const {
      location: { search },
    } = this.props;

    const { processType, selectedCycleId } = qs.parse(search, { ignoreQueryPrefix: true });

    if (!processType) return false;

    debug('processType', processType);
    debug('selectedCycleId', selectedCycleId);

    return (
      <Modal bsSize="lg" show={!!processType} onHide={this.closeModal} enforceFocus>
        <Modal.Header closeButton>
          <Modal.Title>{this.getHeader()}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ paddingTop: 0, marginTop: 0, marginBottom: 48 }}>
          <div>
            <div className="example">
              <div className="step-progress">
                {!selectedCycleId &&
                  <Route
                    exact
                    render={props => <AppCycle {...props} />}
                  />}
                {selectedCycleId &&
                  <Route
                    exact
                    render={props => <AppSegments params={{ selectedCycleId }} {...props} />}
                  />}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

export default SubmitWizard;
