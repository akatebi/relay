import PropTypes from 'prop-types';
import React from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import qs from 'qs';
import IdentityHeader from '../../profiles/IdentityHeader';
import PropertyContent from '../../profiles/PropertyContent';
import Scrollbar from '../../Scrollbar';

// const debug = require('debug')('component:entities:Organization');

const Organization = ({ location: { search }, entity, identity, valueVMOptions, valueVMTypeOptions }) => {

  // console.log('%%%% Org', window.pretty(entity));
  const { action = 'display' } = qs.parse(search, { ignoreQueryPrefix: true });

  const contentRestricted = () => {
    const { customProperties } = entity;
    const index = customProperties.findIndex(({ tail: { name } }) => name === 'ContentRestricted');
    return (<PropertyContent
      relationshipToPropertyContent={{ ...customProperties[index] }}
      action={action}
      valueVMOptions={valueVMOptions}
      valueVMTypeOptions={valueVMTypeOptions}
      onChange={() => {}}
    />);
  };

  const locale = () => {
    const { customProperties } = entity;
    const index = customProperties.findIndex(({ tail: { name } }) => name === 'Location');
    return (<PropertyContent
      relationshipToPropertyContent={{ ...customProperties[index] }}
      action={action}
      valueVMOptions={valueVMOptions}
      valueVMTypeOptions={valueVMTypeOptions}
      onChange={() => {}}
    />);
  };

  const adminRoles = () => {
    const { customProperties } = entity;
    const index = customProperties.findIndex(({ tail: { name } }) => name === 'AdministratorRoles');
    return (<PropertyContent
      relationshipToPropertyContent={{ ...customProperties[index] }}
      action={action}
      valueVMOptions={valueVMOptions}
      valueVMTypeOptions={valueVMTypeOptions}
      onChange={() => {}}
    />);
  };

  const contentRoles = () => {
    const { customProperties } = entity;
    const index = customProperties.findIndex(({ tail: { name } }) => name === 'ContentRoles');
    return (<PropertyContent
      relationshipToPropertyContent={{ ...customProperties[index] }}
      action={action}
      onChange={() => {}}
      valueVMOptions={valueVMOptions}
      valueVMTypeOptions={valueVMTypeOptions}
    />);
  };

  return (
    <Scrollbar>
      <div className="col-sm-12 nopadding">
        <IdentityHeader identity={identity} location={location} />
        <table className="table table-striped table-condensed table-hover">
          <tbody>
            <tr>
              <td>{contentRestricted()}</td>
            </tr>
            <tr>
              <td>{locale()}</td>
            </tr>
            <tr>
              <td>{adminRoles()}</td>
            </tr>
            <tr>
              <td>{contentRoles()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Scrollbar>
  );
};

Organization.propTypes = {
  location: PropTypes.object.isRequired,
  entity: PropTypes.object.isRequired,
  identity: PropTypes.object.isRequired,
  valueVMOptions: PropTypes.object.isRequired,
  valueVMTypeOptions: PropTypes.object.isRequired,
};

export default createFragmentContainer(Organization, {
  entity: graphql`
    fragment Organization_entity on Entity {
      id
      entityType
      customProperties {
        ...PropertyContent_relationshipToPropertyContent
        id
        tail {
          name
        }
      }
    }
  `,
  identity: graphql`
    fragment Organization_identity on Identity {
      ...IdentityHeader_identity
    }
  `,
  valueVMOptions: graphql`
    fragment Organization_valueVMOptions on ValueVMOptions {
      ...PropertyContent_valueVMOptions
    }
  `,
  valueVMTypeOptions: graphql`
    fragment Organization_valueVMTypeOptions on ValueVMTypeOptions {
      ...PropertyContent_valueVMTypeOptions
    }
  `,
});

/*
<EntityLink entityVM={{
  id: entity.id,
  label: entity.label,
  entityType: entity.entityType }}
  */
