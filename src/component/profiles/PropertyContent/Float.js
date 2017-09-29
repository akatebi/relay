import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import React, { Component } from 'react';
import { FormControl } from 'react-bootstrap';
import Label from './Label';

// const debug = require('debug')('component:profiles:Property:FloatProp');

class FloatProp extends Component {

  static propTypes = {
    action: PropTypes.string.isRequired,
    propertyContent: PropTypes.shape({
      id: PropTypes.string.isRequired,
      propertyType: PropTypes.string.isRequired,
      isEditable: PropTypes.bool.isRequired,
      valueVM: PropTypes.shape({
        valueVMFloat: PropTypes.number.isRequired,
      }),
    }).isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { propertyContent: { valueVM: { valueVMFloat } } } = this.props;
    this.setState({ valueVMFloat });
  }

  render() {
    const {
      action,
      onChange,
      propertyContent,
      propertyContent: { valueVM: { valueVMFloat }, isEditable },
    } = this.props;

    const editMode = action === 'edit';

    const editProps = {
      style: { textAlign: 'left' },
      type: 'number',
      step: '0.01',
      value: this.state.valueVMFloat,
      onChange: ({ target: { value: val } }) => {
        const value = parseFloat(val);
        this.setState({ valueVMFloat: value });
        const { propertyContent: { id, propertyType, valueVM: { valueVMFloat: valueVM } } } = this.props;
        onChange({ id, propertyType, valueVM, value });
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
            <span className="property-value">{valueVMFloat}</span>
          </div>
        }
      </div>
    );
  }
}

export default createFragmentContainer(FloatProp, {
  propertyContent: graphql`
  fragment Float_propertyContent on PropertyContent {
    id
    propertyType
    isEditable
    valueVM {
      ... on FloatProp {
        valueVMFloat
      }
    }
    ...Label_propertyContent
  }
  `,
});
