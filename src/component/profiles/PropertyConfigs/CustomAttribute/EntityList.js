import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import React, { Component } from 'react';
import Select from 'react-select';
import { getEntityLabelByType } from '../../../../../share/entityRouteMaps';
import { normalize } from '../../normalize';

// const debug = require('debug')('component.profiles.EntityListAttr');

class EntityListAttr extends Component {

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
    const { value: { valueEntityList } } = this.props.customAttr;
    this.setState({ valueEntityList });
  }

  requestEntities() {
    /* TODO - Get listType from config - currently hacked to get orgs*/
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
        value: { valueEntityList },
      },
    } = this.props;

    const entityType = 'ApplicationRole';

    if (!valueEntityList) {
      return false;
    }

    const placeholder = () =>
      ([
        'ApplicationRole',
        'ApprovalCycleConfig',
        'CategoryHierarchy',
        'Organization',
      ].includes(entityType)
        ? `Choose an ${getEntityLabelByType(entityType)}`
        : `Choose a ${getEntityLabelByType(entityType)}`);

    const getValue = l => ({ value: l.id, ...l });

    const pickerOptions =
      ({
        multi: false,
        autoBlur: true,
        placeholder: placeholder(),
        value: getValue(this.state.valueEntityList),
        options: this.requestEntities(),
        onChange: (v) => {
          // window.log(valueEntityList);
          this.setState({ valueEntityList: v });
          const value = normalize(v);
          const { customAttr: { name, type, value: { valueEntityList: val } } } = this.props;
          const valueEntityList = normalize(val[0]);
          onChange(name, type, valueEntityList, value);
        },
      });

    return (
      <div>
        <span className="property-label">{headerLabel}</span>
        {(action === 'edit' && isEditable) ?
          <Select {...pickerOptions} /> :
          <span>
            {valueEntityList.map(({ id, label }) =>
              <span key={id} className="value-md">{label}&nbsp;&nbsp;</span>)}
          </span>
        }
      </div>
    );
  }
}


export default createFragmentContainer(EntityListAttr, {
  customAttr: graphql`
    fragment EntityList_customAttr on CustomAttribute {
      type
      name
      value {
        ... on EntityListAttr {
          valueEntityList {
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
    fragment EntityList_optionsAttr on ValueVMOptions {
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
