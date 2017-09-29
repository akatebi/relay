import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import React, { Component } from 'react';
import Select from 'react-select';
import { normalize } from '../normalize';
import { getEntityLabelByType } from '../../../../share/entityRouteMaps';
import Label from './Label';

const debug = require('debug')('app:component:profiles:PropertyContent:Entity');

class EntityProp extends Component {

  static propTypes = {
    action: PropTypes.string.isRequired,
    propertyContent: PropTypes.shape({
      id: PropTypes.string.isRequired,
      propertyType: PropTypes.string.isRequired,
      isEditable: PropTypes.bool.isRequired,
      valueVM: PropTypes.shape({
        valueVMEntity: PropTypes.shape({
          id: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
          entityType: PropTypes.string.isRequired,
          familyId: PropTypes.string.isRequired,
          isFamily: PropTypes.bool.isRequired,
          cultureCode: PropTypes.string.isRequired,
          operation: PropTypes.string.isRequired,
          reportingKey: PropTypes.string,
        }),
      }).isRequired,
    }).isRequired,
    valueVMTypeOptions: PropTypes.shape({
      entityOptions: PropTypes.arrayOf(
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
    const { propertyContent: { valueVM: { valueVMEntity } } } = this.props;
    // debug('valueVMEntity', window.pretty(valueVMEntity));
    this.setState({ valueVMEntity });
  }

  requestEntities() {
    const { entityOptions } = this.props.valueVMTypeOptions;
    return entityOptions.map(x => ({ value: x.id, ...x }));
  }

  render() {
    const {
      action,
      onChange,
      propertyContent,
      propertyContent: { isEditable },
    } = this.props;

    const editMode = action === 'edit';

    const { valueVMEntity } = this.state;

    const valueVM = valueVMEntity;

    const placeholder = () => `Choose one ${getEntityLabelByType('User')}`;

    const getValue = l => (l ? ({ value: l.id, ...l }) : null);

    const pickerOptions =
      ({
        multi: false,
        autoBlur: false,
        placeholder: placeholder(),
        value: getValue(valueVM),
        options: this.requestEntities(),
        onChange: (valueVMEntity) => {
          debug('ON CHANGE');
          this.setState({ valueVMEntity });
          const value = normalize(valueVMEntity);
          const { propertyContent: { id, propertyType, valueVM: { valueVMEntity: val } } } = this.props;
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
            <span className="property-value">{valueVMEntity && valueVMEntity.label}&nbsp;&nbsp;</span>
          </div>
        }
      </div>
    );
  }
}

export default createFragmentContainer(EntityProp, {
  propertyContent: graphql`
    fragment Entity_propertyContent on PropertyContent {
      id
      propertyType
      isEditable
      valueVM {
        ... on EntityProp {
          valueVMEntity {
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
    fragment Entity_valueVMTypeOptions on ValueVMTypeOptions {
      entityOptions {
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
