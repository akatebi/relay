import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import qs from 'qs';
import { Panel } from 'react-bootstrap';
// import PropertyConfig from '../../profiles/PropertyConfigs/PropertyConfig';
import IdentityHeader from '../../profiles/IdentityHeader';
import PropertyContent from '../../profiles/PropertyContent';
import EntityLink from '../EntityLink';
import Scrollbar from '../../Scrollbar';

// const debug = require('debug')('app:component:entities:entityData:SectionConfig');

class SectionConfig extends Component {

  static propTypes = {
    location: PropTypes.object.isRequired,
    entity: PropTypes.shape({
      id: PropTypes.string.isRequired,
      entityType: PropTypes.string.isRequired,
      customProperties: PropTypes.arrayOf(
        PropTypes.object.isRequired,
      ),
      lifeCycleActions: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
        }),
      ),
      configProperties: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
        }),
      ),
      relationships2: PropTypes.arrayOf(
        PropTypes.shape({
          lifeCycleActions: PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.string.isRequired,
            }),
          ),
        }),
        PropTypes.shape({
          associationConfigs: PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.string.isRequired,
              familyId: PropTypes.string.isRequired,
              label: PropTypes.string.isRequired,
              entityType: PropTypes.string.isRequired,
              isFamily: PropTypes.bool.isRequired,
              cultureCode: PropTypes.string.isRequired,
              operation: PropTypes.string.isRequired,
              reportingKey: PropTypes.string.isRequired,
            }),
          ),
        }),
        PropTypes.shape({
          lineItemConfig: PropTypes.shape({
            id: PropTypes.string.isRequired,
            familyId: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            entityType: PropTypes.string.isRequired,
            isFamily: PropTypes.bool.isRequired,
            cultureCode: PropTypes.string.isRequired,
            operation: PropTypes.string.isRequired,
            reportingKey: PropTypes.string.isRequired,
          }),
        }),
      ),
      prerequisites: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
        }),
      ),
      triggers: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
        }),
      ),
    }),
    identity: PropTypes.object.isRequired,
    valueVMOptions: PropTypes.object.isRequired,
    valueVMTypeOptions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount = () => {
    this.setState({ selectedSegment: null });
    // const { relationships2 } = this.props.entity;
    // console.log('%%%%%% SectionConfig ENTITY rels2', window.pretty(relationships2));
    // const { configProperties } = this.props.entity;
    // configProperties.forEach((prop) => {
    // debug('%%%%% SectionConfig ENTITY configProperties',
    //   window.pretty(configProperties));
    // });
  }

  render() {
    const {
      location: { search },
      entity, identity, valueVMOptions, valueVMTypeOptions } = this.props;
    const {
      configProperties,
      prerequisites,
      triggers,
      lifeCycleActions: sectionActions,
      relationships2,
    } = entity;
    // debug('%%% entity', window.pretty(entity));
    // debug('%%% entity sectionActionId', sectionActionId);
    // debug('%%% entity associationConfigs', window.pretty(associationConfigs));
    const { action = 'display' } = qs.parse(search, { ignoreQueryPrefix: true });

    const onChange = () => {};

    const customProp = (name) => {
      const { entity: { customProperties } } = this.props;
      const index = customProperties.findIndex(({ tail }) => tail.name === name);
      // if (name === 'LineItemInheritanceMode') {
      // debug('customProperties lookup', window.pretty(...customProperties[index]));
      // }
      return (<PropertyContent
        relationshipToPropertyContent={{ ...customProperties[index] }}
        action={action}
        onChange={onChange}
        valueVMOptions={valueVMOptions}
        valueVMTypeOptions={valueVMTypeOptions}
      />);
    };

    // const configEntityVM = config => ({
    //   id: config.id,
    //   familyId: config.familyId,
    //   label: config.label,
    //   entityType: config.entityType,
    //   isFamily: config.isFamily,
    //   cultureCode: config.cultureCode,
    //   operation: config.operation,
    //   reportingKey: config.reportingKey,
    // });

    const showConfigProps = () => {
      if (configProperties) {
        return configProperties.length === 0 ? 'none' :
          configProperties.map((config, i) =>
            (<div key={i} className="property-value">{`- ${config.property.propertyLabel.value}`}</div>),
            // (<EntityLink
            //   key={i}
            //   location={location}
            //   entityVM={{ ...configEntityVM(global.log(config)) }}
            // />),
            // (<PropertyConfig
            //   key={i}
            //   action={action}
            //   propertyConfig={{ ...config.property }}
            //   onChange={onChange}
            //   valueVMOptions={valueVMOptions}
            //   valueVMTypeOptions={valueVMTypeOptions}
            // />),
          );
      }
      return 'none';
    };

    const showPreReqs = () => {
      if (prerequisites) {
        return prerequisites.length === 0 ? '- not implemented -' : `count = ${prerequisites.length}`;
      }
      return '- not implemented -';
    };

    const showTriggers = () => {
      if (triggers) {
        return triggers.length === 0 ? '- not implemented -' : `count = ${triggers.length}`;
      }
      return '- not implemented -';
    };

    const showLifeCycleActions = (actions, i) => {
      if (!actions || actions.length === 0) {
        return `${i} - none`;
      }
      return actions.map(action => `${i} - ${action.label}`);
    };

    const showAssociationConfigs = (configs) => {
      if (configs && configs.length) {
        return configs.map((config, j) =>
          (<EntityLink
            key={j}
            location={location}
            entityVM={{ ...config }}
            classOverride={'toolbar-link'}
          />),
        );
      }
      return <div>none</div>;
    };

    const showLineItemConfig = (config) => {
      if (config) {
        return (
          <EntityLink
            location={location}
            entityVM={{ ...config }}
            classOverride={'toolbar-link'}
          />);
      }
      return <div>none</div>;
    };

    return (
      <Scrollbar>
        <div className="col-sm-12 nopadding">
          <IdentityHeader identity={identity} location={location} />
          <div className="row">
            <div className="col-sm-6">
              <Panel style={{ paddingLeft: 0, marginBottom: 10 }} >
                <div>{customProp('Heading')}</div>
                <div>{customProp('SectionConfigType')}</div>
                <div>{customProp('Description')}</div>
                <div>{customProp('Instruction')}</div>
                <div>{customProp('ScoringWeightSupported')}</div>
              </Panel>

              <Panel style={{ paddingLeft: 0, marginBottom: 10 }} >
                <div>
                  <span className="header-label">Config Properties</span>
                  <span className="property-value">
                    {showConfigProps()}
                  </span>
                </div>
              </Panel>

              <Panel style={{ paddingLeft: 0, marginBottom: 10 }} >
                <div>
                  <span className="property-label">*** Pre-requisites</span>
                  <span className="property-value">
                    {showPreReqs()}
                  </span>
                </div>
                <div>
                  <span className="property-label">*** Triggers</span>
                  <span className="property-value">
                    {showTriggers()}
                  </span>
                </div>
              </Panel>

              <Panel style={{ paddingLeft: 0, marginBottom: 10 }} >
                <div className="header-label">Actions</div>
                <div
                  className="panel-title  "
                  style={{ textAlign: 'left' }}
                >Section Config Actions</div>
                <div
                  className="property-value"
                  style={{ paddingLeft: 8 }}
                >{showLifeCycleActions(sectionActions, 0)}
                </div>
                <div style={{ paddingTop: 4 }}>
                  <span className="panel-title">Line Item Config Actions</span>
                  <span className="property-value">
                    {relationships2.map((rel, i) =>
                      (<div key={i} style={{ paddingLeft: 8 }}>
                        {showLifeCycleActions(rel.lifeCycleActions, i)}
                      </div>))
                    }
                  </span>
                </div>
              </Panel>

              <Panel style={{ paddingLeft: 0, marginBottom: 10 }} >
                <div className="header-label">Association Configs</div>
                <div>
                  <span>
                    {relationships2.map((rel, i) => (
                      <div key={i}>{showAssociationConfigs(rel.associationConfigs)}</div>
                    ))}
                  </span>
                </div>
              </Panel>

              <Panel style={{ paddingLeft: 0, marginBottom: 10 }} >
                <div className="header-label">Line Item Configs</div>
                <div>
                  <span>
                    {relationships2.map((rel, i) => (
                      <div key={i}>{showLineItemConfig(rel.lineItemConfig)}</div>
                    ))}
                  </span>
                </div>
              </Panel>
            </div>
            <div className="col-sm-6">
              <Panel style={{ paddingLeft: 0, marginBottom: 10 }} >
                <div className="header-label">Reference Number</div>
                <div>{customProp('ReferenceNumberType')}</div>
                <div>{customProp('ReferenceNumberValue')}</div>
              </Panel>
              <Panel style={{ paddingLeft: 0, marginBottom: 10 }} >
                <div className="header-label">Associations</div>
                <div>{customProp('LineItemInheritanceMode')}</div>
                <div>{customProp('LineItemOriginatingSection')}</div>
                <div>{customProp('AssociationConfigRelationships')}</div>
                <div>{customProp('AssociationCreationConstraint')}</div>
                <div>{customProp('AssociationInheritanceMode')}</div>
                <div>{customProp('AssociationOriginatingSection')}</div>
                <div>{customProp('LifeCycleActions')}</div>
                <div>{customProp('ContentLayoutRevision')}</div>
                <div>{customProp('Validations')}</div>
              </Panel>
            </div>
          </div>
        </div>
      </Scrollbar>
    );
  }
}

export default createFragmentContainer(SectionConfig, {
  entity: graphql`
    fragment SectionConfig_entity on Entity {
      id
      entityType
      customProperties {
        ...PropertyContent_relationshipToPropertyContent
        id
        tail {
          name
        }
      }
      prerequisites {
        id
      }
      triggers {
        id
      },
      lifeCycleActions {
        id
      },
      configProperties {
        id
        configId
        relationshipType
        operation
        property {
          # ...PropertyConfig_propertyConfig
          id
          url
          group
          label
          operation
          isVisible
          isEditable
          entityType
          propertyType
          reportingKey
          # ...EntityLink_entityVM
          isMasterData
          # isMultiSelect
          masterDataType
          masterDataPropertyConfig
          propertyLabel {
            id
            value
          }
          defaultValue {
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
            ... on ControlNumberProp {
              valueVMControlNumber {
                 type
                 prefix
                 suffix
                 sequenceNumber
                 controlNumberString
                 sequenceType
                 version
                 draftVersion
                 configId
              }
            }
            ... on DateProp {
              valueVMDate
            }
            ... on DecimalProp {
              valueVMDecimal
            }
            ... on EntityListProp {
              valueVMEntityList {
                id
                familyId
                label
                entityType
                isFamily
                cultureCode
                operation
                reportingKey
              }
            }
            ... on EntityProp {
              valueVMEntity {
                id
                familyId
                label
                entityType
                isFamily
                cultureCode
                operation
                reportingKey
              }
            }
            ... on FloatProp {
              valueVMFloat
            }
            ... on IntegerProp {
              valueVMInteger
            }
            ... on RichTextProp {
              valueVMRichText
            }
            ... on RoleListProp {
              valueVMRoleList {
                id
                familyId
                label
                entityType
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
          customAttributes {
            name
            type
            value {
              ... on BooleanAttr {
                valueBoolean
              }
              ... on CategoryAttr {
                valueCategory {
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
              ... on ControlNumberAttr {
                valueControlNumber {
                   type
                   prefix
                   suffix
                   sequenceNumber
                   controlNumberString
                   sequenceType
                   version
                   draftVersion
                   configId
                }
              }
              ... on DateAttr {
                valueDate
              }
              ... on DecimalAttr {
                valueDecimal
              }
              ... on EntityListAttr {
                valueEntityList {
                  id
                  familyId
                  label
                  entityType
                  isFamily
                  cultureCode
                  operation
                  reportingKey
                }
              }
              ... on EntityAttr {
                valueEntity {
                  id
                  familyId
                  label
                  entityType
                  isFamily
                  cultureCode
                  operation
                  reportingKey
                  value
                }
              }
              ... on FloatAttr {
                valueFloat
              }
              ... on IntegerAttr {
                valueInteger
              }
              ... on RichTextAttr {
                valueRichText
              }
              ... on RoleListAttr {
                valueRoleList {
                  id
                  familyId
                  label
                  entityType
                  isFamily
                  cultureCode
                  operation
                  reportingKey
                }
              }
              ... on TextAttr {
                valueText
              }
            }
            ...CustomAttribute_customAttribute
          }
          ...DefaultValue_propertyConfig
          ...Validations_propertyConfig
        }
      }
      relationships2 {
        lifeCycleActions {
          id
        }
        associationConfigs {
          ...EntityLink_entityVM
        }
        lineItemConfig {
          ...EntityLink_entityVM
        }
      }
    }
  `,
  identity: graphql`
    fragment SectionConfig_identity on Identity {
      ...IdentityHeader_identity
    }
  `,
  valueVMOptions: graphql`
    fragment SectionConfig_valueVMOptions on ValueVMOptions {
      # ...PropertyConfig_valueVMOptions
      ...PropertyContent_valueVMOptions
    }
  `,
  valueVMTypeOptions: graphql`
    fragment SectionConfig_valueVMTypeOptions on ValueVMTypeOptions {
      # ...PropertyConfig_valueVMTypeOptions
      ...PropertyContent_valueVMTypeOptions
    }
  `,
});
