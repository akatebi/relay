import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Select from 'react-select';

export default class Step1 extends Component {

  static propTypes = {
    getLabel: PropTypes.func,
    getViewData: PropTypes.func,
    updateViewData: PropTypes.func,
    ownerTypes: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    const { getViewData } = this.props;
    const { selectedOwnerType } = getViewData();
    this.state = { selectedOwnerType };

    this._validateOnDemand = true; // this flag enables onBlur validation as user fills forms
  }

  persist = () => {
    const { updateViewData } = this.props;
    if (this.state.selectedOwnerType !== '') {
      // console.log('*** persist Step1 selectedOwnerType', this.state.selectedOwnerType);
      updateViewData({ selectedOwnerType: this.state.selectedOwnerType });
    }
  }

  isValidated = () => {
    // console.log('_isValidated');
    const userInput = this._grabUserInput(); // this.state.selectedOwnerType;
    const validateNewInput = this.validateData(userInput);
    let isDataValid = false;

    // console.log('validateNewInput', window.pretty(validateNewInput));
    // if full validation passes then save to store and pass as valid
    if (Object.keys(validateNewInput).every(k => validateNewInput[k] === true)) {
      this.persist();
      isDataValid = true;
    } else {
      // if anything fails then update the UI validation state but NOT the UI Data State
      this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
    }
    return isDataValid;
  }

  _validationCheck = () => {
    if (!this._validateOnDemand) {
      return;
    }

    const userInput = this._grabUserInput(); // this.state.selectedOwnerType;
    const validateNewInput = this.validateData(userInput); // run the new input against the validator

    this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
  }

  /* eslint max-len:0 */
  /* eslint class-methods-use-this:0 */

  validateData(data) {
    // console.log('_validateData', window.pretty(data));
    return {
      indexVal: (data !== '' && data.selectedOwnerType !== ''),
    };
  }

  _validationErrors(val) {
    // console.log('_validationErrors');
    const msg = this.props.getLabel('_ChgOwn_OwnerTypeError');
    const errMsgs = {
      indexValMsg: (val && val.indexVal) ? '' : msg, // 'An Owner Type is required',
    };
    return errMsgs;
  }

  _grabUserInput = () => ({ selectedOwnerType: this.state.selectedOwnerType });

  showSelected = () => {
    // console.log('STATE', this.state);
    if (this.state) {
      const { ownerTypes } = this.props;
      const { selectedOwnerType } = this.state;
      const selected = ownerTypes.find(ownerType =>
        ownerType.value === selectedOwnerType);
      return selected;
    }
    return -1;
  };

  render() {
    const { getLabel, ownerTypes } = this.props;
    // console.log('ownerTypes', ownerTypes);
    const label1 = getLabel('_ChgOwn_OwnerTypePlaceholder');
    const label2 = getLabel('_ChgOwn_Step1Label');
    const label3 = getLabel('_ChgOwn_OwnerTypeLabel');

    // explicit class assigning based on validation
    const notValidClasses = {};

    if (this.state && (typeof this.state.indexVal === 'undefined' || this.state.indexVal)) {
      notValidClasses.indexClass = 'no-error col-sm-8';
    } else {
      notValidClasses.indexClass = 'has-error col-sm-8';
      notValidClasses.indexValGroupClass = 'val-err-tooltip';
    }

    const selectProps =
      ({
        multi: false,
        clearable: false,
        autoBlur: true,
        placeholder: `${label1}`, // 'select an Owner Type'
        value: this.showSelected(),
        options: ownerTypes.sort((a, b) => a.label.localeCompare(b.label)),
        onChange: (x) => {
          // console.log('%%%%% selected >>', window.pretty(x));
          this.setState({ selectedOwnerType: x.value });
        },
      });

    return (
      <div className="step step1">
        <div className="row">
          <div className="col-sm-12 control-label" >
            <div className="panel-label">{label2}</div> {/* Select Owner Type */}
          </div>
          <div className="row">
            &nbsp;
          </div>
        </div>
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
              <div className="control-label col-sm-3">{label3}</div> {/* Owner Type */}
              <div className={`${notValidClasses.indexClass} col-sm-7`} >
                <Select {...selectProps} ref="ownerType" className="select-primary-color" />
                <div className={notValidClasses.indexValGroupClass}>
                  {this.state && this.state.indexValMsg}
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="row" style={{ paddingBottom: 8 }}>&nbsp;</div>
      </div>
    );
  }
}
