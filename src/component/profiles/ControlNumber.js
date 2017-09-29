import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';
import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import Select from 'react-select';
import NumericField from './NumericField';
import TextField from './TextField';
import { normalize } from './normalize';

const debug = require('debug')('app:component:profiles:ControlNumber');

class ControlNumber extends Component {

  static propTypes = {
    identity: PropTypes.object.isRequired,
    controlNumberSequence: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    action: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { identity: { identities } } = this.props;
    const valueVMControlNumber = { ...this.getControlNumber(identities) };
    const { prefix, suffix, sequenceNumber, sequenceType, controlNumberString }
      = valueVMControlNumber;
    // console.log('SequenceType', sequenceType);
    // console.log('SequenceNumber', sequenceNumber);
    const sequenceTypeOptions = this.setSequenceTypeOptions(sequenceType);
    const prefixList = this.setPrefixList();
    const selectedSequenceType = sequenceType;
    this.makeIds();
    this.setState({
      sequenceTypeOptions,
      prefixList,
      valueVMControlNumber,
      prefix,
      suffix,
      sequenceNumber,
      selectedSequenceType,
      controlNumberString,
    });
  }

  onChangeField = (field, val) => {
    this.updateState(field, val);
    this.state.valueVMControlNumber[field] = val;
    // debug('FIELD', field, 'VALUE', val);
    const {
      id,
      propertyType,
      valueVM: { valueVMControlNumber: val2 },
    } = this.getTail(this.props.identity.identities);
    const value = normalize(this.state.valueVMControlNumber);
    const valueVM = normalize(val2);
    return this.props.onChange({ id, propertyType, value, valueVM });
  };

  onPrefixChange = (prefix) => {
    debug('*****', window.pretty(prefix));
    const { controlNumberSequence: { sequences } } = this.props;
    const seq = sequences.find(seq => seq.prefix === prefix);

    this.setState({
      selectedPrefix: prefix,
      nextSequence: seq && seq.nextSequenceNumber,
    });
  };

  onSequenceTypeChange = (type) => {
    debug(window.pretty(type));
    this.setState({ selectedSequenceType: type.label });
  };

  getTail = (identities) => {
    const prop = identities
      .find(({ tail: { propertyType } }) => propertyType === 'ControlNumber');
    return prop ? prop.tail : prop;
  };

  getControlNumber = (identities) => {
    const prop = identities
      .find(({ tail: { propertyType } }) => propertyType === 'ControlNumber');
    return prop ? prop.tail.valueVM.valueVMControlNumber : prop;
  };

  setSequenceTypeOptions = (sequenceType) => {
    let options;
    // if (sequenceType === 'Auto') {
    //   options = [{ value: 'auto', label: 'Auto' }];
    // }
    if (sequenceType === 'Manual') {
      options = [
        { value: 'auto', label: 'Auto' },
        { value: 'manual', label: 'Manual' }];
    }
    if (sequenceType === 'FreeForm') {
      options = [
        { value: 'auto', label: 'Auto' },
        { value: 'manual', label: 'Manual' },
        { value: 'freeform', label: 'Free Form' }];
    }
    return options;
  }

  setPrefixList = () => {
    const { controlNumberSequence: { sequences } } = this.props;
    // console.log('Sequences', window.pretty(sequences));
    return sequences.map(seq => ({
      value: seq.id,
      label: seq.prefix,
    }));
  };

  possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  randomChar = () => this.possible.charAt(Math.floor(Math.random() * this.possible.length));

  makeId = () => {
    let id = '';
    for (let x = 0; x < 5; x++) {
      id += this.randomChar();
    }
    // console.log('makeId >> newId', id);
    return id;
  };

  makeIds = () => {
    const prefixId = this.makeId();
    const seqId = this.makeId();
    const suffixId = this.makeId();
    const freeId = this.makeId();
    this.setState({ prefixId, seqId, suffixId, freeId });
  };

  updateState = (field, val) => {
    if (field === 'prefix') {
      if (val.length <= this.maxPrefix) {
        this.setState({ prefix: val });
      }
    }
    if (field === 'suffix') {
      if (val.length <= this.maxSuffix) {
        this.setState({ suffix: val });
      }
    }
    if (field === 'sequenceNumber') {
      if (val <= this.maxSequence) {
        this.setState({ sequenceNumber: val });
      }
    }
    if (field === 'controlNumberString') {
      this.setState({ controlNumberString: val });
    }
  };

  /////////////////////////////////////////////
  maxPrefix = 24;
  maxSuffix = 24;
  maxSequence = 99999999;
  /////////////////////////////////////////////

  render() {
    const {
      action,
    } = this.props;

    // debug('action', action);

    const {
      prefix,
      suffix,
      sequenceNumber,
      prefixList,
      controlNumberString,
      selectedSequenceType,
      nextSequence,
    } = this.state;

    // debug('prefix', prefix, 'suffix', suffix, 'sequenceNumber', sequenceNumber);
    // debug('controlNumberString', controlNumberString, 'sequenceType', sequenceType);
    // debug('prefixList', window.pretty(prefixList));
    // const { controlNumberString, sequenceType, version, draftVersion } = valueVMControlNumber;

    const numericFieldProps = (action, field, minValue, maxValue) => ({
      action,
      field,
      minValue,
      maxValue,
      onChange: this.onChangeField.bind(this, field.prop),
    });

    const textFieldProps = (action, field, maxLength) => ({
      action,
      field,
      maxLength,
      onChange: this.onChangeField.bind(this, field.prop),
    });

    const editMode = action === 'edit';

    const freeFormView = () =>
      (this.state.selectedSequenceType === 'FreeForm' &&
        <TextField
          {...textFieldProps(action, {
            label: 'Free Form Number',
            value: controlNumberString,
            id: this.state.freeId,
            prop: 'controlNumberString',
            isRequired: true,
          },
          52,
          )}
        />
      );

    const showResult = () => {
      const sequenceLength = sequenceNumber.toString().length;
      // debug('sequenceLength', sequenceLength);
      let sequence;
      if (sequenceLength < 5) {
        sequence = `${Array(6 - sequenceLength).join('0')}${sequenceNumber}`;
      } else {
        sequence = sequenceNumber;
      }
      const { selectedPrefix } = this.state;
      const showPrefix = selectedPrefix ? selectedPrefix.label : prefix;
      return `${showPrefix}${sequence}${suffix}`;
    };

    const selectPrefixProps = {
      autoBlur: true,
      autofocus: false,
      autosize: false,
      multi: false,
      clearable: false,
      placeholder: 'select a Prefix',
      options: prefixList,
      value: this.state.selectedPrefix && this.state.selectedPrefix.value,
      onChange: this.onPrefixChange,
      width: '50%',
    };

    const sequenceTypeAutoView = (
      <div className="row">
        <div className="col-sm-4 property-label-color">
            Sequence Type: &nbsp;&nbsp;&nbsp;
        </div>
        <div className="col-sm-8 wiz-property-value">{selectedSequenceType}</div>
      </div>);

    const sequenceTypeLookupView = () => {

      const selectSequenceTypeProps = {
        autoBlur: true,
        autofocus: false,
        autosize: false,
        multi: false,
        clearable: false,
        placeholder: 'select a Sequence Type',
        options: this.state.sequenceTypeOptions,
        value: this.state.selectedSequenceType,
        onChange: this.onSequenceTypeChange,
        width: '50%',
      };

      return (
        <div className="row">
          <div className="col-sm-4 property-label-color">Sequence Type: &nbsp;&nbsp;&nbsp;</div>
          <div
            className="col-sm-8"
          >
            <Select
              {...selectSequenceTypeProps}
              className="select-primary-color"
            />
          </div>
        </div>
      );
    };

    const sequenceTypeView = () => (selectedSequenceType === 'Auto' ?
      sequenceTypeAutoView : sequenceTypeLookupView());

    const prefixView = (
      <div className="row">
        {(this.state.selectedSequenceType === 'Auto' &&
          this.state.prefixList.length === 1) &&
          <div>
            <div
              className="col-sm-4 property-label-color"
              style={{ marginLeft: '15px' }}
            >Prefix: &nbsp;&nbsp;&nbsp;
            </div>
            <div className="col-sm-8 wiz-property-value">{prefix}</div>
          </div>
        }
        {(this.state.selectedSequenceType === 'Auto' &&
          this.state.prefixList.length > 1) &&
          <div>
            <div className="col-sm-4 property-label-color">Prefix: &nbsp;&nbsp;&nbsp;</div>
            <div
              className="col-sm-8"
            >
              <Select
                {...selectPrefixProps}
                className="select-primary-color"
              />
            </div>
          </div>
        }
        {(this.state.selectedSequenceType === 'Manual' &&
          <div className="row">
            <TextField
              {...textFieldProps(action, {
                label: 'Prefix',
                value: prefix,
                id: this.state.prefixId,
                prop: 'prefix',
                isRequired: false,
              })}
            />
          </div>)}
      </div>
    );

    const sequenceNumberView = (this.state.selectedSequenceType === 'Auto' ?
      (<div className="row">
        <div
          className="col-sm-4 property-label-color"
        >Sequence Number: &nbsp;&nbsp;&nbsp;
        </div>
        <div className="col-sm-8 wiz-property-value">{sequenceNumber}</div>
      </div>) :
      (<NumericField
        {...numericFieldProps(action, {
          label: 'Sequence Number',
          value: nextSequence,
          id: this.state.seqId,
          prop: 'sequenceNumber',
          isRequired: true,
        },
        0,
        999999999,
        )}
      />)
    );

    const suffixView = (this.state.selectedSequenceType === 'Auto' ?
      (<div className="row">
        <div
          className="col-sm-4 property-label-color"
        >Suffix:
        </div>
        <div className="col-sm-8 wiz-property-value">{suffix}</div>
      </div>) :
      (<TextField
        {...textFieldProps(action, {
          label: 'Suffix',
          value: suffix,
          id: this.state.suffixId,
          prop: 'suffix',
          isRequired: false,
        })}
      />)
    );

    const resultingNumber = (
      <div className="row">
        <div
          className="col-sm-4 property-label-color"
        >Resulting Number:
        </div>
        <div className="col-sm-8 wiz-property-value-lg">{showResult()}</div>
      </div>);

    const editView = (<div>
      <Panel style={{ marginTop: '12px' }}>
        <table className="table table-condensed table-hover">
          <tbody>
            <tr><td>{sequenceTypeView()}</td></tr>
            {this.state.selectedSequenceType === 'FreeForm' &&
              <tr><td>{freeFormView()}</td></tr>
            }
          </tbody>
          {this.state.selectedSequenceType !== 'FreeForm' &&
            (
              <tbody>
                <tr><td>{prefixView}</td></tr>
                <tr><td>{sequenceNumberView}</td></tr>
                <tr><td>{suffixView}</td></tr>
                <tr><td>{resultingNumber}</td></tr>
              </tbody>
            )}
        </table>
      </Panel>
    </div>);

    const readView = (<div>
      <span>
        <TextField
          {...textFieldProps(action, {
            label: 'Control Number',
            value: controlNumberString || '<none>',
            id: this.state.freeId,
            prop: 'controlNumberString',
            isRequired: false,
          })}
        />
      </span>
    </div>);

    return (
      <div>
        {editMode ? editView : readView}
      </div>
    );
  }
}

export default createFragmentContainer(ControlNumber, {
  identity: graphql`
    fragment ControlNumber_identity on Identity {
      identities {
        tail {
          id
          propertyType,
          valueVM {
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
      }
    }
  `,
  controlNumberSequence: graphql`
    fragment ControlNumber_controlNumberSequence on ControlNumberSequence {
      sequences {
        prefix
        suffix
        nextSequenceNumber
        increment
        isGlobal
        entityType
        label
        id
        cultureCode
        reportingKey
        familyId
        isFamily
        operation
      }
    }
  `,
});
