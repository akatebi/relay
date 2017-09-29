import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Select from 'react-select';

export default class Step2 extends Component {

  static propTypes = {
    getLabel: PropTypes.func,
    getViewData: PropTypes.func,
    updateViewData: PropTypes.func,
    ownerTypes: PropTypes.array.isRequired,
    identities: PropTypes.array.isRequired,
    allUsersLookup: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    const { getViewData, getLabel } = this.props;
    const { selectedOwnerType, selectedNewOwner, newIdentities } = getViewData();

    const requiredError = getLabel('_ChgOwn_OwnerRequiredError');

    this.state = {
      selectedOwnerType,
      selectedOwnerTypeLabel: '',
      selectedNewOwner,
      newIdentities,
      labelOwnerRequiredError: requiredError.value,
      currentOwners: '',
    };

    this._validateOnDemand = true; // this flag enables onBlur validation as user fills forms
    // this.validationCheck = this._validationCheck.bind(this);
    // this.isValidated = this._isValidated.bind(this);
  }

  componentDidMount() {
    this.setOwnerTypeLabel();
    this.setCurrentOwners();
  }

  setCurrentOwners = () => {
    const { identities } = this.props;
    // console.log('%%%%% Step2 selectedOwnerType', this.state.selectedOwnerType);
    const currentOwner = identities.find(owner => owner.tail.id === this.state.selectedOwnerType);
    // console.log('%%%%% Step2 Owner', window.pretty(currentOwner));

    const { tail: { valueVM: { valueVMRoleList } } } = currentOwner;
    const names = valueVMRoleList.map(value => value.label).join(', ');
    this.setState({ currentOwners: names });
    // console.log('setCurrentOwners - new owner names!', names);

    const currentId = valueVMRoleList[0].id.slice(0, 36);
    // console.log('%%%%% currentOwner ID', currentId);
    this.setState({ currentId });
  }

  setOwnerTypeLabel = () => {
    const { ownerTypes, getViewData } = this.props;
    // console.log('%%% Step2 GOT PROPS?', ownerTypes);
    const { selectedOwnerType } = getViewData();
    // console.log('%%% Step2 GOT STORE?', selectedOwnerType);
    const label = ownerTypes.find(type => type.value === selectedOwnerType).label;
    // console.log('#### Step2 label ', label, '<');
    this.setState({ setOwnerTypeLabel: label });
  }

  clone = obj => JSON.parse(JSON.stringify(obj));

  addToNewList = () => {
    const { identities, allUsersLookup } = this.props;
    // console.log('addToNewList1', window.pretty(identities));

    const foundOwnerType = identities.find(owner => owner.tail.id === this.state.selectedOwnerType);
    if (!foundOwnerType) {
      console.error('addToNewList - didn\'t find OwnerType in original list');
      return;
    }

    const currentOwnerType = this.clone(foundOwnerType);
    const { tail: { valueVM: { valueVMRoleList } } } = currentOwnerType;
    // console.log('addToNewList this.state.selectedNewOwner', window.pretty(this.state.selectedNewOwner));

    if (valueVMRoleList.length > 1) {
      // TO DO - Support multiple recipients, check if oper="Update"
      console.error('addToNewList - valueVMRoleList > 1', window.pretty(valueVMRoleList));
    } else {
      // go find the new owner in the list of users
      const foundOrigOwner = allUsersLookup.find(actor => actor.value === this.state.selectedNewOwner.value);
      if (!foundOrigOwner) {
        console.error('addToNewList - didn\'t find Owner in original list');
        return;
      }
      // replace the user in the RoleList
      const origOwner = this.clone(foundOrigOwner);
      origOwner.operation = 'Update';
      // console.log('addToNewList - origOwner', window.pretty(origOwner));

      valueVMRoleList[0] = origOwner;
    }

    const { newIdentities } = this.state;
    const foundIndex = newIdentities.findIndex(owner => // did we already add this owner type?
      owner.tail.id === this.state.selectedOwnerType);
    if (foundIndex > -1) {
      newIdentities[foundIndex] = currentOwnerType;
    } else {
      newIdentities.push(currentOwnerType);
      // const arrCurrentOwner = [currentOwnerType];
      // const newIds = [...newIdentities, currentOwnerType];
      // console.log('NEWIDS AFTER', window.pretty(newIdentities));
    }
    this.setState([newIdentities]);
    this.props.updateViewData([newIdentities]);
    // setTimeout(console.log('NEWIDENTITIES END', window.pretty(this.state.newIdentities)), 10);
  }

  // ===============================================================================
  // StepZilla functions
  // ===============================================================================
  isValidated = () => {
    const userInput = this._grabUserInput();
    // console.log('isValidated', window.pretty(userInput.selectedNewOwner.label));
    let isDataValid = false;
    const validateNewInput = this.validateData(userInput);
    // console.log('validateNewInput', window.pretty(validateNewInput));

    // if full validation passes then save to store and pass as valid
    if (Object.keys(validateNewInput).every(k => validateNewInput[k] === true)) {
      // PERSIST
      if (userInput) {
        this.props.updateViewData({ selectedNewOwner: userInput.selectedNewOwner });
        this.addToNewList();
      }
      isDataValid = true;
    } else if (userInput) {
      // if anything fails then update the UI validation state but NOT the UI Data State
      // console.log('$$$$$ Step2', window.pretty(userInput), window.pretty(validateNewInput));
      this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
    } else {
      this.setState(Object.assign(validateNewInput, this._validationErrors(validateNewInput)));
    }
    return isDataValid;
  }

  _validationCheck = () => {
    // console.log('_validationCheck');
    if (!this._validateOnDemand) {
      return;
    }

    const userInput = this._grabUserInput(); // grab user entered vals
    const validateNewInput = this.validateData(userInput); // run the new input against the validator

    // const foo = Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput));
    // console.log('Foo', window.pretty(foo));

    this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
  }

  /* eslint max-len:0 */
  /* eslint class-methods-use-this:0 */

  _isOwnerSet = (data) => {
    if (data && data.selectedNewOwner && data.selectedNewOwner.label) {
      return ({
        newOwnerVal: (data.selectedNewOwner !== '' && data.selectedNewOwner.label !== ''),
      });
    }
    return false;
  };

  _isOwnerDifferent = (data) => {
    const { currentId } = this.state;
    // console.log('_isOwnerDifferent - selected', data.selectedNewOwner.id, 'currentId', currentId);
    if (data.selectedNewOwner.id !== currentId) {
      return true;
    }
    return false;
  };

  validateData(data) {
    // console.log('_validateData1', window.pretty(data));
    if (this._isOwnerSet(data) && this._isOwnerDifferent(data)) {
      return ({ newOwnerVal: true });
    }
    return ({ newOwnerVal: false });
  }

  _validationErrors(val) {
    // console.log('_validationErrors');');
    const msg = this.props.getLabel('_ChgOwn_OwnerRequiredError');
    // const errorMsg = `${this.state.labelOwnerRequiredError} ${this.state.setOwnerTypeLabel}`;
    const errorMsg = `${msg}${this.state.setOwnerTypeLabel}`;
    const errMsgs = {
      newOwnerValMsg: (val && val.newOwnerVal) ? '' : errorMsg,
    };
    return errMsgs;
  }

  _grabUserInput() {
    return { selectedNewOwner: this.state.selectedNewOwner };
  }

  // ===============================================================================
  // end of StepZilla functions
  // ===============================================================================

  render() {
    // const { currentOwners } = this.state;
    // console.log('currentOwners', currentOwners);

    // explicit class assigning based on validation
    const notValidClasses = {};

    if (typeof this.state.newOwnerVal === 'undefined' || this.state.newOwnerVal) {
      notValidClasses.newOwnerClass = 'no-error col-sm-8';
    } else {
      notValidClasses.newOwnerClass = 'has-error col-sm-8';
      notValidClasses.newOwnerValGroupClass = 'val-err-tooltip';
    }

    // const getOwnerLabel = () =>
    //   this.state.ownerTypes.find(type => type.id === this.state.selectedValue).label;

    //  otherUsersLookup.filter(user => this.state.currentIds.findIndex(user.id) > -1),

    const otherUsersLookup = this.props.allUsersLookup.filter(user => user.id !== this.state.currentId);
    // console.log('current >>>', this.state.currentOwners, this.state.currentId);
    // console.log('otherUsersLookup >>>', window.pretty(otherUsersLookup));
    // console.log('TEST otherUsersLookup >>>', otherUsersLookup.findIndex(user => user.id === this.state.currentId));

    const selectProps =
      ({
        multi: false,
        autoBlur: true,
        clearable: false,
        placeholder: `select ${this.state.setOwnerTypeLabel}`,
        value: this.state.selectedNewOwner,
        options: otherUsersLookup,
        onChange: (selected) => {
          // console.log('SELECTED', window.pretty(selected));
          this.setState({ selectedNewOwner: selected });
          setTimeout(() => {
            this.isValidated();
          }, 10);
        },
      });

    return (
      <div>
        <div className="step step2">
          <div className="row">
            <div className="col-sm-12 control-label" >
              <div className="panel-label">{this.state.setOwnerTypeLabel}</div>
            </div>
            <div className="row">&nbsp;</div>
            <div>
              <span className="control-label col-sm-3">Current: </span>
              <span className="property-value col-sm-7">
                { this.state.currentOwners }
              </span>
            </div>
          </div>
          <div className="row">
            <form id="Form" className="form-horizontal">
              <div className="form-group">
                <div className="control-label col-sm-3">New: </div>
                <div className={`${notValidClasses.indexClass} col-sm-7`} >
                  <Select {...selectProps} ref="owner" className="select-primary-color" />
                  <div className={notValidClasses.newOwnerValGroupClass}>
                    {this.state.newOwnerValMsg}
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="row" style={{ paddingBottom: 8 }}>&nbsp;</div>
        </div>
      </div>
    );
  }
}
