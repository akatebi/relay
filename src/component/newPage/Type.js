import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import Select from 'react-select';
import { Route } from 'react-router-dom';
import Layout from '../base/newPage/Layout';

const debug = require('debug')('app:component:newpage:Type');

class Type extends Component {

  static propTypes = {
    contentIdentity: PropTypes.object.isRequired,
    newPageType: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = {}

  componentWillMount() {
    const {
      contentIdentity: {
        documentType: value,
        isChangeable: {
          documentType: enabled,
        },
      },
      newPageType: {
        options,
      },
      params: {
        type,
      },
    } = this.props;
    if (!enabled) {
      this.updateValue(value, '!enabled');
    } else if (options.length === 1) {
      const value = options[0];
      this.updateValue(value, 'options[0]');
    } else if (type) {
      const value = options.find(({ id }) => id === type);
      this.updateValue(value);
    } else {
      this.updateValue(value);
    }
  }

  pushRoute = (id = '') => {
    const { history, params: { entityRoute, org, klass } } = this.props;
    const pathname = `/newpage/${entityRoute}/${org}/${klass}/${id.slice(0, 36)}`;
    debug('push', pathname);
    history.push({ pathname });
  }

  updateValue = (value, dbg) => {
    debug('updateValue:', dbg, value);
    this.setState({ value });
    const { location: { pathname } } = this.props;
    debug('pathname', pathname);
    if (pathname.split('/').length === 5) {
      this.pushRoute(value.id);
    }
  }

  render() {
    const {
      params,
      match,
      newPageType: { options },
      contentIdentity: {
        isChangeable: { documentType: enabled },
      },
    } = this.props;
    const placeholder = 'select Document Type ...';
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
          <div className="header-label">Document Type</div>
          <Select {...props} className="select-primary-color" />
          <br />
        </div>
        <Route
          path={`${match.url}/:type`}
          render={props => <Layout params={params} {...props} />}
        />
      </div>
    );
  }
}

export default createFragmentContainer(Type, {
  contentIdentity: graphql`
    fragment Type_contentIdentity on ContentIdentity {
      documentType {
        id
        label
      }
      isChangeable {
        documentType
      }
    }
  `,
  newPageType: graphql`
    fragment Type_newPageType on NewPageType {
      options {
        id
        label
      }
    }
  `,
});
