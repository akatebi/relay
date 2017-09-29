import PropTypes from 'prop-types';
import React from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';
import EntityLink from '../../component/entities/EntityLink';

const SubTree = ({ subtreeItem, location }) => {
  const { indent, entityVM } = subtreeItem;
  return (
    <div className="row">
      <div style={{ marginLeft: indent * 50 }}>
        <EntityLink entityVM={entityVM} location={location} />
      </div>
    </div>
  );
};

SubTree.propTypes = {
  location: PropTypes.object.isRequired,
  subtreeItem: PropTypes.object.isRequired,
};

export default createFragmentContainer(SubTree, {
  subtreeItem: graphql`
    fragment SubTree_subtreeItem on SubTreeItem {
      indent
      entityVM {
        ...EntityLink_entityVM
      }
    }
  `,
});
