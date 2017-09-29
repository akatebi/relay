import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import qs from 'qs';
import Header from '../Header';
import PropertyConfig from './PropertyConfig';
import SubHeaderCollapsible from '../SubHeaderCollapsible';
import IdentityHeader from '../IdentityHeader';

const debug = require('debug')('component:profiles:PropertyConfigs');

class PropertyConfigs extends Component {

  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    identity: PropTypes.object.isRequired,
    valueVMOptions: PropTypes.object.isRequired,
    valueVMTypeOptions: PropTypes.object.isRequired,
  };

  static contextTypes = {
    onChangeConfig: PropTypes.func.isRequired,
  };

  state = { expandId: '' };

  componentWillMount() {
    const { location: { search } } = this.props;
    const { expandId = '' } = qs.parse(search, { ignoreQueryPrefix: true });
    this.setState({ expandId });
  }

  onExpandConfig = (expandId, evt) => {
    evt.preventDefault();
    this.setState({ expandId });
    this.setSearch(expandId);
  }

  onCollapseConfig = (evt) => {
    evt.preventDefault();
    const expandId = '';
    this.setState({ expandId });
    this.setSearch(expandId);
  }

  setSearch = (expandId) => {
    debug('expandId', expandId);
    const { history, location: { pathname, search } } = this.props;
    const { action } = qs.parse(search, { ignoreQueryPrefix: true });
    const newSearch = qs.stringify({ action, expandId });
    history.replace({ pathname, search: newSearch });
  }

  render() {
    const {
      location,
      location: { search },
      config, identity,
      valueVMOptions,
      valueVMTypeOptions,
    } = this.props;
    const { action = 'display' } = qs.parse(search, { ignoreQueryPrefix: true });
    const { onChangeConfig } = this.context;
    const showHeader = () => {
      const end = location.pathname.split('/').pop();
      return end !== 'all' && end !== 'identity';
    };

    if (!config.list.length) {
      return (
        <div>
          {this.showHeader() ? <IdentityHeader identity={identity} location={location} /> : <span />}
          <Header label="Property Configs" />
          <div className="property-value">(none)<br /></div>
        </div>
      );
    }

    const { expandId } = this.state;

    return (
      <div>
        {showHeader() ? <IdentityHeader identity={identity} location={location} /> : <span />}
        <Header label="Property Configs" />
        <ul style={{ listStyle: 'none', paddingLeft: 10 }}>
          {config.list.slice(0).map((propertyConfig, i) =>
            (<li key={propertyConfig.id}>
              <SubHeaderCollapsible
                label={`${i + 1} - ${propertyConfig.propertyLabel.value}`}
                id={propertyConfig.id}
                expandId={expandId}
                onExpand={this.onExpandConfig}
                onCollapse={this.onCollapseConfig}
              />
              {expandId === propertyConfig.id &&
                <div style={{ marginLeft: 25 }}>
                  <PropertyConfig
                    action={action}
                    propertyConfig={propertyConfig}
                    onChange={onChangeConfig}
                    valueVMOptions={valueVMOptions}
                    valueVMTypeOptions={valueVMTypeOptions}
                  />
                </div>
              }
            </li>),
          )}
        </ul>
      </div>
    );
  }
}

export default createFragmentContainer(PropertyConfigs, {
  identity: graphql`
    fragment PropertyConfigs_identity on Identity {
      ...IdentityHeader_identity
    }
  `,
  config: graphql`
    fragment PropertyConfigs_config on PropertyConfigs {
      list {
        id
        propertyLabel {
          value
        }
        ...PropertyConfig_propertyConfig
      }
    }
  `,
  valueVMOptions: graphql`
    fragment PropertyConfigs_valueVMOptions on ValueVMOptions {
      ...PropertyConfig_valueVMOptions
    }
  `,
  valueVMTypeOptions: graphql`
    fragment PropertyConfigs_valueVMTypeOptions on ValueVMTypeOptions {
      ...PropertyConfig_valueVMTypeOptions
    }
  `,
});
