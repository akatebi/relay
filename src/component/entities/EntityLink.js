import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import { Link } from 'react-router-dom';
import { entityRevRouteMap, entityFamilyRouteMap }
  from '../../../share/entityRouteMaps';

// const debug = require('debug')('app:component:EntityLink');

class EntityLink extends Component {

  static propTypes = {
    entityVM: PropTypes.object.isRequired,
    linkHeader: PropTypes.string,
    location: PropTypes.object.isRequired,
    classOverride: PropTypes.string,
  };

  static contextTypes = {
    onEntityLinkPush: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  componentWillMount() {
    this.setNoLink();
    this.calcPath();
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setNoLink();
    }
  }

  onClick = () => {
    // const { history: { location } } = this.props;
    this.context.onEntityLinkPush();
  }

  setNoLink() {
    if (this.state.path === this.props.location.pathname) {
      this.setState({ noLink: true });
    } else {
      this.setState({ noLink: false });
    }
  }

  getClassName = name => (name || 'property-label');

  revPath = (entityType, id) => `/${entityRevRouteMap(entityType)}/${id}/identity`;
  famToRevPath = (entityType, id) => `${entityFamilyRouteMap(entityType)}/${id}/activeid`;

  calcPath = () => {
    const {
      entityVM:
      { id, revId, isFamily, entityType, linkOverride },
      location: { search, state },
    } = this.props;
    let path;
    if (linkOverride) {
      path = linkOverride;
      this.setState({ path });
    } else if (isFamily) {
      path = this.revPath(entityType, revId);
    } else {
      path = this.revPath(entityType, id.slice(0, 36));
    }
    // debug('calc path', path);
    const location = { pathname: path, search, state };
    this.setState({ location });
  }

  render() {
    const {
      linkHeader,
      classOverride,
      entityVM: { label },
    } = this.props;
    return (
      <span>
        {linkHeader &&
          <span>
            <span className="property-label">{linkHeader}&nbsp;&nbsp;</span>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </span>}
        {this.state.noLink ?
          <span className={classOverride || 'doc-no-link'}>
            {label}
          </span> :
          <Link
            onClick={this.onClick}
            to={this.state.location}
            className={classOverride || 'doc-link'}
          >
            {label}
          </Link>}
      </span>
    );
  }
}

export default createFragmentContainer(EntityLink, {
  entityVM: graphql`
    fragment EntityLink_entityVM on EntityVM {
      id
      entityType
      label
      isFamily
      revId
    }
  `,
});
