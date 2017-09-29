import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class Step3 extends Component {

  static propTypes = {
    identities: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      operation: PropTypes.string.isRequired,
      relationshipType: PropTypes.string.isRequired,
      tail: PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        entityType: PropTypes.string.isRequired,
        propertyType: PropTypes.string.isRequired,
        valueVM: PropTypes.shape({
          valueVMRoleList: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            cultureCode: PropTypes.string,
            entityType: PropTypes.string.isRequired,
            familyId: PropTypes.string.isRequired,
            isFamily: PropTypes.bool.isRequired,
            label: PropTypes.string.isRequired,
            operation: PropTypes.string.isRequired,
            reportingKey: PropTypes.string,
          })).isRequired,
        }).isRequired,
      }).isRequired,
    })).isRequired,
    getLabel: PropTypes.func,
    getViewData: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    resetViewData: PropTypes.func.isRequired,
    closeModal: PropTypes.func,
  };

  componentWillMount() {
    const { identities, getViewData } = this.props;
    const { newIdentities } = getViewData();
    // window.log(identities);
    // console.log('$$$$$ Step3 init', window.pretty(newIdentities));
    this.state = { identities, newIdentities };
  }

  // ===============================================================================
  // StepZilla functions
  // ===============================================================================
  isValidated() {
    const { onChange, closeModal, resetViewData } = this.props;
    const { newIdentities } = this.state;
    // console.log('isValidated');
    onChange(newIdentities);
    closeModal();
    resetViewData();
    return true;
  }
  // ===============================================================================
  // end of StepZilla functions
  // ===============================================================================

  render() {
    const { newIdentities } = this.state;
    if (!newIdentities) {
      // console.log('New Owner List is UNDEFINED');
      return false;
    }
    // console.log('New Owner List is DEFINED');

    const label1 = this.props.getLabel('_ChgOwn_Step3Header');
    // const label2 = this.props.getLabel('_ChgOwn_Step3Prompt');

    const spaces = <span>&nbsp;&nbsp;&nbsp;</span>;

    const showTransition = (newOwner) => {
      const { identities } = this.state;
      const foundCurrentOwner = identities.find(owner => owner.id === newOwner.id);
      // console.log('foundCurrentOwner', window.pretty(foundCurrentOwner));
      const { tail: { valueVM: { valueVMRoleList: currentList } } } = foundCurrentOwner;
      let currentOwnerStr = '';
      if (currentList.length === 1) {
        currentOwnerStr = currentList[0].label;
      } else {
        currentOwnerStr = currentList.map(value => value.label).join(', ');
      }

      let newOwnerStr = '';
      const { tail: { valueVM: { valueVMRoleList: newList } } } = newOwner;
      if (newList.length === 1) {
        newOwnerStr = newList[0].label;
      }
      newOwnerStr = newList.map(value => value.label).join(', ');

      // console.log('%%% current vs new', currentOwnerStr, newOwnerStr);

      if (currentOwnerStr === newOwnerStr) {
        return false;
      }

      return (<div>
        {spaces}{spaces}
        <span className="wiz-property-value">{currentOwnerStr}</span>
        {spaces}
        <span className="panel-label" style={{ fontWeight: 'bold' }}>&gt;&gt;</span>
        {spaces}
        <span className="wiz-property-value">{newOwnerStr}</span>
      </div>);
    };


    return (
      <div className="step step3">
        <div className="row">
          <div className="col-sm-12 control-label" >
            <div className="panel-label">{label1}</div> {/* Confirm Changes */}
            <br />
          </div>
        </div>
        <div className="row">
          { newIdentities &&
            newIdentities.map(newOwner =>
              (<div key={newOwner.tail.label}>
                <div className="col-sm-12 col-sm-offset-1" style={{ marginBottom: 3 }}>
                  <div className="control-label">{newOwner.tail.label}</div>
                  <div className="wiz-property-value">{showTransition(newOwner)}</div>
                </div>
              </div>),
            )
          }
        </div>

        <div className="row" style={{ paddingBottom: 8 }}>&nbsp;</div>
      </div>
    );
  }
}
