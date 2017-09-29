import PropTypes from 'prop-types';
import React from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';
import D3Tree from './D3Tree';
import Scrollbar from '../Scrollbar';

// const debug = require('debug')('EntityTree:component');

const EntityTree = ({ entityTree, location }) => {

  // const onClose = (evt) => {
  //   evt.preventDefault();
  //   const { pathname } = location;
  //   const path = pathname.replace(/nested$/, 'flat');
  //   history.push(path);
  // };

  const getTree = children =>
    children.map(({ name, children }) =>
      ({ name, children: getTree(children) }));

  const entityType = () => {
    const paths = {
      categoryhierarchies: 'Category Hierarchy',
      choicelists: 'Choice List',
      organizationhierarchies: 'Organization Hierarchy',
    };
    const key = Object.keys(paths).find(x =>
      new RegExp(x).test(location.pathname));
    return key ? paths[key] : '';
  };

  const tree = getTree([entityTree]);
  if (!tree[0]) return false;
  // const style = { cursor: 'pointer' };
  return (
    <Scrollbar>
      <div className="col-sm-12">
        <div className="entity-label">{entityType()}</div>
        {/* <button className="pull-right" onClick={this.onClose} data-toggle="tooltip" title="Close">
          <span className="glyphicon glyphicon-remove text-primary" style={style} />
        </button>  */}
        <br />
        <D3Tree data={tree} />
      </div>
    </Scrollbar>
  );
};

EntityTree.propTypes = {
  entityTree: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};


export default createFragmentContainer(EntityTree, {
  entityTree: graphql`
    fragment EntityTree_entityTree on EntityTree {
        name,
        children {
          name
          children {
            name
            children {
              name
              children {
                name
                children {
                  name
                  children {
                    name
                    children {
                      name
                      children {
                        name
                        children {
                          name
                          children {
                            name
                            children {
                              name
                              children {
                                name
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
    }
  `,
});
