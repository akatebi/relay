import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';
import Tree from 'react-ui-tree';
import { Button, ButtonGroup, ButtonToolbar } from 'react-bootstrap';
import Select from 'react-select';
import clone from 'clone';
import equal from 'deep-equal';
import classNames from 'classnames';
import { entityTypeToTreeNodeTypeMap } from '../../../share/entityRouteMaps';
import { entityListLabels } from '../../../share/entityTypes';
import Scrollbar from '../Scrollbar';
import IdentityHeader from '../profiles/IdentityHeader';
import { nestedMutation } from './mutation/nested';
import { successAlert, errorAlert } from '../../service/alert';

const debug = require('debug')('app:component:entities:ManageTree');

class ManageTree extends Component {

  static propTypes = {
    action: PropTypes.string,
    entityOptionLookups: PropTypes.object.isRequired,
    entityType: PropTypes.string.isRequired,
    identity: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    nested: PropTypes.object.isRequired,
    basePath: PropTypes.string.isRequired,
    relay: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  componentWillMount() {
    this.updateTree();
  }

  componentWillReceiveProps({ action }) {
    if (action !== this.props.action) {
      if (action === 'save') {
        const { tree, orig } = this.state;
        if (!equal(tree, orig)) {
          debug('saving...', this.props.relay);
          const nested = tree && this.tree2Nested(tree);
          // debug('nested', window.pretty(nested));
          const { relay: { environment }, basePath } = this.props;
          nestedMutation(
            environment,
            { nested, basePath },
            (response) => {
              debug('onCompleted', response);
              successAlert('Entity saved!');
              // this.updateTree();
            },
            (error) => {
              debug('onError', error);
              errorAlert('Entity not saved!');
            },
          );
        }
      } else if (action === 'display') {
        const { orig } = this.state;
        this.setState({ tree: orig, active: orig });
      }
    }
  }

  getPlaceholder = () => {
    const { entityType } = this.props;
    const entityNodeType = entityTypeToTreeNodeTypeMap(entityType);
    const label = entityListLabels[entityNodeType];
    return `select ${label} ...`;
  };

  adjustOption = (options, { nodeObj: { id }, children }) => {
    const index = options.findIndex(({ id: optionId }) => id === optionId);
    options.splice(index, 1);
    children.forEach(child => this.adjustOption(options, child));
  }

  updateTree = () => {
    const { entityOptionLookups: { options }, nested } = this.props;
    const tree = this.nested2Tree(nested.nodes);
    const orig = clone(tree);
    const entityOptions = clone(options);
    this.adjustOption(entityOptions, tree);
    const depth = this.calcDepth(tree);
    debug('depth', depth);
    this.setState({ entityOptions, orig, tree, active: tree, depth });
  }

  nestedList = () => {
    const { tree } = this.state;
    if (tree) {
      return (
        <div className="ui_tree">
          <Tree
            paddingLeft={20}
            tree={tree}
            onChange={tree => this.setState({ tree })}
            renderNode={this.renderNode}
          />
        </div>);
    }
    return <div className="value-md">- no root node -</div>;
  };

  tree2Nested = ({ nodeObj, children }) => ({
    nodeObj: { ...nodeObj, id: nodeObj.id.slice(0, 36), cultureCode: 'cc' },
    children: children.map(node => this.tree2Nested(node)),
  });

  pluralLabel = () => {
    const { entityType } = this.props;
    const entityNodeType = entityTypeToTreeNodeTypeMap(entityType);
    const label = entityListLabels[entityNodeType];
    return label;
  };

  entityLookup = () => {
    const placeholder = this.getPlaceholder();
    const { selectedOption } = this.state;
    // debug('selectedOption', window.pretty(selectedOption));
    const props = {
      placeholder,
      autosize: false,
      autofocus: true,
      disabled: false,
      value: selectedOption,
      options: this.state.entityOptions,
      onChange: selectedOption => this.setState({ selectedOption }),
    };
    return (
      <div>
        <div className="header-label">{this.pluralLabel()}</div>
        <Select {...props} className="select-primary-color" />
      </div>
    );
  };

  removeOption = (optionId) => {
    const { entityOptions } = this.state;
    const index = entityOptions.findIndex(({ id }) => id === optionId);
    entityOptions.splice(index, 1);
    const depth = this.calcDepth();
    debug('depth', depth);
    this.setState({ entityOptions, depth });
  }

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

  removeNode = (node, active) => {
    if (node === active) {
      return true;
    }
    let index = -1;
    node.children.forEach((child, i) => {
      if (this.removeNode(child, active)) {
        index = i;
      }
    });
    if (index !== -1) {
      node.children.splice(index, 1);
    }
    return false;
  };

  addNode = () => {
    const { selectedOption, active, tree } = this.state;
    const node = this.nested2Tree({ nodeObj: selectedOption, children: [] });
    if (active) {
      active.children.push(node);
      this.setState({ tree, selectedOption: null });
    } else {
      this.setState({ tree: node, active: node, selectedOption: null });
    }
    this.removeOption(selectedOption.id);
  }

  findParent = (node, active) => {
    if (node.children.find(child => active === child)) {
      const index = node.children.findIndex(({ nodeObj: { id } }) => id === active.nodeObj.id);
      return { parent: node, index };
    }
    const parents = node.children.map(child => this.findParent(child, active));
    return parents.find(parent => parent);
  }

  insertNode = () => {
    const { tree, selectedOption, active } = this.state;
    const node = this.nested2Tree({ nodeObj: selectedOption, children: [] });
    if (active === tree) {
      node.children.push(tree);
      this.setState({ tree: node });
    } else {
      const { parent, index } = this.findParent(tree, active);
      debug('parent', parent.module, index);
      node.children.push(active);
      parent.children.splice(index, 1, node);
      this.setState({ tree: this.state.tree });
    }
    this.setState({ selectedOption: null });
    this.removeOption(selectedOption.id);
  }

  toolbar = () => {
    const addButton = (
      <Button
        bsStyle="primary"
        style={{ borderRadius: '12px', margin: '2px' }}
        onClick={this.addNode}
      >Add
      </Button>
    );
    const insertButton = (
      <Button
        bsStyle="primary"
        style={{ borderRadius: '12px', margin: '2px' }}
        onClick={this.insertNode}
      >Insert
      </Button>
    );
    const removeButton = (
      <Button
        bsStyle="primary"
        style={{ borderRadius: '12px', margin: '2px' }}
        onClick={() => {
          const { active, tree } = this.state;
          const { parent } = this.findParent(tree, active) || {};
          if (this.removeNode(tree, active)) {
            this.setState({ tree: null, active: null });
          } else {
            const active = parent.children[0] || parent;
            this.setState({ tree, active });
          }
        }}
      >Remove
      </Button>
    );
    return (<div>
      <ButtonToolbar>
        <ButtonGroup bsSize="xsmall">
          {this.state.selectedOption && addButton}
          {this.state.selectedOption &&
            this.state.depth < 9 &&
            this.state.tree && insertButton}
          {this.state.tree && removeButton}
        </ButtonGroup>
      </ButtonToolbar>
      <br />
    </div>);
  };

  calcDepth = (node = this.state.tree) => {
    const map = node.children.map(child => this.calcDepth(child));
    return map.length ? Math.max(...map) + 1 : 1;
  };

  renderNode = node => (
    <div style={{ margin: '3px' }}>
      <span
        className={classNames('node', { 'is-active': node === this.state.active })}
        onClick={() => this.setState({ active: node })}
      >
        <i className="fa fa-minus">&nbsp;</i>
        {`${node.module}`}
      </span>
    </div>
  );

  render() {
    const { identity, action, location } = this.props;
    if (action === 'edit') {
      return (
        <Scrollbar>
          <div>
            <div className="row">
              <IdentityHeader identity={identity} location={location} />
            </div>

            <div className="row">
              <div className="col-sm-12">
              </div>
            </div>

            <div className="row">
              <div className="col-sm-6">
                <div>{this.nestedList()}</div>
              </div>
              <div className="col-sm-6">
                <div>{this.toolbar()}</div>
                <div>{this.entityLookup()}</div>
              </div>
            </div>
          </div>
        </Scrollbar>
      );
    }
    return false;
  }
}

export default createFragmentContainer(ManageTree, {
  entityOptionLookups: graphql`
    fragment ManageTree_entityOptionLookups on EntityOptionLookups {
      options {
        id
        cultureCode
        entityType
        familyId
        isFamily
        label
        operation
        reportingKey
      }
    }
  `,
  identity: graphql`
    fragment ManageTree_identity on Identity {
      ...IdentityHeader_identity
    }
  `,
  nested: graphql`
    fragment ManageTree_nested on NestedNodes {
      nodes {
        nodeObj {
          familyId
          isFamily
          cultureCode
          id
          reportingKey
          entityType
          label
          operation
        }
        children {
          nodeObj {
            familyId
            isFamily
            cultureCode
            id
            reportingKey
            entityType
            label
            operation
          }
          children {
            nodeObj {
              familyId
              isFamily
              cultureCode
              id
              reportingKey
              entityType
              label
              operation
            }
            children {
              nodeObj {
                familyId
                isFamily
                cultureCode
                id
                reportingKey
                entityType
                label
                operation
              }
              children {
                nodeObj {
                  familyId
                  isFamily
                  cultureCode
                  id
                  reportingKey
                  entityType
                  label
                  operation
                }
                nodeObj {
                  familyId
                  isFamily
                  cultureCode
                  id
                  reportingKey
                  entityType
                  label
                  operation
                }
                children {
                  nodeObj {
                    familyId
                    isFamily
                    cultureCode
                    id
                    reportingKey
                    entityType
                    label
                    operation
                  }
                  children {
                    nodeObj {
                      familyId
                      isFamily
                      cultureCode
                      id
                      reportingKey
                      entityType
                      label
                      operation
                    }
                    children {
                      nodeObj {
                        familyId
                        isFamily
                        cultureCode
                        id
                        reportingKey
                        entityType
                        label
                        operation
                      }
                      children {
                        nodeObj {
                          familyId
                          isFamily
                          cultureCode
                          id
                          reportingKey
                          entityType
                          label
                          operation
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
