import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import { Tab, Nav, NavItem, Row, Col } from 'react-bootstrap';
import { Route } from 'react-router-dom';
import clone from 'clone';
import Toolbar from '../base/Toolbar';
import { isRevisionable } from '../../../share/entityRouteMaps';

// const debug = require('debug')('app:component:profiles:ProfileNav');

class ProfileNav extends Component {

  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    profileNav: PropTypes.object.isRequired,
  }

  componentWillMount = () => {
    const { profileNav: { navLinks: origLinks } } = this.props;
    const cleanLinks = this.cleanNavLinks(origLinks);
    this.setState({ cleanLinks });
  }

  getPathname = (activeKey) => {
    const { location: { pathname } } = this.props;
    const pathArray = pathname.split('/');
    const entity = pathArray[1];
    const postFix = this.state.cleanLinks[activeKey].url;
    let path;
    if (isRevisionable(entity)) {
      path = pathArray.slice(1, 4).join('/');
    } else {
      path = pathArray.slice(1, 3).join('/');
    }
    const newPath = `/${path}/${postFix}`;
    return newPath;
  };

  pushPath = (activeKey) => {
    const pathname = this.getPathname(activeKey);
    const { history, location: { search } } = this.props;
    history.push({ pathname, search });
  };

  cleanNavLinks = (links) => {
    const clonedLinks = clone(links);
    let idx = clonedLinks.findIndex(link => link.url.includes('characteristics'));
    if (idx >= 0) {
      clonedLinks.splice(idx, 1);
    }
    idx = clonedLinks.findIndex(link => link.url.includes('lifecycles'));
    if (idx >= 0) {
      clonedLinks.splice(idx, 1);
    }
    return clonedLinks;
  };

  render() {

    const { match, location: { pathname: subPath } } = this.props;
    const { cleanLinks } = this.state;
    const item = cleanLinks.find(item => new RegExp(`/${item.url}$`).test(subPath));
    const activeKey = cleanLinks.indexOf(item);

    return (
      <div className="profileNav nopadding">
        <div className="col-sm-3 nopadding">
          <Tab.Container
            id="Document navigator"
            activeKey={activeKey}
            onSelect={this.pushPath}
          >
            <Row className="clearfix">
              <Col className="col-sm-12 nopadding">
                <Nav bsStyle="pills" stacked>
                  {cleanLinks.map((navLink, i) =>
                    (<NavItem
                      href={this.getPathname(i)}
                      key={i}
                      eventKey={i}
                      style={{ fontSize: 13 }}
                    >
                      {navLink.label}
                    </NavItem>))}
                </Nav>
              </Col>
            </Row>
          </Tab.Container>
        </div>
        <div className="col-sm-9 leftpadding">
          <Route path={match.url} render={props => <Toolbar params={match.params} {...props} />} />
        </div>
      </div>
    );
  }
}

export default createFragmentContainer(ProfileNav, {
  profileNav: graphql`
    fragment ProfileNav_profileNav on ProfileNav {
      navLinks {
        label
        url
      }
    }
  `,
});
