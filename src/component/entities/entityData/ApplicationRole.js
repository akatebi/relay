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

// const debug = require('debug')('app:component:entities:ApplicationRole');

const ApplicationRole = ({ location: { search }, entity, identity, valueVMOptions, valueVMTypeOptions }) => {

  // console.log('%%%% Org', window.pretty(entity));
  const { action = 'display' } = qs.parse(search, { ignoreQueryPrefix: true });

  const roleList = () => {
    const { customProperties } = entity;
    const index = customProperties.findIndex(({ tail: { name } }) => name === 'Roles');
    const roles = customProperties[index];
    // debug('$$$$ ROLES', window.pretty(roles));
    return (
      roles.length === 0 ? 'none' :
        (<PropertyContent
          relationshipToPropertyContent={{ ...roles }}
          action={action}
          onChange={() => {}}
          valueVMOptions={valueVMOptions}
          valueVMTypeOptions={valueVMTypeOptions}
        />)
    );
  };

  return (
    <Scrollbar>
      <div className="col-sm-12 nopadding">
        <IdentityHeader identity={identity} location={location} />
        <div>{roleList()}</div>
      </div>
    </Scrollbar>
  );
};

ApplicationRole.propTypes = {
  location: PropTypes.object.isRequired,
  entity: PropTypes.object.isRequired,
  identity: PropTypes.object.isRequired,
  valueVMOptions: PropTypes.object.isRequired,
  valueVMTypeOptions: PropTypes.object.isRequired,
};

export default createFragmentContainer(ApplicationRole, {
  entity: graphql`
    fragment ApplicationRole_entity on Entity {
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
    fragment ApplicationRole_identity on Identity {
      ...IdentityHeader_identity
    }
  `,
  valueVMOptions: graphql`
    fragment ApplicationRole_valueVMOptions on ValueVMOptions {
      ...PropertyContent_valueVMOptions
    }
  `,
  valueVMTypeOptions: graphql`
    fragment ApplicationRole_valueVMTypeOptions on ValueVMTypeOptions {
      ...PropertyContent_valueVMTypeOptions
    }
  `,
});
