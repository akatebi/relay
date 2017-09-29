import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import React, { Component } from 'react';
import { FormControl } from 'react-bootstrap';
import Label from './Label';

// const debug = require('debug')('app:component:profiles:Property:IntegerProp');

class IntegerProp extends Component {

  static propTypes = {
    action: PropTypes.string.isRequired,
    propertyContent: PropTypes.shape({
      id: PropTypes.string.isRequired,
      propertyType: PropTypes.string.isRequired,
      isEditable: PropTypes.bool.isRequired,
      valueVM: PropTypes.shape({
        valueVMInteger: PropTypes.number.isRequired,
      }),
    }).isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { propertyContent: { valueVM: { valueVMInteger } } } = this.props;
    this.setState({ valueVMInteger });
  }

  render() {
    const {
      action,
      onChange,
      propertyContent,
      propertyContent: { valueVM: { valueVMInteger }, isEditable },
    } = this.props;

    const editMode = action === 'edit';

    const editProps = {
      style: { textAlign: 'left' },
      type: 'number',
      value: this.state.valueVMInteger,
      onChange: ({ target: { value: val } }) => {
        const value = parseInt(val, 10);
        this.setState({ valueVMInteger: value });
        const { propertyContent: { id, propertyType, valueVM: { valueVMInteger: valueVM } } } = this.props;
        onChange({ id, propertyType, value, valueVM });
      },
    };

    return (
      <div className="row" style={{ marginBottom: 5, marginTop: 5 }} >
        <div className="col-sm-3 nopadding">
          <Label propertyContent={propertyContent} />
        </div>
        {(editMode && isEditable) ?
          <div className="col-sm-4 leftpadding">
            <form className="form-horizontal">
              <FormControl {...editProps} />
            </form>
          </div> :
          <div className="col-sm-4 leftpadding">
            <span className="property-value">{valueVMInteger}</span>
          </div>
        }
      </div>
    );
  }
}

export default createFragmentContainer(IntegerProp, {
  propertyContent: graphql`
  fragment Integer_propertyContent on PropertyContent {
    id
    propertyType
    isEditable
    valueVM {
      ... on IntegerProp {
        valueVMInteger
      }
    }
    ...Label_propertyContent
  }
  `,
});
