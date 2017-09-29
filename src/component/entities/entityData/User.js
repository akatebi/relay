import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import qs from 'qs';
import { customPropsMap } from '../../../service/profile/identityMap';
import IdentityHeader from '../../profiles/IdentityHeader';
import PropertyContent from '../../profiles/PropertyContent';
import Scrollbar from '../../Scrollbar';
import SubHeader from '../../profiles/SubHeader';

// const debug = require('debug')('app:component:entities:User');

class User extends Component {

  static propTypes = {
    location: PropTypes.object.isRequired,
    entity: PropTypes.object.isRequired,
    identity: PropTypes.object.isRequired,
    valueVMOptions: PropTypes.object.isRequired,
    valueVMTypeOptions: PropTypes.object.isRequired,
  };

  state = {};

  componentWillMount = () => {
    const { entity: { customProperties } } = this.props;
    // debug('User customProperties', window.pretty(customProperties));
    this.setState({ customProperties });
  }

  render() {
    const {
      location,
      location: { search },
      // entity,
      identity,
      valueVMOptions,
      valueVMTypeOptions } = this.props;

    const { action = 'display' } = qs.parse(search, { ignoreQueryPrefix: true });

    const onChange = () => {};

    const getGroupLabel = mappedProp =>
      (mappedProp.group || 'Entity - (no group value)');

    const showProperties = () => {
      const { customProperties } = this.state;
      let mappedProps;
      if (customProperties) {
        mappedProps = customPropsMap(customProperties);
      }
      // debug('CUSTOMS - profile mapped', window.pretty(mappedProps));

      return (<div className="row">
        <div className="col-sm-12" style={{ paddingLeft: 0 }}>
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            {mappedProps.map(mappedProp =>
              (<li key={mappedProp.group}>
                <SubHeader label={getGroupLabel(mappedProp)} />
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                  {mappedProp.properties.map(mapped =>
                    (<li key={mapped.id}>
                      <div className="row">
                        <PropertyContent
                          relationshipToPropertyContent={
                            customProperties.find(property => property.tail.id === mapped.id)
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
      <Scrollbar>
        <div className="col-sm-11 nopadding">
          <IdentityHeader identity={identity} location={location} />
          <div className="row">
            <div className="col-sm-9">
              {showProperties()}
            </div>
          </div>
        </div>
      </Scrollbar>
    );
  }
}

export default createFragmentContainer(User, {
  entity: graphql`
    fragment User_entity on Entity {
      id
      label
      entityType
      reportingKey
      customProperties {
        ...PropertyContent_relationshipToPropertyContent
        id
        relationshipType
        configId
        tail {
          config {
            id
            isMultiSelect
            isRequired
            isVisible
            label
            listType
            operation
            propertyType
            propertyBehavior
            group {
              id
              cultureCode
              value
            }
            defaultValue
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
          operation
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
  `,
  identity: graphql`
    fragment User_identity on Identity {
      ...IdentityHeader_identity
    }
  `,
  valueVMOptions: graphql`
    fragment User_valueVMOptions on ValueVMOptions {
      ...PropertyContent_valueVMOptions
    }
  `,
  valueVMTypeOptions: graphql`
    fragment User_valueVMTypeOptions on ValueVMTypeOptions {
      ...PropertyContent_valueVMTypeOptions
    }
  `,
});
