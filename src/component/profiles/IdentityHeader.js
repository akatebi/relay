import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';
import React, { Component } from 'react';

// const debug = require('debug')('app:component:profiles:IdentityHeader');

class IdentityHeader extends Component {

  static propTypes = {
    identity: PropTypes.object.isRequired,
  };

  render() {
    const { identity } = this.props;
    // console.log('IDHEADER - identity', Object.keys(identity));
    if (!identity) {
      return false;
    }

    const {
      identity: {
        identities,
        label,
        standardProperties,
      },
    } = this.props;

    // debug('identities', identities && identities.length);
    // debug('standardProperties', standardProperties && standardProperties.length);

    const fullState = standardProperties.find(({ name }) => name === 'Rev_FullStatus') || {};
    const getControlNumber = (identities) => {
      const prop = identities.find(prop => prop.tail.propertyType === 'ControlNumber') || { tail: {} };
      return prop.tail.valueVM;
    };
    const controlNumber = getControlNumber(identities);

    const title = () => {
      const { valueVMControlNumber: { controlNumberString, version, draftVersion } } = controlNumber;
      let draft = '';
      if (draftVersion) {
        draft = `/ ${draftVersion}`;
      }
      return (<div className="row">
        <div className="col-sm-12 title1 nopadding">
          {`${controlNumberString || '<no control number>'} / ${version} ${draft} - "${label}"`}
        </div>
      </div>);
    };

    return (
      <div>
        <div className="row" style={{ marginBottom: 16, marginTop: 6 }}>
          <div className="col-sm-8 nopadding">
            <div>{title()}</div>
          </div>

          <div className="col-sm-4">
            <span className="property-label">Status</span>
            <span
              className="property-value-md"
              style={{ fontWeight: 'bold' }}
            >
              {fullState.valueVM}
            </span>
          </div>

        </div>

      </div>
    );
  }
}

export default createFragmentContainer(IdentityHeader, {
  identity: graphql`
    fragment IdentityHeader_identity on Identity {
      id
      label
      entityType
      documentType {
        id
      }
      formHeader
      standardProperties {
        name
        label
        valueVM
      }
      identities {
        tail {
          propertyType,
          valueVM {
            ... on ControlNumberProp {
              valueVMControlNumber {
                controlNumberString
                draftVersion
                version
              }
            }
          }
        }
      }
      documentType {
        ...EntityLink_entityVM
      }
    }
  `,
});
