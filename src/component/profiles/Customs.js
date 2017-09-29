import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';
import React from 'react';
import SubHeader from './SubHeader';
import PropertyContent from './PropertyContent';
import { customPropsMap } from '../../service/profile/identityMap';

// const debug = require('debug')('component:profiles:Customs');

const Customs = ({
  action,
  onChange,
  entity,
  identity,
  valueVMOptions,
  valueVMTypeOptions,
}) => {

  // debug('entity', window.pretty(entity));
  // debug('identity', window.pretty(identity));

  let entityProps;
  let profileProps;
  if (entity && entity.customProperties) {
    entityProps = entity.customProperties;
  }
  if (identity && identity.customProperties) {
    profileProps = identity.customProperties;
  }

  const getGroupLabel = (mappedProp, isEntity) => {
    if (isEntity) {
      return mappedProp.group || 'Entity - (no group value)';
    }
    return mappedProp.group || 'Profile - (no group value)';
  };

  const customProperties = (properties, isEntity) => {
    let mappedProps;
    if (properties) {
      mappedProps = customPropsMap(properties);
    }
    // console.log('CUSTOMS - profile mapped', window.pretty(mappedProps));

    return (<div className="row">
      <div className="col-sm-12 nopadding">
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {mappedProps.map(mappedProp =>
            (<li key={mappedProp.group}>
              <SubHeader label={getGroupLabel(mappedProp, isEntity)} />
              <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                {mappedProp.properties.map(mapped =>
                  (<li key={mapped.id}>
                    <div className="row">
                      <PropertyContent
                        relationshipToPropertyContent={
                          properties.find(property => property.tail.id === mapped.id)
                        }
                        action={action}
                        onChange={onChange}
                        valueVMOptions={valueVMOptions}
                        valueVMTypeOptions={valueVMTypeOptions}
                      />
                    </div>
                  </li>))}
              </ul>
            </li>))}
        </ul>
      </div>
    </div>);
  };

  return (
    <div>
      {entityProps && customProperties(entityProps, true)}
      {profileProps && customProperties(profileProps)}
    </div>
  );
};

const shape = PropTypes.shape({
  customProperties: PropTypes.arrayOf(
    PropTypes.shape({
      tail: PropTypes.shape({
        id: PropTypes.string.isRequired,
        config: PropTypes.shape({
          group: PropTypes.shape({
            id: PropTypes.string.isRequired,
            cultureCode: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
          }),
        }),
      }),
    }).isRequired,
  ),
});

Customs.propTypes = {
  entity: shape,
  identity: shape,
  action: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  valueVMOptions: PropTypes.object.isRequired,
  valueVMTypeOptions: PropTypes.object.isRequired,
};

export default createFragmentContainer(Customs, {
  entity: graphql`
    fragment Customs_entity on Entity {
      id
      label
      entityType
      reportingKey
      customProperties {
        id
        relationshipType
        configId
        tail {
          config {
            id
            group {
              id
              cultureCode
              value
            }
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
        }
        ...PropertyContent_relationshipToPropertyContent
      }
    }
  `,
  identity: graphql`
    fragment Customs_identity on Identity {
      customProperties {
        tail {
          id
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
        }
        ...PropertyContent_relationshipToPropertyContent
      }
    }
  `,
  valueVMOptions: graphql`
    fragment Customs_valueVMOptions on ValueVMOptions {
      ...PropertyContent_valueVMOptions
    }
  `,
  valueVMTypeOptions: graphql`
    fragment Customs_valueVMTypeOptions on ValueVMTypeOptions {
      ...PropertyContent_valueVMTypeOptions
    }
  `,
});
