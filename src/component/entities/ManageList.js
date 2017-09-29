import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';
import { Button, ButtonGroup, ButtonToolbar, Nav, NavItem }
  from 'react-bootstrap';
import Select from 'react-select';
import clone from 'clone';
import classNames from 'classnames';
import { entityTypeToTreeNodeTypeMap, getEntityLabelByType }
  from '../../../share/entityRouteMaps';
import { entityListLabels } from '../../../share/entityTypes';
import Scrollbar from '../Scrollbar';
import IdentityHeader from '../profiles/IdentityHeader';

// const debug = require('debug')('app:entities.ManageList:component');

class ManageList extends Component {

  static propTypes = {
    flat: PropTypes.object,
    entityOptionLookups: PropTypes.object.isRequired,
    entityType: PropTypes.string.isRequired,
    identity: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  };

  componentWillMount() {
    const { flat, entityType } = this.props;
    const entityNodeType = entityTypeToTreeNodeTypeMap(entityType);
    // debug('>>> flat', window.pretty(flat.nodes));
    this.setState({ flatList: flat.nodes, entityNodeType });
    // debug('>>> flatList', window.pretty(flat.nodes[0]));
    const { entityOptionLookups: { options } } = this.props;
    const newOptions = options.map(option => ({ value: option.id, ...option }));
    this.setState({ entityOptions: newOptions });
  }

  getPlaceholder = () => {
    const { entityNodeType } = this.state;
    const label = getEntityLabelByType(entityNodeType);
    return `select ${label} ...`;
  };

  pluralLabel = () => {
    const { entityNodeType } = this.state;
    const label = entityListLabels[entityNodeType];
    return label;
  };

  entityLookup = () => {
    const placeholder = this.getPlaceholder();
    // console.log('>>> entityOptionLookups', window.pretty(this.state.entityOptions));
    const props = {
      placeholder,
      autosize: false,
      autofocus: true,
      disabled: false,
      value: this.state.selectedEntity,
      options: this.state.entityOptions,
      onChange: ({ value: id, label }) => {
        this.selectedValue({ id, label }, 'onChange');
      },
    };

    return (
      <div>
        <div className="header-label">{this.pluralLabel()}</div>
        <Select {...props} className="select-primary-color" />
      </div>
    );
  };

  selectedValue = (value = {}) => {
    // console.log('selectedValue:', value);
    this.setState({ selectedEntity: value });
  }

  removeEntityFromList = (idToRemove) => {
    const { entityOptions } = this.state;
    // console.log('entityOptions', window.pretty(entityOptions));
    const index = entityOptions.findIndex(entry => entry.value === idToRemove);
    // debug('removeEntityFromList', idToRemove, index);
    entityOptions.splice(index, 1);
    this.setState({ entityOptions, selectedEntity: null });
  };

  idsToRemove = [];

  findExistingEntities = (node) => {
    // debug(node.module);
    this.idsToRemove.push(node.entityVM.id);
    if (node.children) {
      node.children.forEach(child => this.findExistingEntities(child));
    }
  };

  selectChoice = (id, evt) => {
    evt.preventDefault();
    // console.log('CHOICE', id);
    this.setState({ active: id });
  };

  choiceList = () => {
    const { flatList } = this.state;
    const parent = flatList[0];
    if (!parent) {
      return (
        <div className="col-sm-10 ui_tree">
          <div className="value-md">- no root node -</div>
        </div>);
    }
    const sortedList = flatList.slice(1).sort((a, b) => a.label.localeCompare(b.label));

    return (
      <div className="col-sm-10">
        <div className="header-label">{parent.label}</div>
        <Nav bsStyle="pills" stacked >
          { sortedList.map((choice, key) =>
            (<NavItem
              key={key}
              eventKey={choice.id}
              href={''}
              className={classNames('node', { 'is-active': choice === this.state.active })}
              onClick={this.selectChoice.bind(this, choice.id)}
            >
              {choice.label}
            </NavItem>),
          )}
        </Nav>
      </div>
    );
  };

  add = () => {
    const { flatList } = this.state;
    const { selectedEntity } = this.state;
    // console.log('add', window.pretty(selectedEntity));
    const newItem = [({ id: selectedEntity.id, label: selectedEntity.label })];
    const newList = [...flatList, ...newItem];
    // newList.forEach(item => console.log('ITEM', item.label));
    this.setState({ flatList: newList });
    this.removeEntityFromList(selectedEntity.id);
  };

  removeChoice = () => {
    const { flatList, active } = this.state;
    // debug('removeChoice active', active);
    const index = flatList.findIndex(choice => choice.id === active);
    const newList = clone(flatList);
    newList.splice(index, 1);
    this.setState({ flatList: newList });
    this.setState({ active: null });
  };

  toolbar = () => {
    const { active, entityOptions, selectedEntity } = this.state;
    let disabledAdd = false;
    if (!selectedEntity) {
      disabledAdd = true;
    }
    let disabledRemove = false;
    if (!active) {
      disabledRemove = true;
    }
    const buttonList = [];
    if (entityOptions) {
      buttonList.push(
        <Button
          bsStyle="primary"
          disabled={disabledAdd}
          style={{ borderRadius: '12px', margin: '2px' }}
          key="_list1"
          onClick={this.add}
        >Add
        </Button>);
      buttonList.push(
        <Button
          bsStyle="primary"
          disabled={disabledRemove}
          style={{ borderRadius: '12px', margin: '2px' }}
          key="_list2"
          onClick={this.removeChoice}
        >Remove
        </Button>);
    }
    return (<div>
      <ButtonToolbar>
        <ButtonGroup bsSize="xsmall">{buttonList}</ButtonGroup>
      </ButtonToolbar>
      <br />
    </div>);
  };

  render() {
    const { identity, location } = this.props;

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
              <div>{this.choiceList()}</div>
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
}

export default createFragmentContainer(ManageList, {
  identity: graphql`
    fragment ManageList_identity on Identity {
      ...IdentityHeader_identity
    }
  `,
  entityOptionLookups: graphql`
    fragment ManageList_entityOptionLookups on EntityOptionLookups {
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
  flat: graphql`
    fragment ManageList_flat on FlatNode {
      nodes {
        id
        label
      }
    }
  `,
});
