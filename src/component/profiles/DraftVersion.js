import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import React, { Component } from 'react';
import { FormControl } from 'react-bootstrap';
import clone from 'clone';
import { draftVersionFilter } from '../../service/profile/regexService';

// const debug = require('debug')('app:component:profiles:DraftVersion');

class DraftVersion extends Component {

  static propTypes = {
    action: PropTypes.string.isRequired,
    propertyContent: PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      propertyType: PropTypes.string.isRequired,
      isEditable: PropTypes.bool.isRequired,
      valueVM: PropTypes.shape({
        valueVMControlNumber: PropTypes.shape({
          prefix: PropTypes.string.isRequired,
          suffix: PropTypes.string.isRequired,
          sequenceNumber: PropTypes.string.isRequired,
          controlNumberString: PropTypes.string.isRequired,
          sequenceType: PropTypes.string.isRequired,
          version: PropTypes.string.isRequired,
          draftVersion: PropTypes.string,
        }).isRequired,
      }).isRequired,
    }).isRequired,
    updateValueVM: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { propertyContent: { valueVM } } = this.props;
    this.state = { valueVM };
  }

  render() {
    const {
      action,
      onChange,
      propertyContent: {
        valueVM: { valueVMControlNumber: { draftVersion } },
      },
    } = this.props;
    const editMode = action === 'edit';

    // const keyDown = e => debug('%%% KEYDOWN', e.key);

    const filterKeys = (e) => {
      // debug('filterKeys', e.key);
      // only allow printable characters
      const isPrintableChar = e.key.length === 1;
      const noModifier = !e.ctrlKey && !e.metaKey && !e.altKey;
      if (!isPrintableChar || !noModifier) {
        e.preventDefault();
      }
    };

    const editProps = {
      bsSize: 'sm',
      style: { textAlign: 'left' },
      type: 'text',
      value: this.state.valueVM.valueVMControlNumber.draftVersion || '',
      onChange: ({ target: { value } }) => {
        // debug('>>> onChange', value);
        const cloned = clone(this.state.valueVM);
        cloned.valueVMControlNumber.draftVersion = value;
        this.setState({ valueVM: cloned });

        if (value && (!draftVersionFilter(value) || value.length > 8)) {
          // debug('>>> draftVersionFilter - BAD', value);
          this.setState({ invalid: true });
        } else {
          // debug('>>> draftVersionFilter - GOOD', value);
          this.setState({ invalid: false });
          const { updateValueVM } = this.props;
          updateValueVM(cloned);
          const { propertyContent: { id, propertyType, valueVM: { valueVMControlNumber: valueVM } } } = this.props;
          onChange({ id, propertyType, valueVM, value: this.state.valueVM.valueVMControlNumber });
        }
      },
    };

    return (
      <div className="row" >
        <span className="property-label-color col-sm-2" style={{ marginTop: 6, marginLeft: 0 }} >
          Draft Version
        </span>

        <span>
          {editMode ?
            <span>
              <span className="col-sm-8">
                <form className="form-horizontal">
                  <FormControl
                    {...editProps}
                    style={{ border: (this.state.invalid && '2px solid red') }}
                    onKeyPress={e => filterKeys(e)}
                  />
                </form>
              </span>
            </span> :
            <span>{draftVersion}</span>
          }
        </span>
      </div>
    );
  }
}

export default createFragmentContainer(DraftVersion, {
  propertyContent: graphql`
  fragment DraftVersion_propertyContent on PropertyContent {
    id
    label
    propertyType
    isEditable
    valueVM {
      ... on ControlNumberProp {
        valueVMControlNumber {
          prefix
          suffix
          sequenceNumber
          controlNumberString
          sequenceType
          version
          draftVersion
        }
      }
    }
  }
`,
});
