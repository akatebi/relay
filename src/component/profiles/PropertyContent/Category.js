import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import React, { Component } from 'react';
import Select from 'react-select';
import Label from './Label';
import { normalize } from '../normalize';

// const debug = require('debug')('app:component:profiles:Property:CategoryProp');

class CategoryProp extends Component {

  static propTypes = {
    action: PropTypes.string.isRequired,
    propertyContent: PropTypes.shape({
      id: PropTypes.string.isRequired,
      propertyType: PropTypes.string.isRequired,
      isEditable: PropTypes.bool.isRequired,
      valueVM: PropTypes.shape({
        valueVMCategory: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string,
            entityType: PropTypes.string.isRequired,
            familyId: PropTypes.string.isRequired,
            isFamily: PropTypes.bool.isRequired,
            cultureCode: PropTypes.string,
            operation: PropTypes.string.isRequired,
            reportingKey: PropTypes.string,
          }),
        ).isRequired,
      }).isRequired,
    }).isRequired,
    valueVMOptions: PropTypes.shape({
      categoryOptions: PropTypes.arrayOf(
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
    const { valueVMCategory } = this.props.propertyContent.valueVM;
    this.setState({ valueVMCategory });
  }

  requestCategories = () => {
    const { categoryOptions } = this.props.valueVMOptions;
    // this.state.$values = valueVMOptions;
    return categoryOptions.map(x => ({ value: x.id, ...x }));
    // return valueVMOptions.rows.map(({ rowKey: x }) => ({ value: x.id, ...x }));
  }

  render() {
    const {
      action,
      onChange,
      propertyContent,
      propertyContent: { valueVM: { valueVMCategory }, isEditable },
    } = this.props;

    // debug('%%%% valueVMCategory', window.pretty(valueVMCategory));

    const editMode = action === 'edit';

    // if (!valueVMCategory) return false;

    const pickerOptions =
      ({
        multi: true,
        autoBlur: true,
        placeholder: 'Choose a Category (DE)',
        value: this.state.valueVMCategory.map(x => ({ value: x.id, ...x })),
        options: this.requestCategories(),
        onChange: (valueVMCategory) => {
          // window.log(valueVMCategory);
          this.setState({ valueVMCategory });
          const value = normalize(valueVMCategory);
          const { propertyContent: { id, propertyType, valueVM: { valueVMCategory: val } } } = this.props;
          const valueVM = normalize(val);
          onChange({ id, propertyType, valueVM, value });
        },
      });

    const categoryLabel = () => {
      const category = valueVMCategory[0];
      if (!category) {
        return '';
      }
      const label = category.label;
      if (!label) {
        return '';
      }
      return label;
    };

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
            {valueVMCategory.length === 1 ?
              <div className="property-value">{categoryLabel()}</div> :
              <ul>
                {valueVMCategory.map(({ id, label }) =>
                  <li key={id} className="property-value">{label}</li>)}
              </ul>}
          </div>
        }
      </div>
    );
  }
}

export default createFragmentContainer(CategoryProp, {
  propertyContent: graphql`
    fragment Category_propertyContent on PropertyContent {
      id
      propertyType
      isEditable
      valueVM {
        ... on CategoryProp {
          valueVMCategory {
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
    fragment Category_valueVMOptions on ValueVMOptions {
      categoryOptions {
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
