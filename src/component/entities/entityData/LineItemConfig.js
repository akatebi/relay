import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import qs from 'qs';
import { Panel } from 'react-bootstrap';
import IdentityHeader from '../../profiles/IdentityHeader';
import PropertyContent from '../../profiles/PropertyContent';
import Scrollbar from '../../Scrollbar';

// const debug = require('debug')('component:entities:LineItemConfig');

class LineItemConfig extends Component {

  static propTypes = {
    location: PropTypes.object.isRequired,
    entity: PropTypes.object.isRequired,
    identity: PropTypes.object.isRequired,
    valueVMOptions: PropTypes.object.isRequired,
    valueVMTypeOptions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount = () => {
    this.setState({ selectedSegment: null });
    // console.log('%%%% LineItemConfig', window.pretty(this.props.entity));
  }


  render() {
    const { location: { search }, identity, valueVMOptions, valueVMTypeOptions } = this.props;
    const { action = 'display' } = qs.parse(search, { ignoreQueryPrefix: true });

    const onChange = () => {};

    const customProp = (name) => {
      const { entity: { customProperties } } = this.props;
      const index = customProperties.findIndex(prop => prop.tail.name === name);
      return (<PropertyContent
        relationshipToPropertyContent={{ ...customProperties[index] }}
        action={action}
        onChange={onChange}
        valueVMOptions={valueVMOptions}
        valueVMTypeOptions={valueVMTypeOptions}
      />);
    };

    return (
      <Scrollbar>
        <div className="col-sm-12 nopadding">
          <IdentityHeader identity={identity} location={location} />
          <div className="row">
            <div>
              <div>{customProp('ShortDescription')}</div>
              <div>{customProp('LongDescription')}</div>
              <div>{customProp('Instruction')}</div>

              <Panel style={{ paddingLeft: 10, marginBottom: 10 }} >
                <div className="row">
                  <div className="col-sm-6">
                    <div className="header-label">Enabled?</div>
                    <div>{customProp('RatingTypeEnabled')}</div>
                    <div>{customProp('DetailTypeEnabled')}</div>
                    <div>{customProp('AttachmentEnabled')}</div>
                    <div>{customProp('IsSubTotalLineItem')}</div>
                  </div>
                  <div className="col-sm-6">
                    <div className="header-label">Rating</div>
                    <div>{customProp('RatingType')}</div>
                    <div>{customProp('MinimumRating')}</div>
                    <div>{customProp('MaximumRating')}</div>
                    <div>{customProp('MaxDigits')}</div>
                    <div>{customProp('Threshold')}</div>
                    <div>{customProp('CompliantRatingValue')}</div>
                  </div>
                </div>
              </Panel>
            </div>
          </div>
          <div className="row">
            <div>{customProp('AssociationCreationConstraint')}</div>
            <div>{customProp('AssociationConfigs')}</div>
          </div>
        </div>
      </Scrollbar>
    );
  }
}

export default createFragmentContainer(LineItemConfig, {
  entity: graphql`
    fragment LineItemConfig_entity on Entity {
      id
      entityType
      customProperties {
        ...PropertyContent_relationshipToPropertyContent
        id
        tail {
          name
        }
      }
    }
  `,
  identity: graphql`
    fragment LineItemConfig_identity on Identity {
      ...IdentityHeader_identity
    }
  `,
  valueVMOptions: graphql`
    fragment LineItemConfig_valueVMOptions on ValueVMOptions {
      ...PropertyContent_valueVMOptions
    }
  `,
  valueVMTypeOptions: graphql`
    fragment LineItemConfig_valueVMTypeOptions on ValueVMTypeOptions {
      ...PropertyContent_valueVMTypeOptions
    }
  `,
});
