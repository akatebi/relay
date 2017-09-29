import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import React, { Component } from 'react';
import Select from 'react-select';
import { normalize } from '../../normalize';

// const debug = require('debug')('app:component:profiles:PropertyConfigs:CustomAttr:RoleList');

class RoleListAttr extends Component {

  static propTypes = {
    action: PropTypes.string.isRequired,
    isEditable: PropTypes.bool.isRequired,
    customAttr: PropTypes.object.isRequired,
    optionsAttr: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { value: { valueRoleList } } = this.props.customAttr;
    // debug('valueRoleList', valueRoleList);
    this.setState({ valueRoleList });
  }

  requestRoles = () => {
    const { optionsAttr: { entityTypeOptions } } = this.props;
    return entityTypeOptions.map(x => ({ value: x.id, ...x }));
  }

  render() {
    const {
      action,
      isEditable,
      onChange,
      customAttr: {
        name: headerLabel,
        value: { valueRoleList },
      },
    } = this.props;

    const getValue = l => ({ value: l.id, ...l });

    const pickerOptions =
      ({
        multi: false,
        autoBlur: true,
        placeholder: 'Choose a Role',
        value: getValue(this.state.valueRoleList),
        options: this.requestRoles(),
        onChange: (v) => {
          this.setState({ valueRoleList: v });
          const value = normalize(v);
          const { customAttr: { name, type, value: { valueRoleList: val } } } = this.props;
          const valueRoleList = normalize(val);
          onChange(name, type, valueRoleList, value);
        },
      });
    return (
      <div>
        <span className="property-label">{headerLabel}</span>
        {(action === 'edit' && isEditable) ?
          <Select {...pickerOptions} /> :
          <span>
            {valueRoleList.map(({ id, label }) =>
              <span key={id} className="value-md">{label}&nbsp;&nbsp;</span>)}
          </span>
        }
      </div>
    );
  }
}


export default createFragmentContainer(RoleListAttr, {
  customAttr: graphql`
    fragment RoleList_customAttr on CustomAttribute {
      type
      name
      value {
        ... on RoleListAttr {
          valueRoleList {
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
  optionsAttr: graphql`
    fragment RoleList_optionsAttr on ValueVMOptions {
      entityTypeOptions {
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
