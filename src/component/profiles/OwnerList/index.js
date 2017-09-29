import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';
import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import qs from 'qs';
import StepZilla from 'react-stepzilla';
import SubHeader from '../SubHeader';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import labels from './data/changeOwnerLabels.json';
import { normalize } from '../normalize';

// const debug = require('debug')('app:component:profiles:OwnerList');

class OwnerList extends Component {

  static propTypes = {
    identity: PropTypes.object.isRequired,
    selfRolesLookup: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  state = {};

  componentWillMount() {
    const { identity: { identities } } = this.props;
    // debug('identities', window.pretty(identities));
    // filter out the Control Number
    // console.log('IDENTITIES!!', window.pretty(identities));
    const ownerList = identities.filter(owner => owner.relationshipType === 'DocRoleListContent');
    this.state = { showModal: false, identities: ownerList };
    this.labels = labels; // mocked labels for the Change Owner wizard
  }

  onChangeLocal = (newIdentities) => {
    const { identities } = this.state;
    const identitiesToUpdate = this.clone(identities);

    newIdentities.forEach((newOwner) => {
      // for each newowner, replace the original
      const index = identitiesToUpdate.findIndex(origOwner => origOwner.tail.id === newOwner.tail.id);
      if (index > -1) {
        identitiesToUpdate[index] = newOwner; // replace existing
        return identitiesToUpdate;
      }
      return false;
    });
    // console.log('$$$$ identitiesToUpdate', window.pretty(identitiesToUpdate));

    this.setState({ identities: identitiesToUpdate });
    this.updateViewData({ newIdentities: identitiesToUpdate });

    newIdentities.forEach((newOwner) => {
      const value = normalize(newOwner.tail.valueVM.valueVMRoleList);
      const { tail: { id, propertyType } } = newOwner;
      const index = identities.findIndex(origOwner => origOwner.tail.id === newOwner.tail.id);
      const { tail: { valueVM: { valueVMRoleList: origVal } } } = identities[index];
      const valueVM = normalize(origVal);
      this.props.onChange({ id, propertyType, value, valueVM });
    });
  };

  getOwnerTypes = () => {
    const { identity: { identities } } = this.props;
    const ownerList = identities.filter(owner => owner.tail.entityType === 'RoleListPropertyContent');
    const list = ownerList.map(owner => ({
      label: owner.tail.label,
      value: owner.tail.id,
    }));
    return list;
  };

  getViewData = () => this.viewStore;

  getLabel = key => this.labels.find(label => label.key === key).value;

  clone = obj => JSON.parse(JSON.stringify(obj));

  viewStore = {
    ownerTypes: this.getOwnerTypes(), // [ Author, Manager, Doc Type Admin, etc ]
    selectedOwnerType: '', // id of owner type
    currentOwners: [], // list of current owners prior to update
    selectedNewOwner: null, // new owner selected in step 2
    identities: [], // original ownerList
    newIdentities: [], // updated ownerList
  };

  closeModal = () => this.setState({ showModal: false });

  openModal = () => this.setState({ showModal: true });

  updateViewData = (update) => {
    this.viewStore = {
      ...this.viewStore,
      ...update,
    };
  };

  resetViewData = () => {
    this.viewStore = {
      ...this.viewStore,
      selectedNewOwner: null,
      newIdentities: [],
    };
  };

  render() {
    const { location: { search }, selfRolesLookup: { selfRoles } } = this.props;
    const { identities } = this.state;
    const { action = 'display' } = qs.parse(search, { ignoreQueryPrefix: true });
    // console.log('$$$ OWNER LIST', window.pretty(identities));

    // console.log('self roles', window.pretty(selfRoles));

    const ownerListRead = (identities.map((ownerProp, i) =>
      (<div className="row" key={i}>
        {ownerProp.tail.valueVM.valueVMRoleList.map((role, j) =>
          (<div key={j}>
            <div className="col-sm-3 property-label nopadding">
              {ownerProp.tail.label}
            </div>
            <div className="col-sm-7 property-value">
              {role.label}
            </div>
          </div>),
        )}
      </div>),
    ));

    const { ownerTypes } = this.getViewData();
    // console.log('#### OWNER TYPES', ownerTypes);
    const header = this.getLabel('_ChgOwn_OwnersHeader');

    const steps =
      [
        { name: `${this.getLabel('_ChgOwn_Step1Label')}`, //'Select Owner Type'
          component: <Step1
            getLabel={this.getLabel}
            getViewData={() => (this.getViewData())}
            updateViewData={u => this.updateViewData(u)}
            ownerTypes={ownerTypes}
          />,
        },
        { name: `${this.getLabel('_ChgOwn_Step2Label')}`, // 'Select New Owner'
          component: <Step2
            getLabel={this.getLabel}
            getViewData={() => (this.getViewData())}
            updateViewData={u => this.updateViewData(u)}
            ownerTypes={ownerTypes}
            identities={identities}
            allUsersLookup={selfRoles}
          />,
        },
        { name: `${this.getLabel('_ChgOwn_Step3Label')}`, // 'Confirm'
          component: <Step3
            identities={identities}
            getLabel={this.getLabel}
            getViewData={() => (this.getViewData())}
            updateViewData={u => this.updateViewData((u))}
            onChange={this.onChangeLocal}
            closeModal={this.closeModal}
            resetViewData={this.resetViewData}
          />,
        },
        { name: '', // note - Step4 is not used
          component: <Step4 getLabel={this.getLabel} />,
        },
      ];

    const showModalButton =
      (<div className="col-sm-12">
        <div style={{ marginTop: 6, marginBottom: 6 }}>
          <Button
            bsStyle="primary"
            bsSize="xsmall"
            onClick={this.openModal}
          >{header}</Button>
        </div>
      </div>);

    return (
      <div>
        <div>
          <SubHeader label="Responsibility" />
          {action === 'edit' && showModalButton }
          {ownerListRead}
        </div>

        <div>
          <Modal show={this.state.showModal} onHide={this.closeModal} enforceFocus>
            <Modal.Header closeButton>
              <Modal.Title>{header}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ paddingTop: 0, marginTop: 0, marginBottom: 48 }}>
              <div className="example">
                <div className="step-progress">
                  <StepZilla
                    showSteps
                    steps={steps}
                    preventEnterSubmission
                    nextTextOnFinalActionStep="Save"
                  />
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    );
  }
}

export default createFragmentContainer(OwnerList, {
  selfRolesLookup: graphql`
    fragment OwnerList_selfRolesLookup on SelfRolesLookup {
      selfRoles {
        label
        value
        cultureCode
        entityType
        familyId
        id
        isFamily
        operation
        reportingKey
      }
    }
  `,
  identity: graphql`
    fragment OwnerList_identity on Identity {
      identities {
        id
        operation
        relationshipType
        tail {
          id
          label
          entityType
          propertyType
          valueVM {
            ... on RoleListProp {
              valueVMRoleList {
                  id
                  cultureCode
                  entityType
                  familyId
                  isFamily
                  label
                  operation
                  reportingKey
                }
              }
          }
        }
      }
    }
  `,
});
