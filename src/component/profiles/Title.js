import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import ControlNumber from './ControlNumber';
import DraftVersion from './DraftVersion';
import TextField from './TextField';

// const debug = require('debug')('app:component:profiles:Title');

class Title extends Component {

  static propTypes = {
    action: PropTypes.string.isRequired,
    controlNumberSequence: PropTypes.object,
    identity: PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      identities: PropTypes.array.isRequired,
    }).isRequired,
    status: PropTypes.string.isRequired,
    // onChange: PropTypes.func.isRequired,
  };

  static contextTypes = {
    onChangeContent: PropTypes.func.isRequired,
    onChangeField: PropTypes.func.isRequired,
  }

  componentWillMount = () => {
    const { identity: { label: title, identities } } = this.props;
    const controlNumberProp = identities.find(id => id.tail.propertyType === 'ControlNumber');
    const { tail: { valueVM } } = controlNumberProp;
    this.setState({ title, valueVM, controlNumberProp });
  }

  render() {
    const {
      action,
      controlNumberSequence,
      identity,
      identity: { id, label },
      status,
      // onChange,
    } = this.props;
    const { title } = this.state;
    const { onChangeContent, onChangeField } = this.context;

    const editMode = action === 'edit';

    const updateValueVM = (valueVM) => {
      this.setState({ valueVM });
    };

    const identityCalc = () => {
      const { title, valueVM } = this.state;
      const { valueVMControlNumber: { controlNumberString, version, draftVersion } } = valueVM;
      // debug('identityCalc', { controlNumberString, version, draftVersion });
      let draft = '';
      if (draftVersion) {
        draft = `/ ${draftVersion}`;
      }
      return `${controlNumberString || '<no control number>'} / ${version} ${draft} - "${title}"`;
    };

    const titleRead = () => {
      const isNew = status === 'New';
      return !isNew ? (
        <div className="row">
          <div className="col-sm-12 title1 nopadding">{identityCalc()}</div>
        </div>
      ) :
        (
          <div className="row">
            <div className="col-sm-12 title1 nopadding">{title}</div>
          </div>
        );
    };

    const showChangeControlNumber = (sequenceType, sequences) => {
      if (sequenceType === 'Auto' && sequences.length <= 1) {
        // debug('showChangeControlNumber - Auto and one sequence - HIDE');
        return false;
      }
      if (sequenceType === 'Disable') {
        // debug('showChangeControlNumber - Disable - HIDE');
        return false;
      }
      // debug('showChangeControlNumber - SHOW');
      return true;
    };

    const showChangeControlNumberButton = (sequenceType, sequences) => {
      if (showChangeControlNumber(sequenceType, sequences)) {
        return (<div style={{ marginTop: 6, marginBottom: 6 }}>
          <Button
            bsStyle="primary"
            bsSize="xsmall"
            onClick={this.openControlNumberModal}
          >Change Control Number</Button>
        </div>);
      }
      return <div></div>;
    };

    const controlNumberModal =
      (<div>
        <Modal
          show={this.state.showControlNumberModal}
          onHide={this.closeControlNumberModal}
          dialogClassName="modal-control-number"
          enforceFocus
        >
          <Modal.Header closeButton>
            <Modal.Title>Control Number</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ paddingTop: 0, marginTop: 0, marginBottom: 48 }}>
            <ControlNumber
              action={action}
              controlNumberSequence={controlNumberSequence}
              identity={identity}
              onChange={onChangeContent.bind(this, 'identities')}
            />
          </Modal.Body>
        </Modal>
      </div>);

    const controlNumberRead = (controlNumberString, version) => (
      <div className="row" style={{ marginBottom: 12, marginTop: 6 }}>
        <span className="col-sm-6">
          <span className="property-label-color">Control Number: </span>
          <span className="property-value">
            {`${controlNumberString || '<no control number>'}`}
          </span>
        </span>
        <span className="col-sm-3">
          <span className="property-label-color">Version: </span>
          <span className="property-value">{version}</span>
        </span>
      </div>);

    const titleEdit = () => {
      const isNew = status === 'New';
      const { valueVM } = this.state;
      const { valueVMControlNumber: { controlNumberString, version, sequenceType } } = valueVM;
      const { sequences } = controlNumberSequence;
      const field = {
        label: 'Title',
        value: this.state.title,
        prop: 'label',
        isRequired: false,
      };
      const titleFieldProps = (action, field) => ({
        action,
        field,
        onChange: (value) => {
          this.setState({ title: value });
          onChangeField(id, field.prop, label, value);
        },
      });

      return (
        <div>
          {!isNew &&
            (<div>
              <div className="row" style={{ marginBottom: 0, marginTop: 6 }}>
                <div className="col-sm-12">
                  {showChangeControlNumberButton(sequenceType, sequences)}
                </div>
              </div>

              {this.state.showControlNumberModal ?
                controlNumberModal :
                controlNumberRead(controlNumberString, version)}

              <div className="row" style={{ marginBottom: 0, marginTop: 6 }}>
                <TextField {...titleFieldProps(action, field)} />
              </div>

              <div className="row" style={{ marginBottom: 6, marginTop: 6 }}>
                <DraftVersion
                  action={action}
                  updateValueVM={updateValueVM}
                  onChange={onChangeContent.bind(this, 'identities')}
                  propertyContent={this.state.controlNumberProp.tail}
                />
              </div>
            </div>)}
        </div>
      );
    };

    return (
      <div className="row" >
        <div className="col-sm-11 nopadding">
          {titleRead()}
          {editMode && titleEdit()}
        </div>
      </div>
    );
  }
}

export default createFragmentContainer(Title, {
  controlNumberSequence: graphql`
    fragment Title_controlNumberSequence on ControlNumberSequence {
      sequences {
        prefix
      }
      ...ControlNumber_controlNumberSequence
    }
  `,
  identity: graphql`
    fragment Title_identity on Identity {
      id
      label
      entityType
      formHeader
      reportingKey
      identities {
        tail {
          propertyType
          valueVM {
            ... on ControlNumberProp {
              valueVMControlNumber {
                controlNumberString
                draftVersion
                version
                sequenceType
              }
            }
          }
          ...DraftVersion_propertyContent
        }
      }
      ...ControlNumber_identity
    }
  `,
});
