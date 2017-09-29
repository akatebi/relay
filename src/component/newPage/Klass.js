import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import Select from 'react-select';
import { Route } from 'react-router-dom';
import Type from '../base/newPage/Type';

const debug = require('debug')('app:component:newpage:Klass');

class Klass extends Component {

  static propTypes = {
    contentIdentity: PropTypes.object.isRequired,
    newPageKlass: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = {}

  componentWillMount() {
    const {
      contentIdentity: {
        documentClass: value,
        isChangeable: {
          documentClass: enabled,
        },
      },
      newPageKlass: {
        options,
      },
      params: {
        klass,
      },
    } = this.props;
    if (!enabled) {
      this.updateValue(value, '!enabled');
    } else if (options.length === 1) {
      const value = options[0];
      this.updateValue(value, 'options[0]');
    } else if (klass) {
      const value = options.find(({ id }) => id === klass);
      this.updateValue(value);
    } else {
      this.updateValue(value);
    }
  }

  pushRoute = (id = '') => {
    const { history, params: { entityRoute, org } } = this.props;
    const pathname = `/newpage/${entityRoute}/${org}/${id.slice(0, 36)}`;
    debug('pushRoute', pathname);
    history.push({ pathname });
  }

  updateValue = (value, dbg) => {
    debug('updateValue', dbg, value);
    this.setState({ value });
    const { location: { pathname } } = this.props;
    debug('pathname', pathname);
    if (pathname.split('/').length === 4) {
      this.pushRoute(value.id);
    }
  }

  render() {
    const {
      match,
      params,
      newPageKlass: { options },
      contentIdentity: {
        isChangeable: { documentClass: enabled },
      },
    } = this.props;
    const placeholder = 'select Document Class ...';
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
          <div className="header-label">Document Class</div>
          <Select {...props} className="select-primary-color" />
          <br />
        </div>
        <Route
          path={`${match.url}/:klass`}
          render={props => <Type params={params} {...props} />}
        />
      </div>
    );
  }
}

export default createFragmentContainer(Klass, {
  contentIdentity: graphql`
    fragment Klass_contentIdentity on ContentIdentity {
      documentClass {
        id
        label
      }
      isChangeable {
        documentClass
      }
    }
  `,
  newPageKlass: graphql`
    fragment Klass_newPageKlass on NewPageKlass {
      options {
        id
        label
      }
    }
  `,
});
