import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import qs from 'qs';
import { Nav, NavItem, Panel } from 'react-bootstrap';
import SimpleBooleanField from '../../profiles/SimpleBooleanField';
import SimpleTextField from '../../profiles/SimpleTextField';
import IdentityHeader from '../../profiles/IdentityHeader';
import PropertyContent from '../../profiles/PropertyContent';
import Scrollbar from '../../Scrollbar';

// const debug = require('debug')('app:component:entities:ApprovalCycleConfig');

class ApprovalCycleConfig extends Component {

  static propTypes = {
    location: PropTypes.object.isRequired,
    entity: PropTypes.object.isRequired,
    identity: PropTypes.object.isRequired,
    valueVMOptions: PropTypes.object.isRequired,
    valueVMTypeOptions: PropTypes.object.isRequired,
  };

  state = {};

  componentWillMount = () => {
    const { entity: { approvalSegmentConfigs } } = this.props;
    this.setState({ selectedSegment: approvalSegmentConfigs[0] });
  }


  render() {
    const { location: { search }, entity, identity, valueVMOptions, valueVMTypeOptions,
      entity: { approvalSegmentConfigs } } = this.props;

    // debug('AppCycleConfig', window.pretty(this.props.entity));

    const { action = 'display' } = qs.parse(search, { ignoreQueryPrefix: true });

    const onChange = () => {};

    const textProps = (label, value, classNameOverride) => ({
      label,
      value,
      action,
      onChange,
      classNameOverride,
    });

    const booleanProps = (label, value) => ({
      label,
      value,
      action,
      onChange,
    });

    const onSelectSegment = (segment, evt) => {
      evt.preventDefault();
      // console.log('onSelectSegment', segment.id, segment.label);
      this.setState({ selectedSegment: segment });
    };

    const segmentProp = (name) => {
      if (!this.state.selectedSegment) return false;
      const { selectedSegment: { customProperties } } = this.state;
      // console.log('selectedSegment', window.pretty(this.state.selectedSegment));
      const index = customProperties.findIndex(({ tail }) => tail.name === name);
      // console.log('custom index', index);
      return (<PropertyContent
        relationshipToPropertyContent={customProperties[index]}
        action={action}
        onChange={onChange}
        valueVMOptions={valueVMOptions}
        valueVMTypeOptions={valueVMTypeOptions}
      />);
    };

    const segments = () =>
      (<div>
        <br />
        <div className="header-label">
          {approvalSegmentConfigs.length > 1 ?
            'Approval Segment Configurations' :
            'Approval Segment Configuration'
          }
        </div>
        <div className="col-sm-3" style={{ marginLeft: 0 }}>
          <Nav bsStyle="pills" stacked >
            { entity.approvalSegmentConfigs.map((segment, i) =>
              (<NavItem
                active={i === -1}
                key={i}
                eventKey={i}
                href="#"
                onClick={onSelectSegment.bind(this, segment)}
              >
                {segment.label}
              </NavItem>),
            )}
          </Nav>
        </div>
        <div className="col-sm-9">
          <Panel style={{ marginBottom: 10 }} >
            <table className="table table-striped table-condensed">
              <tbody>
                <tr>
                  <td>{segmentProp('SegmentType')}</td>
                </tr>
                <tr>
                  <td>{segmentProp('ApproverSource')}</td>
                </tr>
                <tr>
                  <td>{segmentProp('SelectAllUsers')}</td>
                </tr>
                <tr>
                  <td>{segmentProp('WaitForEverybody')}</td>
                </tr>
                <tr>
                  <td>{segmentProp('Layout')}</td>
                </tr>
              </tbody>
            </table>
          </Panel>
        </div>
      </div>);

    return (
      <Scrollbar>
        <div className="col-sm-12 nopadding">
          <IdentityHeader identity={identity} location={location} />
          <div className="row">
            <SimpleTextField {...textProps('Approval Cycle Name', entity.label)} />
          </div>
          <div className="row" style={{ marginTop: 4 }}>
            <div
              className="col-sm-3 nopadding property-label"
              style={{ marginLeft: 20 }}
            >Process Type
            </div>
            <div
              className="col-sm-8 leftpadding property-value-md"
              style={{ marginLeft: 0 }}
            >
              {entity.processType}
            </div>
          </div>
          {entity.waitForEverybody &&
            <div className="row">
              <SimpleBooleanField {...booleanProps('Wait for Everybody ?', entity.waitForEverybody)} />
            </div>
          }
          <div className="row">
            {segments()}
          </div>
        </div>
      </Scrollbar>
    );
  }
}

export default createFragmentContainer(ApprovalCycleConfig, {
  entity: graphql`
    fragment ApprovalCycleConfig_entity on Entity {
      processType
      waitForEverybody
      approvalSegmentConfigs {
        id
        label
        customProperties {
          ...PropertyContent_relationshipToPropertyContent
          id
          relationshipType
          configId
          tail {
            config {
              id
              propertyBehavior
              validations {
                type
                regex
                messageText
              }
            }
            name
            id
            propertyType
            entityType
            label
            valueVM {
              __typename
              ... on RoleListProp {
                valueVMRoleList {
                  id
                  label
                  value
                }
              }
              ... on BooleanProp {
                valueVMBoolean
              }
              ... on TextProp {
                valueVMText
              }
              ... on EntityProp {
                valueVMEntity {
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
            }
          }
        }
      }
      id
      label
      entityType
      reportingKey
    }
  `,
  identity: graphql`
    fragment ApprovalCycleConfig_identity on Identity {
      ...IdentityHeader_identity
    }
  `,
  valueVMOptions: graphql`
    fragment ApprovalCycleConfig_valueVMOptions on ValueVMOptions {
      ...PropertyContent_valueVMOptions
    }
  `,
  valueVMTypeOptions: graphql`
    fragment ApprovalCycleConfig_valueVMTypeOptions on ValueVMTypeOptions {
      ...PropertyContent_valueVMTypeOptions
    }
  `,
});
