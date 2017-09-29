import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import moment from 'moment';
import { Panel } from 'react-bootstrap';
import qs from 'qs';
import Associations from './Associations';
import Customs from './Customs';
import EntityLink from '../entities/EntityLink';
import Lock from './Lock';
import OwnerList from './OwnerList';
import TextField from './TextField';
import Title from './Title';

// const debug = require('debug')('app:component:profiles:Identity');

class Identity extends Component {

  static propTypes = {
    associations: PropTypes.object.isRequired,
    controlNumberSequence: PropTypes.object,
    identity: PropTypes.shape({
      organization: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
      documentType: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
      documentClass: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
      formHeader: PropTypes.string,
      standardProperties: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
          valueVM: PropTypes.string.isRequired,
        }),
      ).isRequired,
      // identities: PropTypes.arrayOf(
      //   PropTypes.shape({
      //     tail: PropTypes.shape({
      //       propertyType: PropTypes.string.isRequired,
      //       valueVM: PropTypes.shape({
      //         valueVMControlNumber: PropTypes.shape({
      //           controlNumberString: PropTypes.string.isRequired,
      //           draftVersion: PropTypes.string.isRequired,
      //           version: PropTypes.string.isRequired,
      //           sequenceType: PropTypes.string.isRequired,
      //         }).isRequired,
      //       }).isRequired,
      //     }).isRequired,
      //   }),
      // ),
      id: PropTypes.string.isRequired,
      reportingKey: PropTypes.string,
      entityType: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }).isRequired,
    lockStatus: PropTypes.object.isRequired,
    selfRolesLookup: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    valueVMOptions: PropTypes.object.isRequired,
    valueVMTypeOptions: PropTypes.object.isRequired,
  }

  static contextTypes = {
    onChangeContent: PropTypes.func.isRequired,
    onChangeConfig: PropTypes.func.isRequired,
    onChangeField: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = { showControlNumberModal: false };
  }

  getPath = () => {
    const { location: { pathname } } = this.props;
    const string = /\/identity/.test(pathname) ? '/identity' : '/all';
    const path = pathname.replace(string, '');
    return path;
  }

  closeControlNumberModal = () => this.setState({ showControlNumberModal: false });

  openControlNumberModal = () => this.setState({ showControlNumberModal: true });

  render() {
    const {
      controlNumberSequence,
      identity,
      selfRolesLookup,
      lockStatus,
      associations,
      location: { search },
      valueVMOptions,
      valueVMTypeOptions,
    } = this.props;


    const {
      onChangeContent,
      onChangeField,
    } = this.context;

    const { action = 'display' } = qs.parse(search, { ignoreQueryPrefix: true });

    // const editMode = action === 'edit';

    const {
      id,
      entityType,
      formHeader,
      reportingKey,
      documentType,
      documentClass,
      organization,
      standardProperties,
    } = identity;

    const created = standardProperties.find(({ name }) => name === 'Rev_Utc_Created') || {};
    const lastSaved = standardProperties.find(({ name }) => name === 'Rev_Utc_LastSaved') || {};
    const fullState = standardProperties.find(({ name }) => name === 'Rev_FullStatus') || {};
    const entityState = standardProperties.find(({ name }) => name === 'Rev_State') || {};
    const textFieldProps = (action, field, classNameOverride, isTextArea) => ({
      action,
      field,
      classNameOverride,
      isTextArea,
      onChange: onChangeField.bind(this, id, field.prop),
    });

    const typeLabel = () => (entityType === 'DocumentType' ? 'Super Type' : 'Type');

    const classPanel = (
      <div>
        <div className="row">
          {(entityType !== 'DocumentClass') && (
            <div>
              <div className="col-sm-3 nopadding" style={{ marginTop: 4 }}>
                <div className="property-label">{typeLabel()}</div>
              </div>
              <div className="col-sm-9 leftpadding">
                <EntityLink
                  entityVM={documentType}
                  classOverride="doc-md-link"
                  location={location}
                />
              </div>
            </div>
          )}
        </div>
        <div className="row">
          <div className="col-sm-3 nopadding" style={{ marginTop: 4 }}>
            <div className="property-label">Class</div>
          </div>
          <div className="col-sm-9 leftpadding">
            <EntityLink
              entityVM={documentClass}
              location={location}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-3 nopadding" style={{ marginTop: 4 }}>
            <div className="property-label">Organization</div>
          </div>
          <div className="col-sm-9 leftpadding">
            <EntityLink
              entityVM={organization}
              location={location}
            />
          </div>
        </div>
      </div>
    );

    const statusPanel = (
      <div>
        <div className="row">
          <div className="col-sm-3 nopadding" style={{ marginTop: 4 }}>
            <div className="property-label">Status</div>
          </div>
          <div className="col-sm-9 leftpadding">
            <span
              className="property-value-md"
              style={{ fontWeight: 'bold' }}
            >{fullState.valueVM}
            </span>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-3 nopadding" style={{ marginTop: 4 }}>
            <div className="property-label">Created</div>
          </div>
          <div className="col-sm-9 leftpadding">
            <span className="property-value">
              {moment(created.valueVM).format('lll')}
            </span>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-3 nopadding" style={{ marginTop: 4 }}>
            <div className="property-label">Last Saved</div>
          </div>
          <div className="col-sm-9 leftpadding">
            <span className="property-value">{moment(lastSaved.valueVM).format('lll')}</span>
          </div>
        </div>
      </div>
    );

    return (
      <div>
        <div className="row" style={{ marginBottom: 6, marginTop: 6 }}>
          <div className="col-sm-11 nopadding">
            <Title
              action={action}
              controlNumberSequence={controlNumberSequence}
              identity={identity}
              // onChange={onChangeField.bind(this, id, field.prop)}
              status={entityState.valueVM}
            />
          </div>
          <div className="col-sm-1 nopadding">
            <span className="pull-right">
              <Lock lockStatus={lockStatus} path={this.getPath()} />
            </span>
          </div>
        </div>

        <Panel className="idHeader">
          <div className="row" style={{ marginBottom: 6, marginTop: 6 }}>
            <div className="col-sm-7 nopadding">
              {classPanel}
            </div>

            <div className="col-sm-5 nopadding">
              {statusPanel}
            </div>
          </div>
        </Panel>

        <div className="row" style={{ marginBottom: 6, marginTop: 6 }}>
          <div className="col-sm-12">
            <span className="property-value" style={{ paddingLeft: 24 }}>{formHeader}</span>
          </div>
        </div>

        {false &&
        <div className="row" style={{ marginBottom: 16, marginTop: 6 }}>
          <div className="col-sm-12">
            <TextField {...textFieldProps(action, { label: 'Reporting Key', value: reportingKey, prop: 'reportingKey', isRequired: false })} />
          </div>
        </div> }

        <div className="row">
          <div className="col-sm-12 leftpadding">
            <OwnerList
              identity={identity}
              selfRolesLookup={selfRolesLookup}
              location={location}
              onChange={onChangeContent.bind(this, 'identities')}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12 leftpadding">
            <Associations associations={associations} action={action} location={location} />
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12 leftpadding">
            <Customs
              identity={identity}
              entity={null}
              action={action}
              valueVMOptions={valueVMOptions}
              valueVMTypeOptions={valueVMTypeOptions}
              onChange={onChangeContent.bind(this, 'customProperties')}
            />
          </div>
        </div>

      </div>
    );
  }
}

export default createFragmentContainer(Identity, {
  associations: graphql`
    fragment Identity_associations on Associations {
      ...Associations_associations
    }
  `,
  identity: graphql`
    fragment Identity_identity on Identity {
      id
      label
      entityType
      formHeader
      reportingKey
      identities {
        tail {
          propertyType
          valueVM {
            ... on ControlNumberProp {
              valueVMControlNumber {
                controlNumberString
                draftVersion
                version
                sequenceType
              }
            }
          }
          ...DraftVersion_propertyContent
        }
      }
      ...Title_identity
      standardProperties {
        name
        label
        valueVM
      }
      documentClass {
        id
        ...EntityLink_entityVM
      }
      documentType {
        id
        ...EntityLink_entityVM
      }
      organization {
        id
        ...EntityLink_entityVM
      }
      ...Customs_identity
      ...OwnerList_identity
    }
  `,
  controlNumberSequence: graphql`
    fragment Identity_controlNumberSequence on ControlNumberSequence {
      ...Title_controlNumberSequence
    }
  `,
  lockStatus: graphql`
    fragment Identity_lockStatus on LockStatus {
      ...Lock_lockStatus
    }
  `,
  selfRolesLookup: graphql`
    fragment Identity_selfRolesLookup on SelfRolesLookup {
      ...OwnerList_selfRolesLookup
    }
  `,
  valueVMOptions: graphql`
    fragment Identity_valueVMOptions on ValueVMOptions {
      ...Customs_valueVMOptions
    }
  `,
  valueVMTypeOptions: graphql`
    fragment Identity_valueVMTypeOptions on ValueVMTypeOptions {
      ...Customs_valueVMTypeOptions
    }
  `,
});
