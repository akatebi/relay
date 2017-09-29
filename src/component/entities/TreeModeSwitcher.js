import PropTypes from 'prop-types';
import React from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';
import qs from 'qs';
import ManageTree from './ManageTree';
import ManageList from './ManageList';
import NestedAndFlat from './NestedAndFlat';

// const debug = require('debug')('entities.TreeModeSwitcher:component');

const TreeModeSwitcher = ({
  location: { search },
  identity,
  entityOptionLookups,
  flat,
  nested,
  entity: { entityType },
  basePath,
}) => {
  const { action = 'display' } = qs.parse(search, { ignoreQueryPrefix: true });
  return (
    <div>
      { (entityType === 'CategoryHierarchy' || entityType === 'OrganizationHierarchy') &&
        <ManageTree
          action={action}
          entityType={entityType}
          entityOptionLookups={entityOptionLookups}
          identity={identity}
          location={location}
          nested={nested}
          basePath={basePath}
        />
      }
      { action === 'edit' && entityType === 'ChoiceList' &&
        <ManageList
          identity={identity}
          location={location}
          flat={flat}
          entityType={entityType}
          entityOptionLookups={entityOptionLookups}
        />
      }
      { action !== 'edit' &&
        <NestedAndFlat
          identity={identity}
          history={history}
          location={location}
          nested={nested}
          flat={flat}
        />
      }
    </div>
  );
};

TreeModeSwitcher.propTypes = {
  entity: PropTypes.object.isRequired,
  entityOptionLookups: PropTypes.object.isRequired,
  flat: PropTypes.object.isRequired,
  identity: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  nested: PropTypes.object,
  basePath: PropTypes.string.isRequired,
};


export default createFragmentContainer(TreeModeSwitcher, {
  entity: graphql`
    fragment TreeModeSwitcher_entity on Entity {
      id
      entityType
    }
  `,
  entityOptionLookups: graphql`
    fragment TreeModeSwitcher_entityOptionLookups on EntityOptionLookups {
      ...ManageList_entityOptionLookups
      ...ManageTree_entityOptionLookups
    }
  `,
  identity: graphql`
    fragment TreeModeSwitcher_identity on Identity {
      ...NestedAndFlat_identity
      ...ManageList_identity
      ...ManageTree_identity
    }
  `,
  flat: graphql`
    fragment TreeModeSwitcher_flat on FlatNode {
      nodes {
        id
        label
      }
      ...ManageList_flat
      ...NestedAndFlat_flat
    }
  `,
  nested: graphql`
    fragment TreeModeSwitcher_nested on NestedNodes {
      ...NestedAndFlat_nested
      ...ManageTree_nested
    }
  `,
});
