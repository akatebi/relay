import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import qs from 'qs';
import { Panel } from 'react-bootstrap';
import SimpleBooleanField from '../../profiles/SimpleBooleanField';
import SimpleTextField from '../../profiles/SimpleTextField';
import IdentityHeader from '../../profiles/IdentityHeader';
import EntityLink from '../EntityLink';
import Scrollbar from '../../Scrollbar';

// const debug = require('debug')('component:entities:LifeCycleConfig');

class LifeCycleConfig extends Component {

  static propTypes = {
    location: PropTypes.object.isRequired,
    entity: PropTypes.object.isRequired,
    identity: PropTypes.object.isRequired,
  };

  entityVM = {};

  render() {
    const { location: { search }, entity, identity } = this.props;
    // console.log('LifeCycleConfig', window.pretty(entity));
    const { action = 'display' } = qs.parse(search, { ignoreQueryPrefix: true });

    const onChange = () => {};

    const textProps = (label, value) => ({
      label,
      value,
      action,
      onChange,
    });

    const booleanProps = (label, value) => ({
      label,
      value,
      action,
      onChange,
    });

    const lifeCycleType = value => (
      <div className="col-sm-8">
        <SimpleTextField {...textProps('Type', value)} />
      </div>
    );

    const startState = state => (
      <div className="col-sm-8">
        <Panel header="Start State" style={{ marginBottom: 10 }} >
          <EntityLink
            linkHeader="State Config"
            entityVM={state.stateLink}
            location={location}
          />
          <br /><br />
          <SimpleTextField {...textProps('State', state.state)} />
          <SimpleBooleanField {...booleanProps('Satisfied', state.satisfiedState)} />
          <SimpleBooleanField {...booleanProps('Subscription Effective', state.subscriptionEffective)} />
        </Panel>
      </div>);

    return (
      <Scrollbar>
        <div className="col-sm-12 nopadding">
          <IdentityHeader identity={identity} location={location} />
          <div className="row">
            {lifeCycleType(entity.type)}
          </div><br />
          <div className="row">
            {startState(entity.startState)}
          </div>
        </div>
      </Scrollbar>
    );
  }
}

export default createFragmentContainer(LifeCycleConfig, {
  entity: graphql`
    fragment LifeCycleConfig_entity on Entity {
      id
      label
      entityType
      type
      startState {
        state
        satisfiedState
        subscriptionEffective
        stateLink {
          ...EntityLink_entityVM
        }
      }
    }
  `,
  identity: graphql`
    fragment LifeCycleConfig_identity on Identity {
      ...IdentityHeader_identity
    }
  `,
});
