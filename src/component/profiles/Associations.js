import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';
import React from 'react';
import SubHeader from './SubHeader';
import EntityLink from '../entities/EntityLink';

const Associations = ({ associations, location }) => {
  if (!associations.list.length) {
    return (
      <div>
        <SubHeader label="Associations" />
        <div
          className="property-value"
          style={{ paddingLeft: '24px' }}
        >None
        </div>
      </div>
    );
  }
  return (
    <div>
      <SubHeader label="Associations" />
      <ul style={{ listStyle: 'none', paddingLeft: 24 }}>
        {associations.list.map((assoc, i) =>
          (<div key={i}>
            <EntityLink
              location={location}
              entityVM={assoc}
            />
          </div>))}
      </ul>
    </div>
  );
};

Associations.propTypes = {
  associations: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default createFragmentContainer(Associations, {
  associations: graphql`
    fragment Associations_associations on Associations {
      list {
        ...EntityLink_entityVM
      }
    }
  `,
});
