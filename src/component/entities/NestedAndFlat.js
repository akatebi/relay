import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';
import clone from 'clone';
import Tree from 'react-ui-tree';
import classNames from 'classnames';
import Scrollbar from '../Scrollbar';
import EntityLink from './EntityLink';
import IdentityHeader from '../profiles/IdentityHeader';
import { entityRevRouteMap } from '../../../share/entityRouteMaps';
import { normalize } from '../profiles/normalize';

// const debug = require('debug')('entities.NestedAndFlat:component');

class NestedAndFlat extends Component {

  static propTypes = {
    nested: PropTypes.object,
    flat: PropTypes.object.isRequired,
    identity: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  };

  onClickNode = node => window.log(node);

  linkUrl = node => `/${entityRevRouteMap(node.entityType)}/${node.id}/identity`;

  clean = (entityVM) => {
    const newObj = normalize(entityVM);
    newObj.id = entityVM.id.slice(0, 36);
    return newObj;
  };

  nested2Tree = ({ nodeObj, children = [] }) => {
    const { label: module } = nodeObj;
    return {
      module,
      collapsed: false,
      leaf: children.length === 0,
      children: children.map(node => this.nested2Tree(node)),
      nodeObj,
    };
  };

  nestedList = () => {
    if (!this.props.nested) return <div />;
    const { nested: { nodes } } = this.props;
    return (
      <div className="col-sm-5">
        <div className="header-label">&nbsp;&nbsp;&nbsp;Nested</div>
        <div className="ui_tree">
          { nodes &&
            <Tree
              paddingLeft={20}
              tree={this.nested2Tree(nodes)}
              draggable={false}
              renderNode={this.renderNode}
            />}
          { !nodes &&
            <div className="value-md">- no root node -</div>}
        </div>
      </div>);
  };

  flatList = () => {
    const { flat: { nodes = [] } = {}, location } = this.props;
    const list = clone(nodes);
    const sortedList = list.sort((a, b) => a.label.localeCompare(b.label));
    return (
      <div className="col-sm-5">
        <div className="header-label">Flat</div>
        { sortedList.map((entityVM, i) =>
          (<div key={i}>
            <EntityLink entityVM={entityVM} location={location} />
          </div>))
        }
      </div>
    );
  };

  choiceList = () => {
    const { flat: { nodes = [] } = {}, location } = this.props;
    const list = nodes;
    const parent = list[0];
    if (!parent) {
      return (
        <div className="col-sm-10">
          <div className="value-md">- no root node -</div>
        </div>);
    }
    const sortedList = list.slice(1).sort((a, b) => a.label.localeCompare(b.label));

    return (
      <div className="col-sm-10">
        <div className="header-label">{parent.label}</div>
        <ul>
          { sortedList.map((entityVM, i) =>
            (<li key={i}>
              <EntityLink entityVM={entityVM} location={location} />
            </li>))
          }
        </ul>
      </div>
    );
  };

  renderNode = ({ nodeObj: entityVM } = {}) => (
    <span className={classNames('node', { 'is-active': entityVM === null })}>
      <EntityLink entityVM={entityVM} location={this.props.location} />
    </span>
  );

  render() {
    const { nested, identity } = this.props;

    return (
      <Scrollbar>
        <div>
          <div className="row">
            <IdentityHeader identity={identity} location={location} />
          </div>

          <div className="row">
            <div>
              <div>{this.nestedList()}</div>
            </div>

            <div>
              { nested ? <div>{this.flatList()}</div> : <div>{this.choiceList()}</div>}
            </div>
          </div>
        </div>
      </Scrollbar>
    );
  }
}

export default createFragmentContainer(NestedAndFlat, {
  flat: graphql`
    fragment NestedAndFlat_flat on FlatNode {
      nodes {
        id
        label
        cultureCode
        entityType
        familyId
        isFamily
        operation
        reportingKey
        ...EntityLink_entityVM
      }
    }
  `,
  identity: graphql`
    fragment NestedAndFlat_identity on Identity {
      ...IdentityHeader_identity
    }
  `,
  nested: graphql`
    fragment NestedAndFlat_nested on NestedNodes {
      nodes @skip(if: $flatOnly) {
        nodeObj {
          ...EntityLink_entityVM
        }
        children {
          nodeObj {
            ...EntityLink_entityVM
          }
          children {
            nodeObj {
              ...EntityLink_entityVM
            }
            children {
              nodeObj {
                ...EntityLink_entityVM
              }
              children {
                nodeObj {
                  ...EntityLink_entityVM
                }
                children {
                  nodeObj {
                    ...EntityLink_entityVM
                  }
                  children {
                    nodeObj {
                      ...EntityLink_entityVM
                    }
                    children {
                      nodeObj {
                        ...EntityLink_entityVM
                      }
                      children {
                        nodeObj {
                          ...EntityLink_entityVM
                        }
                        children {
                          nodeObj {
                            ...EntityLink_entityVM
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
