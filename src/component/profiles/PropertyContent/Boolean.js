import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import React, { Component } from 'react';
import Label from './Label';

// const debug = require('debug')('app:component:profiles:Property:BooleanProp');

class BooleanProp extends Component {

  static propTypes = {
    action: PropTypes.string.isRequired,
    propertyContent: PropTypes.shape({
      id: PropTypes.string.isRequired,
      propertyType: PropTypes.string.isRequired,
      isEditable: PropTypes.bool.isRequired,
      valueVM: PropTypes.shape({
        valueVMBoolean: PropTypes.bool.isRequired,
      }),
    }).isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { propertyContent: { valueVM: { valueVMBoolean } } } = this.props;
    this.setState({ valueVMBoolean });
  }

  render() {
    const {
      action,
      onChange,
      propertyContent,
      propertyContent: { valueVM: { valueVMBoolean }, isEditable },
    } = this.props;

    // debug('&&&&& Boolean propertyContent', window.pretty(propertyContent));

    const editMode = action === 'edit';

    const glyphicon = valueVMBoolean ? 'glyphicon glyphicon-ok' : 'glyphicon glyphicon-remove';

    const editProps = {
      type: 'checkbox',
      checked: this.state.valueVMBoolean,
      onChange: ({ target: { checked: value } }) => {
        this.setState({ valueVMBoolean: value });
        const { propertyContent: { id, propertyType, valueVM: { valueVMBoolean: valueVM } } } = this.props;
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
              <input {...editProps} />
            </form>
          </div> :
          <div className="col-sm-4 leftpadding">
            <span className={`${glyphicon} property-value`} />
          </div>
        }
      </div>
    );
  }
}

export default createFragmentContainer(BooleanProp, {
  propertyContent: graphql`
    fragment Boolean_propertyContent on PropertyContent {
      id
      propertyType
      isEditable
      valueVM {
        ... on BooleanProp {
          valueVMBoolean
        }
      }
      ...Label_propertyContent
    }
  `,
});
