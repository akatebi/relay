import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import React, { Component } from 'react';
import Select from 'react-select';
import { normalize } from '../../normalize';
import { getEntityLabelByType } from '../../../../../share/entityRouteMaps';

// const debug = require('debug')('app:component:profiles:Property:EntityAttr');

class EntityAttr extends Component {

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
    const { valueEntity } = this.props.customAttr.value;
    this.setState({ valueEntity });
  }

  requestEntities() {
    const { optionsAttr: { entityTypeOptions } } = this.props;
    return entityTypeOptions.map(x => ({ value: x.id, ...x }));
  }

  render() {
    const { entityType } = this.props.customAttr.value.valueEntity;

    const {
      action,
      isEditable,
      onChange,
      customAttr: {
        name: headerLabel,
        value: { valueEntity },
      },
    } = this.props;

    if (!valueEntity) {
      return <span className="property-label">{headerLabel}:</span>;
    }

    const placeholder = () =>
      ([
        'ApplicationRole',
        'ApprovalCycleConfig',
        'OrganizationHierarchy',
        'Organization',
      ].includes(entityType)
        ? `Choose an ${getEntityLabelByType(entityType)}`
        : `Choose a ${getEntityLabelByType(entityType)}`);

    const x = this.state.valueEntity;
    const pickerOptions =
      ({
        multi: false,
        autoBlur: true,
        placeholder: placeholder(),
        value: { value: x.id, ...x },
        options: this.requestEntities(),
        onChange: (v) => {
          // window.log(valueEntity);
          this.setState({ valueEntity: v });
          const value = normalize(v);
          const { customAttr: { name, type, value: { valueEntity: val } } } = this.props;
          const valueEntity = normalize(val);
          onChange(name, type, valueEntity, value);
        },
      });

    return (
      <div>
        <span className="property-label">{headerLabel}</span>
        {(action === 'edit' && isEditable) ?
          <Select {...pickerOptions} /> :
          <span className="value-md">{valueEntity.label}</span>
        }
      </div>
    );
  }

}


export default createFragmentContainer(EntityAttr, {
  customAttr: graphql`
    fragment Entity_customAttr on CustomAttribute {
      type
      name
      value {
        ... on EntityAttr {
          valueEntity {
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
    fragment Entity_optionsAttr on ValueVMOptions {
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
