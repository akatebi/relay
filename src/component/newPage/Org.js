import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import Select from 'react-select';
import { Route } from 'react-router-dom';
import Klass from '../base/newPage/Klass';

const debug = require('debug')('app:component:newpage:Org');

class Org extends Component {

  static propTypes = {
    contentIdentity: PropTypes.object.isRequired,
    newPageOrg: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = {}

  componentWillMount() {
    const {
      contentIdentity: {
        organization: value,
        isChangeable: {
          organization: enabled,
        },
      },
      newPageOrg: {
        options,
      },
      params: {
        org,
      },
    } = this.props;
    if (!enabled) {
      this.updateValue(value, '!enabled');
    } else if (options.length === 1) {
      const value = options[0];
      this.updateValue(value, 'options[0]');
    } else if (org) {
      const value = options.find(({ id }) => id === org);
      this.updateValue(value);
    } else {
      this.updateValue(value);
    }
  }

  componentWillUpdate(_, nextState) {
    if (this.state !== nextState) {
      this.pushRoute(nextState.value.id);
    }
  }

  pushRoute = (id = '') => {
    const { history, params: { entityRoute } } = this.props;
    const pathname = `/newpage/${entityRoute}/${id.slice(0, 36)}`;
    debug('pushRoute', pathname);
    history.push({ pathname });
  }

  updateValue = (value, dbg) => {
    debug('updateValue', dbg, value);
    this.setState({ value });
    const { location: { pathname } } = this.props;
    debug('pathname', pathname);
    if (pathname.split('/').length === 3) {
      this.pushRoute(value.id);
    }
  }

  render() {
    const {
      match,
      params,
      newPageOrg: { options },
      contentIdentity: {
        isChangeable: { organization: enabled },
      },
    } = this.props;
    const placeholder = 'select Organization ...';
    const props = {
      placeholder,
      resetValue: {},
      autosize: true,
      autofocus: true,
      disabled: !enabled,
      value: this.state.value,
      options: options.map(({ id: value, label }) => ({ value, label })),
      onChange: ({ value: id, label }) => {
        this.updateValue({ id, label }, 'onChange');
        this.pushRoute(id);
      },
    };
    return (
      <div>
        <div className="col-sm-6" style={{ marginLeft: 20 }}>
          <div className="header-label">Organization</div>
          <Select {...props} className="select-primary-color" />
          <br />
        </div>
        <Route
          path={`${match.url}/:org`}
          render={props => <Klass params={params} {...props} />}
        />
      </div>
    );
  }
}

export default createFragmentContainer(Org, {
  contentIdentity: graphql`
    fragment Org_contentIdentity on ContentIdentity {
      organization {
        id
        label
      }
      isChangeable {
        organization
      }
    }
  `,
  newPageOrg: graphql`
    fragment Org_newPageOrg on NewPageOrg {
      options {
        id
        label
      }
    }
  `,
});
