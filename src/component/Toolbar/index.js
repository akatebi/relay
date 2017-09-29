import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import classNames from 'classnames';
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import qs from 'qs';
import { Route, Switch } from 'react-router-dom';
import Config from '../base/profiles/PropertyConfigs';
import EntityTree from '../base/entities/EntityTree';
// import Customs from '../base/profiles/Customs';
import ApplicationRole from '../base/entities/ApplicationRole';
import ApprovalCycleConfig from '../base/entities/ApprovalCycleConfig';
import AssociationConfig from '../base/entities/AssociationConfig';
import CharacteristicConfig from '../base/entities/CharacteristicConfig';
import Identity from '../base/profiles/Identity';
import LifeCycleConfig from '../base/entities/LifeCycleConfig';
import LineItemConfig from '../base/entities/LineItemConfig';
import Organization from '../base/entities/Organization';
import { Save } from './Save';
import Scrollbar from '../Scrollbar';
import Section from '../base/profiles/Section';
import SectionsAll from '../base/profiles/SectionsAll';
import SectionConfig from '../base/entities/SectionConfig';
import Spinner from '../base/Spinner';
import SubWiz from '../../component/SubWiz';
import TemplateLayout from '../base/entities/TemplateLayout';
import TreeModeSwitcher from '../base/entities/TreeModeSwitcher';
import User from '../base/entities/User';

const debug = require('debug')('app:component:Toolbar');

class Toolbar extends Component {

  static propTypes = {
    approvalCycleToolbar: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    toolbar: PropTypes.object.isRequired,
    //////////////////////////////////////////////////
    identity: PropTypes.object.isRequired,
    lockStatus: PropTypes.object.isRequired,
    relay: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    variables: PropTypes.object.isRequired,
  };

  static contextTypes = {
    onEntityLinkPop: PropTypes.func.isRequired,
  }

  static childContextTypes = {
    onChangeField: PropTypes.func.isRequired,
    onChangeConfig: PropTypes.func.isRequired,
    onChangeContent: PropTypes.func.isRequired,
  }

  state = {};

  getChildContext() {
    const {
      onChangeField,
      onChangeConfig,
      onChangeContent,
    } = this.save;
    return {
      onChangeField,
      onChangeConfig,
      onChangeContent,
    };
  }

  componentWillMount() {
    const { history, identity, location, lockStatus, params, relay, variables } = this.props;
    this.save = new Save(this, { history, identity, location, lockStatus, params, relay, variables });

    const { standardProperties } = identity;
    const revState = standardProperties.find(({ name }) => name === 'Rev_State');
    if (revState.valueVM === 'New') {
      this.setState({ isNew: true });
    }
  }

  componentWillUpdate(props) {
    this.save.props = props;
  }

  setAction = (action) => {
    debug('action', action);
    const { history, location: { pathname, search } } = this.props;
    const searchObj = qs.parse(search, { ignoreQueryPrefix: true });
    const newSearch = qs.stringify({ ...searchObj, action });
    history.replace({ pathname, search: newSearch });
  }

  buttonClick = (key, evt) => {
    evt.preventDefault();
    if (this.state.mutating) {
      debug('ignoring all button clicks while mutating');
      return;
    }
    const { params: { docId } } = this.props;
    debug('buttonClick', key, docId);
    switch (key) {
      case 'btn_approve':
        this.save.processApprove(docId);
        break;
      case 'btn_archive':
        this.save.processArchive(docId);
        break;
      case 'btn_cancel':
      {
        this.setAction('unlock');
        this.save.unlock();
        break;
      }
      case 'btn_clearApprovalCycle':
        this.save.processClear();
        break;
      case 'btn_close':
        this.close();
        break;
      case 'btn_edit':
      {
        if (this.state.isNew) {
          this.setAction('edit');
        } else {
          this.setAction('lock');
          this.save.lock();
        }
        break;
      }
      case 'btn_makeCopy':
      {
        this.save.makeCopy();
        break;
      }
      case 'btn_modify':
      {
        this.save.modify();
        break;
      }
      case 'btn_reject':
        this.save.processReject(docId);
        break;
      case 'btn_save':
      {
        this.setAction('save');
        this.save.commit();
        break;
      }
      case 'btn_terminateApprovalCycle':
        this.save.processTerminate();
        break;
      default:
        console.error('Unknown Key', key);
        break;
    }
  }

  close = () => {
    const location = this.context.onEntityLinkPop();
    this.props.history.replace(location);
  }

  render() {
    const {
      history,
      match: { url },
      location: { search },
    } = this.props;
    const {
      toolbar,
      approvalCycleToolbar,
    } = this.props;
    // debug('search', search);
    // combine the lifecycle and approval cycle toolbar buttons
    const { action = 'display' } = qs.parse(search, { ignoreQueryPrefix: true });
    const editMode = action === 'edit';
    let allEditMode = [];
    let allReadMode = [];
    if (approvalCycleToolbar.editMode) {
      allEditMode = toolbar.editMode.concat(approvalCycleToolbar.editMode);
      allReadMode = toolbar.readMode.concat(approvalCycleToolbar.readMode);
    }
    const buttons = editMode ? allEditMode : allReadMode;

    const setClasses = ({ toolbarKey }) =>
      classNames({ 'toolbar-link': true, 'pull-right': toolbarKey === 'btn_close' });

    const navItem = (button, i) =>
      (<NavItem
        key={i}
        eventKey={i}
        href="#"
        onClick={this.buttonClick.bind(this, button.toolbarKey)}
        className={setClasses(button)}
        style={{ fontWeight: 'bold' }}
      >
        {button.toolbarName || 'Modify'}
      </NavItem>);

    const navDropdown = button =>
      (<NavDropdown
        key={button.toolbarName}
        title={button.toolbarName}
        className="toolbar-link"
        id="collapsible-navbar-dropdown"
        style={{ fontWeight: 'bold' }}
      >
        {button.children.map(child =>
          (<MenuItem
            key={child.toolbarKey}
            onSelect={this.save.redirect}
            eventKey={child.toolbarKey}
            className="toolbar-link"
          >
            {child.toolbarName}
          </MenuItem>))}
      </NavDropdown>);

    const style = { margin: 0, padding: 0, marginBottom: 10 };

    return (
      <div>
        <div className="panel panel-default" style={style} >
          <Nav bsStyle="tabs" bsSize="sm" >
            {buttons.map((button, i) =>
              (button.children.length === 0 ?
                navItem(button, i) :
                navDropdown(button, i)))}
          </Nav>
        </div>
        <Scrollbar>
          <div style={{ marginRight: 10, marginLeft: 0 }}>
            <Switch>
              <Route path={`${url}/all`} render={SectionsAll} />
              <Route path={`${url}/configs`} render={Config} />
              <Route path={`${url}/hierarchy/nested`} render={EntityTree} />
              <Route path={`${url}/hierarchy`} render={TreeModeSwitcher} />
              <Route path={`${url}/identity`} render={Identity} />
              <Route path={`${url}/sections/:secId`} render={Section} />
              {/* <Route path={`${url}/submit/:processType`} component={SubWiz} /> */}
              <Route
                path={`${url}/entity`}
                render={(props) => {
                  if (/applicationroles/.test(url)) return <ApplicationRole {...props} />;
                  if (/approvalcycleconfigs/.test(url)) return <ApprovalCycleConfig {...props} />;
                  if (/associationconfigs/.test(url)) return <AssociationConfig {...props} />;
                  if (/characteristicconfigs/.test(url)) return <CharacteristicConfig {...props} />;
                  if (/lifecycleconfigs/.test(url)) return <LifeCycleConfig {...props} />;
                  if (/lineitemconfigs/.test(url)) return <LineItemConfig {...props} />;
                  if (/organizations/.test(url)) return <Organization {...props} />;
                  if (/sectionconfigs/.test(url)) return <SectionConfig {...props} />;
                  if (/templatelayouts/.test(url)) return <TemplateLayout {...props} />;
                  if (/user/.test(url)) return <User {...props} />;
                  // if (/categoryhierarchies|choicelists|dictionaryentries|organizationhierarchies/.test(url)) {
                  return (
                    <div style={{ marginLeft: '20px' }}>
                      Warning - Entity Type Unknown Entity Type
                    </div>
                  );
                }}
              />
            </Switch>
          </div>
        </Scrollbar>
        <SubWiz history={history} location={location} />
        {this.state.mutating && <Spinner />}
      </div>
    );
  }
}

export default createFragmentContainer(Toolbar, {
  approvalCycleToolbar: graphql`
    fragment Toolbar_approvalCycleToolbar on ApprovalCycleToolbar {
      id
      readMode {
        toolbarKey
        toolbarName
        children {
          toolbarKey
          toolbarName
        }
      }
      editMode {
        toolbarKey
        toolbarName
        children {
          toolbarKey
          toolbarName
        }
      }
    }
  `,
  identity: graphql`
    fragment Toolbar_identity on Identity {
      lifeCycle {
        id
        lifeCycleStateContents {
          state
          id
          entityType
        }
      }
      standardProperties {
        name
        label
        valueVM
      }
    }
  `,
  lockStatus: graphql`
    fragment Toolbar_lockStatus on LockStatus {
      id
      isLocked
    }
  `,
  toolbar: graphql`
    fragment Toolbar_toolbar on Toolbar {
      id
      readMode {
        toolbarKey
        toolbarName
        children {
          toolbarKey
          toolbarName
        }
      }
      editMode {
        toolbarKey
        toolbarName
        children {
          toolbarKey
          toolbarName
        }
      }
    }
  `,
});
