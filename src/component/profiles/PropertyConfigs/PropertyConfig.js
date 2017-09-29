import PropTypes from 'prop-types';
import React from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import { Panel } from 'react-bootstrap';
import Checkbox from './Checkbox';
import TextInput from './TextInput';
import Validations from './Validations';
import DefaultValue from './DefaultValue';
import CustomAttribute from './CustomAttribute';

// const debug = require('debug')('app:component:profles:ConfigProps:PropertyConfig');
// entityLookup,

const PropertyConfig = ({
  action,
  propertyConfig,
  onChange,
  valueVMOptions,
  valueVMTypeOptions,
  propertyConfig: {
    id,
    group,
    label,
    url,
    isVisible,
    isEditable,
    propertyType,
    reportingKey,
    isMasterData,
    // isMultiSelect,
    propertyLabel,
    masterDataType,
    customAttributes,
    masterDataPropertyConfig,
  },
}) => (
  <div>
    <div style={{ marginBottom: 10 }} >
      {/* start top header */}
      <div className="row" style={{ marginTop: 10 }} >
        <div className="col-sm-2 nopadding">
          <div className="header-label-right">Property Type</div>
        </div>
        <div className="col-sm-6" >
          <div className="value-lg">
            {propertyType}
          </div>
        </div>
      </div>

      <div className="row" style={{ marginTop: 10 }} >
        <div className="col-sm-2 nopadding">
          <div className="header-label-right">Settings</div>
        </div>
        <div className="col-sm-8" >
          <Panel style={{ marginBottom: 10 }} >
            <Checkbox
              action={action}
              isEditable={isEditable}
              name="Is Visible?"
              checked={isVisible}
              onChange={onChange.bind(this, id, 'isVisible')}
            />
            <TextInput
              action={action}
              isEditable={isEditable}
              name="Group"
              value={group}
              onChange={onChange.bind(this, id, 'group')}
            />
            <TextInput
              action={action}
              isEditable={isEditable}
              name="Label"
              value={label}
              onChange={onChange.bind(this, id, 'label')}
            />
            <TextInput
              action={action}
              isEditable={isEditable}
              name="Value"
              value={propertyLabel.value}
              onChange={onChange.bind(this, id, 'propertyLabel', 'value')}
            />
            <TextInput
              action={action}
              isEditable={isEditable}
              name="Culture Code"
              value={propertyLabel.cultureCode}
              onChange={onChange.bind(this, id, 'propertyLabel', 'cultureCode')}
            />
            <TextInput
              action={action}
              isEditable={isEditable}
              name="URL"
              value={url}
              onChange={onChange.bind(this, id, 'url')}
            />
            <TextInput
              action={action}
              isEditable={isEditable}
              name="Reporting Key"
              value={reportingKey}
              onChange={onChange.bind(this, id, 'reportingKey')}
            />
            <DefaultValue
              action={action}
              isEditable={isEditable}
              propertyConfig={propertyConfig}
              headerLabel="Default Value"
              valueVMOptions={valueVMOptions}
              valueVMTypeOptions={valueVMTypeOptions}
              onChange={onChange.bind(this, id, 'defaultValue')}
            />
          </Panel>
        </div>
      </div>

      {customAttributes && customAttributes.length > 0 &&
        (<div className="row" style={{ marginTop: 10 }} >
          <div className="col-sm-2 nopadding">
            <div className="header-label-right">Custom Attributes</div>
          </div>
          <div className="col-sm-8" >
            <Panel>
              {customAttributes.map(customAttribute =>
                (<CustomAttribute
                  key={customAttribute.__id}
                  action={action}
                  isEditable={isEditable}
                  onChange={onChange.bind(this, id, 'customAttributes')}
                  customAttribute={customAttribute}
                  valueVMOptions={valueVMOptions}
                />),
              )}
            </Panel>
          </div>
        </div>)
      }

      <div className="row" style={{ marginTop: 10 }} >
        <div className="col-sm-2 nopadding">
          <div className="header-label-right"></div>
        </div>
        <div className="col-sm-6" >

        </div>
      </div>

      <div className="row" style={{ marginTop: 10 }} >
        <div className="col-sm-2 nopadding">
          <div className="header-label-right">Master Data</div>
        </div>
        <div className="col-sm-8">
          <Panel>
            <Checkbox
              action={action}
              isEditable={isEditable}
              name="Is Master Data?"
              checked={isMasterData}
              onChange={onChange.bind(this, id, 'isMasterData')}
            />
            <TextInput
              action={action}
              isEditable={isEditable}
              name="Master Data Type"
              value={masterDataType}
              onChange={onChange.bind(this, id, 'masterDataType')}
            />
            <TextInput
              action={action}
              isEditable={isEditable}
              name="Master Data Property Configuration"
              value={masterDataPropertyConfig}
              onChange={onChange.bind(this, id, 'masterDataPropertyConfig')}
            />
          </Panel>
        </div>
      </div>

      <div className="row" style={{ marginTop: 10 }}>
        <div className="col-sm-2 nopadding">
          <div className="header-label-right">Validations</div>
        </div>
        <div className="col-sm-10">
          <Validations
            action={action}
            isEditable={isEditable}
            propertyConfig={propertyConfig}
            onChange={onChange.bind(this, id, 'validations')}
            valueVMOptions={valueVMOptions}
          />
        </div>
      </div>

    </div>
  </div>
);

PropertyConfig.propTypes = {
  action: PropTypes.string.isRequired,
  propertyConfig: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  valueVMOptions: PropTypes.object.isRequired,
  valueVMTypeOptions: PropTypes.object.isRequired,
};

export default createFragmentContainer(PropertyConfig, {
  propertyConfig: graphql`
    fragment PropertyConfig_propertyConfig on PropertyConfig {
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
  `,
  valueVMOptions: graphql`
    fragment PropertyConfig_valueVMOptions on ValueVMOptions {
      ...CustomAttribute_valueVMOptions
      ...DefaultValue_valueVMOptions
      ...Validations_valueVMOptions
    }
  `,
  valueVMTypeOptions: graphql`
    fragment PropertyConfig_valueVMTypeOptions on ValueVMTypeOptions {
      ...DefaultValue_valueVMTypeOptions
    }
  `,
});
