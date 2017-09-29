import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import { Typeahead } from 'react-typeahead';
import { Button, ButtonToolbar } from 'react-bootstrap';
import Pending from './Pending';

// const debug = require('debug')('app:component:Cultures:Select');

class Select extends Component {

  static propTypes = {
    cultures: PropTypes.object.isRequired,
    showSelect: PropTypes.bool.isRequired,
    onHideSelect: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = { selected: {}, pending: [] };
  }

  onRemovePending = (cultureCode) => {
    const pending = this.state.pending.filter(item => item.cultureCode !== cultureCode);
    this.setState({ pending });
  };

  onRemovePendingAll = () => {
    const pending = [];
    this.setState({ pending });
  };

  onAddToPending = (evt) => {
    evt.preventDefault();
    const { selected } = this.state;
    const pending = [...this.state.pending, selected];
    this.setState({ pending });
    this.onSelectCulture();
  }

  onSelectCulture = (selected = {}) => {
    this.setState({ selected });
  }

  onCancelSelected = (evt) => {
    evt.preventDefault();
    this.onSelectCulture();
  }

  render() {
    const {
      cultures,
      cultures: { all, enabled, selectedLabels },
      showSelect,
    } = this.props;
    const { label, placeholder, addToPendingLabel, cancelLabel } = selectedLabels;
    const { selected, pending } = this.state;
    // debug('showSelect', showSelect);
    // cultures - ( enabled + pending ) = difference
    const map = cul => cul.cultureCode;
    const union = new Set([...enabled.map(map), ...pending.map(map)]);
    const difference = all.filter(cul => !union.has(cul.cultureCode));

    return (
      <div>
        <Pending
          cultures={cultures}
          pending={pending}
          onHideSelect={this.props.onHideSelect}
          onRemovePending={this.onRemovePending}
          onRemovePendingAll={this.onRemovePendingAll}
        />
        <div className={`select col-sm-4 ${!pending.length && 'col-sm-offset-4'}`}>
          {showSelect &&
          <div className="header-label">{label}
            <fieldset style={{ marginTop: 5 }}>
              {!Object.keys(selected).length &&
              <Typeahead
                placeholder={placeholder}
                maxVisible={25}
                options={difference}
                filterOption="displayName"
                customClasses={{ results: 'dropdown', listItem: 'item' }}
                displayOption={cul => cul.displayName}
                onOptionSelected={this.onSelectCulture}
                onKeyDown={() => this.onSelectCulture()}
              />
              }
              <p />
              {!!Object.keys(selected).length &&
              <div className="selected">
                <pre style={{ marginTop: -8, whiteSpace: 'pre-wrap' }}>
                  <div>{selected.displayName}</div>
                  <div>{'nativeName'}: {selected.nativeName}</div>
                  <div>{'code'}: {selected.cultureCode}</div>
                </pre>
                <div style={{ marginTop: 10 }}>
                  <ButtonToolbar>
                    <Button
                      bsSize="small"
                      bsStyle="primary"
                      onClick={this.onAddToPending}
                    >
                      <span className="glyphicon glyphicon-chevron-left" />
                      <span>&nbsp;{addToPendingLabel}</span>
                    </Button>
                    <Button bsSize="small" onClick={this.onCancelSelected} >
                      <span>{cancelLabel}</span>
                    </Button>
                  </ButtonToolbar>
                </div>
              </div>
              }
            </fieldset>
          </div>
          }
        </div>
      </div>
    );
  }
}

export default createFragmentContainer(Select, {
  cultures: graphql`
    fragment Select_cultures on Cultures {
      selectedLabels {
        label
        placeholder
        addToPendingLabel
        cancelLabel
      }
      all {
        cultureCode
        displayName
        nativeName
      }
      enabled {
        cultureCode
        displayName
        nativeName
      }
      ...Pending_cultures
    }
  `,
});
