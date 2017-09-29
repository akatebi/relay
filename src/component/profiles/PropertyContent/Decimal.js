import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import React, { Component } from 'react';
import { FormControl } from 'react-bootstrap';
import Label from './Label';

// const debug = require('debug')('app:component:profiles:Property:DecimalProp');

class DecimalProp extends Component {

  static propTypes = {
    action: PropTypes.string.isRequired,
    propertyContent: PropTypes.shape({
      id: PropTypes.string.isRequired,
      propertyType: PropTypes.string.isRequired,
      isEditable: PropTypes.bool.isRequired,
      valueVM: PropTypes.shape({
        valueVMDecimal: PropTypes.number.isRequired,
      }),
    }).isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { propertyContent: { valueVM: { valueVMDecimal } } } = this.props;
    this.setState({ valueVMDecimal });
  }

  render() {
    const {
      action,
      onChange,
      propertyContent,
      propertyContent: { valueVM: { valueVMDecimal }, isEditable },
    } = this.props;

    const editMode = action === 'edit';

    const editProps = {
      componentClass: 'input',
      style: { textAlign: 'left' },
      type: 'number',
      value: this.state.valueVMDecimal,
      onChange: ({ target: { value: val } }) => {
        const value = parseFloat(val);
        this.setState({ valueVMDecimal: value });
        const { propertyContent: { id, propertyType, valueVM: { valueVMDecimal: valueVM } } } = this.props;
        onChange({ id, propertyType, valueVM, value });
      },
    };

    return (
      <div className="row" style={{ marginBottom: 5, marginTop: 5 }} >
        <div className="col-sm-3 nopadding">
          <Label propertyContent={propertyContent} />
        </div>
        {(editMode && isEditable) ?
          <div className="col-sm-3 leftpadding">
            <form className="form-horizontal">
              <FormControl {...editProps} />
            </form>
          </div> :
          <div className="col-sm-3 leftpadding">
            <span className="property-value">{valueVMDecimal}</span>
          </div>
        }
      </div>
    );
  }
}

export default createFragmentContainer(DecimalProp, {
  propertyContent: graphql`
  fragment Decimal_propertyContent on PropertyContent {
    id
    propertyType
    isEditable
    valueVM {
      ... on DecimalProp {
        valueVMDecimal
      }
    }
    ...Label_propertyContent
  }
  `,
});
