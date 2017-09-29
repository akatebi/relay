import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import React, { Component } from 'react';
import { FormControl } from 'react-bootstrap';
import Label from './Label';

// const debug = require('debug')('app:component:profiles:Property:RichTextProp');

class RichTextProp extends Component {

  static propTypes = {
    action: PropTypes.string.isRequired,
    propertyContent: PropTypes.shape({
      id: PropTypes.string.isRequired,
      propertyType: PropTypes.string.isRequired,
      isEditable: PropTypes.bool.isRequired,
      valueVM: PropTypes.shape({
        valueVMRichText: PropTypes.string.isRequired,
      }),
    }).isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { propertyContent: { valueVM: { valueVMRichText } } } = this.props;
    this.setState({ valueVMRichText });
  }

  render() {
    const {
      action,
      onChange,
      propertyContent,
      propertyContent: { valueVM: { valueVMRichText }, isEditable },
    } = this.props;

    const editMode = action === 'edit';

    const editProps = {
      style: { textAlign: 'left' },
      type: 'text',
      value: this.state.valueVMRichText,
      onChange: ({ target: { value } }) => {
        this.setState({ valueVMRichText: value });
        const { propertyContent: { id, propertyType, valueVM: { valueVMRichText: valueVM } } } = this.props;
        onChange({ id, propertyType, valueVM, value });
      },
    };

    return (
      <div className="row" style={{ marginBottom: 5, marginTop: 5 }} >
        <div className="col-sm-3 nopadding">
          <Label propertyContent={propertyContent} />
        </div>
        {(editMode && isEditable) ?
          <div className="col-sm-9 leftpadding">
            <form className="form-horizontal">
              <FormControl {...editProps} />
            </form>
          </div> :
          <div className="col-sm-9 leftpadding">
            <span className="property-value">{valueVMRichText}</span>
          </div>
        }
      </div>
    );
  }
}

export default createFragmentContainer(RichTextProp, {
  propertyContent: graphql`
  fragment RichText_propertyContent on PropertyContent {
    id
    propertyType
    isEditable
    valueVM {
      ... on RichTextProp {
        valueVMRichText
      }
    }
    ...Label_propertyContent
  }
  `,
});
