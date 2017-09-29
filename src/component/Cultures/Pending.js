import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import { Button, ButtonToolbar } from 'react-bootstrap';
import { addCulturesMutation } from './mutation/addCultures';
import Enabled from './Enabled';

const debug = require('debug')('app:component:Cultures:Pending');

class Pending extends Component {

  static propTypes = {
    cultures: PropTypes.object.isRequired,
    relay: PropTypes.object.isRequired,
    onRemovePending: PropTypes.func.isRequired,
    onRemovePendingAll: PropTypes.func.isRequired,
    onHideSelect: PropTypes.func.isRequired,
    pending: PropTypes.array.isRequired,
  };

  onCancel = (cultureCode, evt) => {
    evt.preventDefault();
    this.props.onRemovePending(cultureCode);
  };

  onCancelAll = (evt) => {
    evt.preventDefault();
    this.props.onRemovePendingAll();
  };

  onAddToEnabled = (evt) => {
    evt.preventDefault();
    const {
      cultures: { id, enabled },
      pending: raw,
    } = this.props;
    // debug('pending', raw);
    const pending = raw.map(({ cultureCode, displayName, nativeName }) =>
      ({ cultureCode, displayName, nativeName }));
    addCulturesMutation(
      this.props.relay.environment,
      { id, enabled, pending },
      response => debug('onCompleted', response),
      error => debug('onError', error),
    );
    this.props.onRemovePendingAll();
    this.props.onHideSelect();
  };

  render() {
    const {
      cultures,
      cultures: { pendingLabels },
      pending,
    } = this.props;
    const { headerLabel, commitButtonLabel, cancelAllButtonLabel } = pendingLabels;
    return (
      <div>
        <Enabled cultures={cultures} />,
        <div className="pending col-sm-4">
          {pending.length > 0 &&
          <div>
            <div className="header-label">{headerLabel}</div>
            <table className="table table-striped table-condensed table-hover">
              <tbody>
                {pending.map((culture, index) =>
                  (<tr key={index}>
                    <td>{culture.displayName} - {culture.cultureCode}</td>
                    <td>
                      <div
                        key={index}
                        style={{ cursor: 'pointer' }}
                        className="glyphicon glyphicon-remove text-muted col-sm-offset-8"
                        onClick={this.onCancel.bind(this, culture.cultureCode)}
                      >
                      </div>
                    </td>
                  </tr>),
                )}
              </tbody>
            </table>
            <p />
            <div>
              <ButtonToolbar>
                <Button bsSize="small" bsStyle="primary" onClick={this.onAddToEnabled}>
                  <span className="glyphicon glyphicon-chevron-left" />
                  <span>&nbsp;{commitButtonLabel}</span>
                </Button>
                <Button bsSize="small" onClick={this.onCancelAll}>
                  <span>{cancelAllButtonLabel}&nbsp;</span>
                </Button>
              </ButtonToolbar>
              <p />
            </div>
          </div>
          }
        </div>
      </div>
    );
  }
}

export default createFragmentContainer(Pending, {
  cultures: graphql`
    fragment Pending_cultures on Cultures {
      id
      enabledLabels {
        message
        headerLabel
        nativeNameLabel
        cultureCodeLabel
      }
      enabled {
        displayName
        cultureCode
        nativeName
      }
      pendingLabels {
        headerLabel
        commitButtonLabel
        cancelAllButtonLabel
      }
      ...Enabled_cultures
    }
  `,
});
