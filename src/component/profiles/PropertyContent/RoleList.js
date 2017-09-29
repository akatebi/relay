import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import React, { Component } from 'react';
import Select from 'react-select';
import Label from './Label';
import { normalize } from '../normalize';

// const debug = require('debug')('component:profiles:Property:RoleListProp');

class RoleListProp extends Component {

  static propTypes = {
    action: PropTypes.string.isRequired,
    propertyContent: PropTypes.shape({
      id: PropTypes.string.isRequired,
      propertyType: PropTypes.string.isRequired,
      isEditable: PropTypes.bool.isRequired,
      valueVM: PropTypes.shape({
        valueVMRoleList: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            entityType: PropTypes.string.isRequired,
            familyId: PropTypes.string.isRequired,
            isFamily: PropTypes.bool.isRequired,
            cultureCode: PropTypes.string.isRequired,
            operation: PropTypes.string.isRequired,
            reportingKey: PropTypes.string,
          }),
        ).isRequired,
      }).isRequired,
    }).isRequired,
    valueVMOptions: PropTypes.shape({
      roleListOptions: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
          entityType: PropTypes.string.isRequired,
          familyId: PropTypes.string.isRequired,
          isFamily: PropTypes.bool.isRequired,
          cultureCode: PropTypes.string,
          operation: PropTypes.string.isRequired,
          reportingKey: PropTypes.string,
        }),
      ).isRequired,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { valueVMRoleList } = this.props.propertyContent.valueVM;
    this.setState({ valueVMRoleList });
  }

  requestRoles = () => {
    const { roleListOptions } = this.props.valueVMOptions;
    return roleListOptions.map(x => ({ value: x.id, ...x }));
    // return valueVMOptions.rows.map(({ rowKey: x }) => ({ value: x.id, ...x }));
  }

  render() {
    const {
      action,
      onChange,
      propertyContent,
      propertyContent: { valueVM: { valueVMRoleList }, isEditable },
    } = this.props;

    const editMode = action === 'edit';
    const pickerOptions =
      ({
        multi: true,
        autoBlur: true,
        placeholder: 'Choose a Role',
        value: this.state.valueVMRoleList.map(x => ({ value: x.id, ...x })),
        options: this.requestRoles(),
        onChange: (valueVMRoleList) => {
          this.setState({ valueVMRoleList });
          const value = normalize(valueVMRoleList);
          const { propertyContent: { id, propertyType, valueVM: { valueVMRoleList: val } } } = this.props;
          const valueVM = normalize(val);
          onChange({ id, propertyType, value, valueVM });
        },
      });
    return (
      <div className="row" style={{ marginBottom: 0, marginTop: 0 }} >
        <div className="col-sm-3 nopadding">
          <Label propertyContent={propertyContent} />
        </div>
        {(editMode && isEditable) ?
          <div className="col-sm-7 leftpadding">
            <form className="form-horizontal">
              <Select {...pickerOptions} />
            </form>
          </div> :
          <div className="col-sm-7" style={{ marginBottom: 5 }}>
            {valueVMRoleList.length === 1 ?
              <div className="property-value leftpadding">{valueVMRoleList[0].label}</div> :
              <ul style={{ paddingLeft: 15, marginBottom: 0 }}>
                {valueVMRoleList.map(({ id, label }) =>
                  <li key={id} className="property-value" style={{ marginBottom: 0 }}>{label}</li>,
                )}
              </ul>}
          </div>
        }
      </div>
    );
  }
}

export default createFragmentContainer(RoleListProp, {
  propertyContent: graphql`
  fragment RoleList_propertyContent on PropertyContent {
      id
      propertyType
      isEditable
      valueVM {
        ... on RoleListProp {
          valueVMRoleList {
            id
            label
            entityType
            familyId
            isFamily
            cultureCode
            operation
            reportingKey
          }
        }
      }
      ...Label_propertyContent
    }
  `,
  valueVMOptions: graphql`
    fragment RoleList_valueVMOptions on ValueVMOptions {
      roleListOptions {
        id
        label
        entityType
        familyId
        isFamily
        cultureCode
        operation
        reportingKey
      }
    }
  `,
});
