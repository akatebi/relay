import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import Alert from 'react-s-alert';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Link, Route } from 'react-router-dom';
import { RoutePrv } from '../route';
// Components
import Auth from './base/Auth';
import Home from '../component/Home';
import Create from './base/newPage/Create';
import Cultures from './base/Cultures';
import Dashboard from './base/Dashboard';
// import GraphiQL from '../component/GraphiQL';
import Org from './base/newPage/Org';
import ProfileList from './base/profiles/ProfileList';
import ProfileNav from './base/profiles/ProfileNav';
import UserIdentity from './UserIdentity';
import Themes from './Themes';
import Admin from './Admin';
import Config from './Config';
import Content from './Content';
import { appName } from '../constant/app';
import { EntityTypes } from '../../share/entityTypes';
import { getEntityUrl } from '../../share/entityRouteMaps';

const debug = require('debug')('app:component:NavMenu');

class NavMenu extends Component {

  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    viewer: PropTypes.object,
  }

  static childContextTypes = {
    onEntityLinkPop: PropTypes.func.isRequired,
    onEntityLinkPush: PropTypes.func.isRequired,
  }

  getChildContext() {
    const {
      onEntityLinkPop,
      onEntityLinkPush,
    } = this;
    return {
      onEntityLinkPop,
      onEntityLinkPush,
    };
  }

  onEntityLinkPush = () => {
    const { history: { location } } = this.props;
    if (!this.entityLocation.find(({ pathname }) => location.pathname === pathname)) {
      this.entityLocation.push(location);
      debug('onEntityLinkPush', location.pathname, this.entityLocation.length);
    }
  }

  onEntityLinkPop = () => {
    const location = this.entityLocation.pop();
    debug('onEntityLinkPop', location, this.entityLocation.length);
    return location || { pathname: '/' };
  }

  pushHistory = (pathname, evt) => {
    debug(pathname);
    evt.preventDefault();
    const { history } = this.props;
    history.push(pathname);
  };

  entityLocation = [];

  render() {

    const { history, location, viewer } = this.props;
    return (
      <div className="container-fluid qms">
        <UserIdentity viewer={viewer} location={location} history={history} />
        {/* <Favicon url={favImage} /> */}
        <Navbar fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/dashboard">{appName}</Link>
            </Navbar.Brand>
          </Navbar.Header>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav>
              <NavItem eventKey={1} href="/create">
                <div onClick={this.pushHistory.bind(this, '/create')} className="profileLink">New</div>
              </NavItem>
            </Nav>
            <Nav>
              <Config eventKey={2} history={history} />
            </Nav>
            <Nav>
              <Content eventKey={3} history={history} />
            </Nav>
            <Nav>
              <Admin eventKey={4} history={history} />
            </Nav>
            <Nav pullRight>
              <NavItem eventKey={5} href={viewer ? '/signout' : '/signin'} >
                <div
                  onClick={(evt) => {
                    evt.preventDefault();
                    history.push(viewer ? '/signout' : '/signin');
                  }}
                  style={{ color: 'white' }}
                >
                  {viewer ? 'Sign Out' : 'Sign In'}
                </div>
              </NavItem>
              <Themes eventKey={6} />
              <NavItem eventKey={7} href="#/graphiql" >
                <div onClick={this.pushHistory.bind(this, '/graphiql')} className="profileLink">API</div>
              </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className="row">
          <Route exact path="/" render={Home} />
          <Route path="/signin" render={Auth} />
          <Route path="/signout" render={Auth} />
          <RoutePrv path="/create" render={Create} />
          <RoutePrv path="/cultures" render={Cultures} />
          <RoutePrv path="/dashboard" render={Dashboard} />
          <RoutePrv path="/newpage/:entityRoute" render={Org} />
          {EntityTypes.map(entity => (
            <div key={entity}>
              <RoutePrv exact path={`/${getEntityUrl(entity)}`} render={ProfileList} />
              <RoutePrv path={`/${getEntityUrl(entity)}/:docId`} render={ProfileNav} />
            </div>
          ))}
          {/* <Route path="graphiql" component={GraphiQL} /> */}
        </div>
        <Alert stack={{ limit: 3 }} />
      </div>
    );
  }
}

export default createFragmentContainer(NavMenu, {
  viewer: graphql`
    fragment NavMenu_viewer on Viewer {
      ...UserIdentity_viewer
    }
  `,
});
