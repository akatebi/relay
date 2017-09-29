import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import qs from 'qs';
import Select from 'react-select';
import { Route } from 'react-router-dom';
import Title from './Title';

const debug = require('debug')('app:component:newpage:Layout');

class Layout extends Component {

  static propTypes = {
    contentIdentity: PropTypes.object.isRequired,
    newPageLayout: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    relay: PropTypes.object.isRequired,
  }

  state = {}

  componentWillMount() {
    const {
      contentIdentity: {
        layout: value,
        isChangeable: {
          layout: enabled,
        },
      },
      newPageLayout: {
        options,
      },
      params: {
        layout,
      },
    } = this.props;
    if (!enabled) {
      this.updateValue(value, '!enabled');
    } else if (options.length === 1) {
      const value = options[0];
      this.updateValue(value, 'options[0]');
    } else if (layout) {
      const value = options.find(({ id }) => id === layout);
      this.updateValue(value);
    } else {
      this.updateValue(value);
    }
  }

  pushRoute = (id = '') => {
    const { history, params: { entityRoute, org, klass, type } } = this.props;
    const pathname = `/newpage/${entityRoute}/${org}/${klass}/${type}/${id.slice(0, 36)}`;
    const { contentIdentity: { title } } = this.props;
    const search = qs.stringify({ title });
    debug('search', search, qs.parse(search));
    history.push({ pathname, search });
  }

  updateValue = (value, dbg) => {
    debug('updateValue', dbg, value);
    this.setState({ value });
    const { location: { pathname } } = this.props;
    debug('pathname', pathname);
    if (pathname.split('/').length === 6) {
      this.pushRoute(value.id);
    }
  }

  render() {
    const placeholder = 'select Template Layout ...';
    const {
      params,
      match,
      relay,
      newPageLayout: { options },
      contentIdentity: {
        isChangeable: { layout: enabled },
        documentKind,
      },
    } = this.props;
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
      <div className="col-sm-6" style={{ marginLeft: 20 }}>
        <div className="header-label">Template Layout</div>
        <Select {...props} className="select-primary-color" />
        <br />
        <Route
          path={`${match.url}/:title`}
          render={props => <Title relay={relay} documentKind={documentKind} params={params} {...props} />}
        />
      </div>
    );
  }
}

export default createFragmentContainer(Layout, {
  contentIdentity: graphql`
    fragment Layout_contentIdentity on ContentIdentity {
      title
      documentKind
      layout {
        id
        label
      }
      isChangeable {
        layout
      }
    }
  `,
  newPageLayout: graphql`
    fragment Layout_newPageLayout on NewPageLayout {
      options {
        id
        label
      }
    }
  `,
});
