import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import React, { Component } from 'react';

// const debug = require('debug')('component:profiles:Property:ConstrolNumberAttr');

class ConstrolNumberAttr extends Component {

  static propTypes = {
    action: PropTypes.string.isRequired,
    isEditable: PropTypes.bool.isRequired,
    customAttr: PropTypes.object.isRequired,
    // onChange: PropTypes.func.isRequired,
  };

  render() {
    const { action, isEditable, customAttr } = this.props;
    const { valueControlNumber /*id, label*/ } = customAttr;
    const editMode = (action === 'edit' && isEditable);
    // const requiredProps = ({ customAttr, id });

    // console.log('CTRL NUM ###', path, valueVMControlNumber);

    if (!valueControlNumber) {
      return <div />;
    }

    // const editProps = {
    //   bsSize: 'small',
    //   style: { textAlign: 'left' },
    //   labelClassName: 'col-sm-3 customAttr-label',
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
              <span className="property-value">{valueControlNumber.prefix}</span>
            </div>
            <div>
              <span className="property-label">xSuffix: </span>
              <span className="property-value">{valueControlNumber.suffix}</span>
            </div>
            <div>
              <span className="property-label">xSequence Number: </span>
              <span className="property-value">{valueControlNumber.sequenceNumber}</span>
            </div>
            <div>
              <span className="property-label">xCtrlNumString</span>
              <span className="property-value">{valueControlNumber.controlNumberString}</span>
            </div>
            <div>
              <span className="property-label">xSequence Type</span>
              <span className="property-value">{valueControlNumber.sequenceType}</span>
            </div>
            <div>
              <span className="property-label">xVersion</span>
              <span className="property-value">{valueControlNumber.version}</span>
            </div>
            <div>
              <span className="property-label">xDraft Version</span>
              <span className="property-value">{valueControlNumber.draftVersion}</span>
            </div>
          </div>
        }
      </div>
    );
  }
}


export default createFragmentContainer(ConstrolNumberAttr, {
  customAttr: graphql`
  fragment ControlNumber_customAttr on CustomAttribute {
    type
    value {
      ... on ControlNumberAttr {
        valueControlNumber {
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
