import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import Select from 'react-select';
import { normalize } from '../../normalize';

// const debug = require('debug')('component:profiles:Property:RoleListProp');

class RoleListProp extends Component {

  static propTypes = {
    action: PropTypes.string.isRequired,
    isEditable: PropTypes.bool.isRequired,
    headerLabel: PropTypes.string.isRequired,
    property: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.shape({
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
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { defaultValue, isMultiSelect } = this.props.property;
    const { valueVMRoleList: x } = defaultValue;
    this.setState({ valueVMRoleList: isMultiSelect ? x : x[0] });
  }

  requestRoles = () => {
    const { options: { roleListOptions } } = this.props;
    return roleListOptions.map(x => ({ value: x.id, ...x }));
    // return options.rows.map(({ rowKey: x }) => ({ value: x.id, ...x }));
  }

  render() {
    const {
      action,
      isEditable,
      onChange,
      headerLabel,
      property: {
        isMultiSelect,
        defaultValue: { valueVMRoleList },
      },
    } = this.props;

    const getValue = l => (isMultiSelect ?
      l.map(x => ({ value: x.id, ...x })) :
      { value: l.id, ...l });

    const pickerOptions =
      ({
        multi: isMultiSelect,
        autoBlur: true,
        placeholder: 'Choose a Role',
        value: getValue(this.state.valueVMRoleList),
        options: this.requestRoles(),
        onChange: (valueVMRoleList) => {
          this.setState({ valueVMRoleList });
          const value = normalize(valueVMRoleList);
          const { property: { propertyType, defaultValue: { valueVMRoleList: val } } } = this.props;
          const defaultValue = normalize(val[0]);
          onChange(propertyType, defaultValue, value);
        },
      });
    return (
      <div>
        <span className="property-label">{headerLabel}</span>
        {(action === 'edit' && isEditable) ?
          <Select {...pickerOptions} /> :
          <span>
            {valueVMRoleList.map(({ id, label }) =>
              <span key={id} className="value-md">{label}</span>)}
          </span>
        }
      </div>
    );
  }
}


export default createFragmentContainer(RoleListProp, {
  property: graphql`
    fragment RoleList_property on PropertyConfig {
        isMultiSelect
        propertyType
        defaultValue {
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
      }
    `,
  options: graphql`
    fragment RoleList_options on ValueVMOptions {
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
