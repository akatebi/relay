import PropTypes from 'prop-types';
import React, { Component } from 'react';
import qs from 'qs';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import { Button, Panel, FormGroup } from 'react-bootstrap';
import Select from 'react-select';
import clone from 'clone';
import Loader from 'react-loader';
import { successAlert, errorAlert } from '../../service/alert';
import { subWizSaveMutation } from './mutation/subWizSave';
import labels from './subwizLabels.json';
import {
  mapSubmitData,
} from './service';

const debug = require('debug')('app:component:SubWiz:AppSegments');

class AppSegments extends Component {

  static propTypes = {
    // closeModal: PropTypes.func.isRequired,
    eligibleApprovers: PropTypes.object.isRequired,
    identity: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    relay: PropTypes.object.isRequired,
    selectedApprovalCycle: PropTypes.object.isRequired,
  };

  //////////////////////////////////////////////////////////////////////////////

  state = { selectedApprovers: [], waitForEverybody: false, mutating: false };

  //////////////////////////////////////////////////////////////////////////////
  onPrevious = () => (evt) => {
    evt.preventDefault();
    if (this.state.mutating) {
      debug('ignoring all button clicks while mutating');
      return;
    }
    const {
      history,
      location: { pathname, search },
    } = this.props;
    const { processType } = qs.parse(search, { ignoreQueryPrefix: true });
    const searchVal = qs.stringify({ processType });
    history.replace({ pathname, search: searchVal });
  }

  onSubmit = () => {
    if (this.state.mutating) {
      debug('ignoring all button clicks while mutating');
      return;
    }
    const { selectedApprovers } = this.state;
    const {
      params: { docId, path },
      identity: { lifeCycle },
      relay: { environment },
      location: { search },
    } = this.props;
    const { processType, selectedCycleId } = qs.parse(search, { ignoreQueryPrefix: true });
    const submitData = mapSubmitData({
      lifeCycle,
      processType,
      selectedCycleId,
      selectedApprovers,
    });
    debug('submitData', submitData);
    this.setState({ mutating: true });
    subWizSaveMutation(
      environment,
      { docId, submitData, path },
      (resp) => {
        this.setState({ mutating: false });
        if (resp.subWizSaveMutation.approvalCycleToolbar) {
          successAlert(`Submitted for ${processType}`);
          this.redirectToIdentity();
        } else {
          errorAlert(`Not Submitted for ${processType}`);
        }
      },
      (error) => {
        debug('error', error);
        errorAlert(`Not Submitted for ${processType}`);
        this.setState({ mutating: false });
      },
    );
  }

  //////////////////////////////////////////////////////////////////////////////

  getLabel = key => labels.find(label => label.key === key).value;

  //////////////////////////////////////////////////////////////////////////////

  redirectToIdentity = () => {
    const { history } = this.props;
    const { location: { pathname } } = this.props;
    // debug('redirectToIdentity', pathname);
    history.push(pathname);
  }

  //////////////////////////////////////////////////////////////////////////////

  panelHeaderView = (approvalSegmentConfigs, index) => {
    const {
      label: segmentLabel,
      customProperties,
    } = approvalSegmentConfigs[index];
    const approverSource = customProperties.find(({ tail: { name } }) => name === 'ApproverSource') || {};
    const approverSelectionMode = customProperties.find(({ tail: { name } }) => name === 'ApproverSelectionMode') || {};
    const segmentType = customProperties.find(({ tail: { name } }) => name === 'SegmentType') || {};
    const selectAllUsers = customProperties.find(({ tail: { name } }) => name === 'SelectAllUsers') || {};
    const waitForEverybody = customProperties.find(({ tail: { name } }) => name === 'WaitForEverybody') || {};
    return (
      <div className="row">
        <div className="col-sm-10">
          <span className="control-label">{segmentLabel}</span>
        </div>
        <div className="col-sm-2">
          <span
            className="glyphicon glyphicon-info-sign pull-right header-link"
            onClick={(evt) => {
              evt.preventDefault();
              const detailSegment = {
                index,
                approverSource,
                approverSelectionMode,
                selectAllUsers,
                segmentLabel,
                segmentType,
                waitForEverybody,
              };
              // debug('detailSegment', detailSegment);
              this.setState({ detailSegment });
            }}
          />
        </div>
      </div>);
  };

  //////////////////////////////////////////////////////////////////////////////

  approverPickersView = (approvalSegmentConfigs) => {
    const { eligibleApprovers: { list } } = this.props;
    const onSelectApprovers = (index, selectedApprover) => {
      // debug('selectedApprover', selectedApprover);
      if (selectedApprover.length) {
        this.state.selectedApprovers.splice(index, 1, selectedApprover);
      } else {
        this.state.selectedApprovers.splice(index, 1);
      }
      // debug('selectedApprover', selectedApprover);
      this.setState({ selectedApprovers: this.state.selectedApprovers });
    };
    const selectProps = (index) => {
      const segment = approvalSegmentConfigs[index];
      const approvers = clone(list);
      const options = approvers.find(({ segmentId }) => segmentId === segment.id)
        .assignees.map(x => ({ value: x.id, ...x, segmentId: segment.id }))
        .sort((a, b) => a.label.localeCompare(b.label));
      // debug('options', options);
      return {
        multi: true,
        autoBlur: true,
        clearable: true,
        // resetValue: undefined,
        placeholder: 'select approvers...',
        options,
        value: this.state.selectedApprovers[index] &&
          this.state.selectedApprovers[index].map(x => ({ value: x.id, ...x })),
        onChange: onSelectApprovers.bind(this, index),
      };
    };
    return (
      <div>
        <div className="header-label">Approval Segments</div>
        {approvalSegmentConfigs.map((segment, index) => (
          <Panel key={index} header={this.panelHeaderView(approvalSegmentConfigs, index)}>
            <Select
              {...selectProps(index)}
              className="select-primary-color"
              bsSize="xs"
              // onBlur={this._validationCheck}
            />
          </Panel>
        ))}
      </div>
    );
  };

  //////////////////////////////////////////////////////////////////////////////

  detailsPanelView = () => {
    const {
      detailSegment,
    } = this.state;
    if (detailSegment) {
      const {
        detailSegment: {
          segmentType,
          selectAllUsers,
          waitForEverybody,
        },
      } = this.state;
      return (
        <Panel header={this.detailsPanelHeaderView()} >
          <div className="panel-body">
            <div>
              <span className="wiz-property-label">{`${this.getLabel('_SubWiz_SegmentType')}: `}</span>
              <span className="wiz-property-value">
                <span>&nbsp;</span>
                {detailSegment && segmentType.tail.valueVM.valueVMCategory[0].label}
              </span>
            </div>
            <div>
              <span className="wiz-property-label">Select All Users</span>
              <span className="wiz-property-value">
                <span>&nbsp;</span>
                {detailSegment && selectAllUsers.tail.valueVM.valueVMBoolean ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className="wiz-property-label">{`${this.getLabel('_SubWiz_WaitForEverybody')} `}</span>
              <span className="wiz-property-value">
                <span>&nbsp;</span>
                {detailSegment && waitForEverybody.tail.valueVM.valueVMBoolean ? 'Yes' : 'No'}
              </span>
            </div>

            <div className="wiz-property-label">{`${this.getLabel('_SubWiz_ApproverSource')} `}</div>
            <div className="wiz-property-value-sm">
              {this.approverSourceListView()}
            </div>
          </div>
        </Panel>
      );
    }
    return <div />;
  };

  //////////////////////////////////////////////////////////////////////////////

  detailsPanelHeaderView = () => (
    <div className="row" >
      <div className="col-sm-10">
        <span className="control-label">{'Details'}</span>
      </div>
      <div className="col-sm-2" >
        <span
          className="glyphicon glyphicon-remove pull-right header-link xpanel-close"
          onClick={() => this.setState({ detailSegment: null })}
        />
      </div>
    </div>);

  //////////////////////////////////////////////////////////////////////////////

  approverSourceListView = () => {
    const {
      detailSegment,
    } = this.state;
    if (detailSegment) {
      const {
        detailSegment: { approverSource },
      } = this.state;
      // debug('approverSource', approverSource);
      const result = (
        <ul>
          {approverSource.tail.valueVM.valueVMRoleList
            .map(({ label, id }) => <li key={id}>{label}</li>)}
        </ul>
      );
      return result;
    }
    return '(none)';
  };

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  render() {

    const {
      selectedApprovalCycle: { approvalSegmentConfigs },
    } = this.props;
    // debug('approvalSegmentConfigs', approvalSegmentConfigs);
    if (!approvalSegmentConfigs) {
      // debug('NOT selectedApprovalCycle', !approvalSegmentConfigs);
      return false;
    }

    const showSubmitButton = approvalSegmentConfigs.length === this.state.selectedApprovers.length;

    return (
      <div className="step step2">
        <div className="row">
          <div className="col-sm-12">
            <div>
              <div className="header-label">{this.getLabel('_SubWiz_AppCycleHeader')}</div>
              <div className="wiz-property-value">&nbsp;&nbsp;&nbsp;{this.props.selectedApprovalCycle.label}</div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            {this.approverPickersView(approvalSegmentConfigs)}
            <div className="col-sm-12">
              <form>
                <FormGroup controlId="formAppCycles">
                  <input
                    type="checkbox"
                    checked={this.state.waitForEverybody}
                    onChange={({ target: { checked: waitForEverybody } }) =>
                      this.setState({ waitForEverybody })}
                  />
                  &nbsp;&nbsp;
                  <span className="wiz-property-value">{this.getLabel('_SubWiz_WaitForEverybody')}</span>
                </FormGroup>
              </form>
            </div>
            <div className="col-sm-12">
              <span>
                <Button
                  bsSize="small"
                  bsStyle="primary"
                  onClick={this.onPrevious}
                >
                  Previous
                </Button>
              </span>
              <span className="pull-right">
                {showSubmitButton &&
                  <Button
                    bsSize="small"
                    bsStyle="primary"
                    onClick={this.onSubmit}
                  >
                    Submit
                  </Button>
                }
              </span>
            </div>
          </div>
          <div className="col-sm-6">
            {this.detailsPanelView()}
          </div>
        </div>
        <Loader color="grey" loaded={!this.state.mutating} />
      </div>
    );
  }
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

export default createFragmentContainer(AppSegments, {
  eligibleApprovers: graphql`
    fragment AppSegments_eligibleApprovers on EligibleApprovers {
      list {
        segmentId
        assignees {
          id
          label
        }
      }
    }
  `,
  identity: graphql`
    fragment AppSegments_identity on Identity {
      lifeCycle {
        lifeCycleStateContents {
          state
          id
          entityType
        }
      }
    }
  `,
  selectedApprovalCycle: graphql`
    fragment AppSegments_selectedApprovalCycle on SelectedApprovalCycle{
      id
      label
      processType
      entityType
      waitForEverybody
      approvalSegmentConfigs {
        id
        label
        customProperties {
          tail {
            id
            name
            config {
              group {
                id
                cultureCode
                value
              }
              validations {
                type
                messageText
                regex
              }
            }
            propertyType
            valueVM {
              ... on BooleanProp {
                valueVMBoolean
              }
              ... on CategoryProp {
                valueVMCategory {
                  id
                  label
                  entityType
                  familyId
                  isFamily
                  cultureCode
                  operation
                  reportingKey
                }
               }
              ... on RoleListProp {
                valueVMRoleList {
                  id
                  label
                  entityType
                  familyId
                  isFamily
                  cultureCode
                  operation
                  reportingKey
                }
              }
              ... on TextProp {
                valueVMText
              }
            }
          }
        }
      }
    }
  `,
});
