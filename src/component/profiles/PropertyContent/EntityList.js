import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import React, { Component } from 'react';
import Select from 'react-select';
import { getEntityLabelByType } from '../../../../share/entityRouteMaps';
import Label from './Label';
import { normalize } from '../normalize';

// const debug = require('debug')('app:component:profiles:EntityListProp');

class EntityListProp extends Component {

  static propTypes = {
    action: PropTypes.string.isRequired,
    propertyContent: PropTypes.shape({
      id: PropTypes.string.isRequired,
      propertyType: PropTypes.string.isRequired,
      isEditable: PropTypes.bool.isRequired,
      config: PropTypes.shape({
        isMultiSelect: PropTypes.bool.isRequired,
      }),
      valueVM: PropTypes.shape({
        valueVMEntityList: PropTypes.arrayOf(
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
    valueVMTypeOptions: PropTypes.shape({
      entityListOptions: PropTypes.arrayOf(
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
    const { propertyContent: { valueVM: { valueVMEntityList } } } = this.props;
    this.setState({ valueVMEntityList });
  }

  requestEntities() {
    const { entityListOptions } = this.props.valueVMTypeOptions;
    return entityListOptions.map(x => ({ value: x.id, ...x }));
  }

  render() {
    const {
      action,
      onChange,
      propertyContent,
      propertyContent: { isEditable, config: { isMultiSelect } },
    } = this.props;

    const { valueVMEntityList } = this.state;

    const editMode = action === 'edit';

    const entityType = 'ApplicationRole';

    if (!valueVMEntityList) {
      return false;
    }

    const placeholder = () =>
      ([
        'ApplicationRole',
        'ApprovalCycleConfig',
        'Organization',
      ].includes(entityType)
        ? `Choose an ${getEntityLabelByType(entityType)}`
        : `Choose a ${getEntityLabelByType(entityType)}`);

    const value = () => (isMultiSelect ?
      valueVMEntityList.map(x => ({ value: x.id, ...x })) :
      valueVMEntityList[0]);

    const pickerOptions =
      ({
        multi: isMultiSelect,
        autoBlur: true,
        placeholder: placeholder(),
        value: value(),
        options: this.requestEntities(),
        onChange: (valueVMEntityListRaw) => {
          const valueVMEntityList = isMultiSelect ? valueVMEntityListRaw : [valueVMEntityListRaw];
          this.setState({ valueVMEntityList });
          const value = normalize(valueVMEntityList);
          const { propertyContent: { id, propertyType, valueVM: { valueVMEntityList: val } } } = this.props;
          const valueVM = normalize(val);
          onChange({ id, propertyType, valueVM, value });
        },
      });

    return (
      <div className="row" style={{ marginBottom: 5, marginTop: 5 }} >
        <div className="col-sm-3 nopadding">
          <Label propertyContent={propertyContent} />
        </div>
        {(editMode && isEditable) ?
          <div className="col-sm-7 leftpadding">
            <form className="form-horizontal">
              <Select {...pickerOptions} />
            </form>
          </div> :
          <div className="col-sm-7 leftpadding">
            {valueVMEntityList.length === 1 ?
              <div className="property-value">{valueVMEntityList[0].label}</div> :
              <ul>
                {valueVMEntityList.map(({ id, label }) =>
                  <li key={id} className="property-value">{label}</li>)}
              </ul>}
          </div>
        }
      </div>
    );
  }
}

export default createFragmentContainer(EntityListProp, {
  propertyContent: graphql`
  fragment EntityList_propertyContent on PropertyContent {
    id
    propertyType
    isEditable
    config {
      isMultiSelect
    }
    valueVM {
      ... on EntityListProp {
        valueVMEntityList {
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
  valueVMTypeOptions: graphql`
    fragment EntityList_valueVMTypeOptions on ValueVMTypeOptions {
      entityListOptions {
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
