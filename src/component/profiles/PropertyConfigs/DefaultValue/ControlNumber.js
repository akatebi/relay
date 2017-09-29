import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';

// const debug = require('debug')('component:profiles:Property:ControlNumberProp');

class ControlNumberProp extends Component {

  static propTypes = {
    action: PropTypes.string.isRequired,
    isEditable: PropTypes.bool.isRequired,
    property: PropTypes.object.isRequired,
    // onChange: PropTypes.func.isRequired,
  };

  render() {
    const { action, isEditable, property } = this.props;
    const { valueVMControlNumber /*id, label*/ } = property;
    const editMode = (action === 'edit' && isEditable);
    // const requiredProps = ({ property, id });

    // console.log('CTRL NUM ###', path, valueVMControlNumber);

    if (!valueVMControlNumber) {
      return <div />;
    }

    // const editProps = {
    //   bsSize: 'small',
    //   style: { textAlign: 'left' },
    //   labelClassName: 'col-sm-3 property-label',
    //   wrapperClassName: 'col-sm-3',
    //   type: 'text',
    //   value: valueVMControlNumber.label,
    //   onChange: evt =>
    //     // onInputChange([...path, 'valueVMControlNumber'], evt.target.value, id),
    //     debug(evt.target.value),
    // };

    return (
      <div className="row" style={{ marginBottom: 5, marginTop: 5 }} >
        <div className="col-sm-4">
          {/* <Label property={property} /> */}
        </div>
        {editMode ?
          <div>
            <div className="col-sm-8" style={{ marginLeft: 15, marginRight: 30 }}>
              <form className="form-horizontal">
                {/* <FormControl {...editProps} /> */}
              </form>
            </div>
          </div>
          :
          <div className="col-sm-8">
            <div>
              <span className="property-label">xPrefix: </span>
              <span className="property-value">{valueVMControlNumber.prefix}</span>
            </div>
            <div>
              <span className="property-label">xSuffix: </span>
              <span className="property-value">{valueVMControlNumber.suffix}</span>
            </div>
            <div>
              <span className="property-label">xSequence Number: </span>
              <span className="property-value">{valueVMControlNumber.sequenceNumber}</span>
            </div>
            <div>
              <span className="property-label">xCtrlNumString</span>
              <span className="property-value">{valueVMControlNumber.controlNumberString}</span>
            </div>
            <div>
              <span className="property-label">xSequence Type</span>
              <span className="property-value">{valueVMControlNumber.sequenceType}</span>
            </div>
            <div>
              <span className="property-label">xVersion</span>
              <span className="property-value">{valueVMControlNumber.version}</span>
            </div>
            <div>
              <span className="property-label">xDraft Version</span>
              <span className="property-value">{valueVMControlNumber.draftVersion}</span>
            </div>
          </div>
        }
      </div>
    );
  }
}


export default createFragmentContainer(ControlNumberProp, {
  property: graphql`
  fragment ControlNumber_property on PropertyConfig {
    label
    propertyType
    defaultValue {
      ... on ControlNumberProp {
        valueVMControlNumber {
          prefix
          suffix
          sequenceNumber
          controlNumberString
          sequenceType
          version
          draftVersion
        }
      }
    }
  }
`,
});
