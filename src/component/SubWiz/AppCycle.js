import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import Select from 'react-select';
import { Button } from 'react-bootstrap';
import qs from 'qs';
import labels from './subwizLabels.json';

const debug = require('debug')('app:component:SubWiz:AppCycle');

class AppCycle extends Component {

  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    approvalCycleList: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    processType: PropTypes.string.isRequired,
  };

  state = {};

  componentWillMount() {
    const { selectedCycleId } = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
    const selected = this.props.approvalCycleList.list.find(({ id }) => id === selectedCycleId);
    this.setState({ selected });
  }

  getLabel = key => labels.find(label => label.key === key).value;

  goNext = () => {
    const { history, location: { pathname, search } } = this.props;
    const { processType } = qs.parse(search, { ignoreQueryPrefix: true });
    const searchVal = qs.stringify({ selectedCycleId: this.state.selected.id.slice(0, 36), processType });
    history.replace({ pathname, search: searchVal });
  }

  render() {
    const notValidClasses = {};
    if (typeof this.state.indexVal === 'undefined' || this.state.indexVal) {
      notValidClasses.cycleCls = 'no-error col-md-8';
    } else {
      notValidClasses.cycleCls = 'has-error col-md-8';
      notValidClasses.cycleValGrpCls = 'val-err-tooltip';
    }
    const {
      approvalCycleList: { list },
      processType,
    } = this.props;

    if (!processType) return false;

    const placeholder = this.getLabel('_SubWiz_AppCyclePlaceholder');
    const header = this.getLabel('_SubWiz_AppCycleHeader');

    const selectProps = {
      multi: false,
      autoBlur: true,
      clearable: false,
      placeholder,
      value: this.state.selected,
      options: list,
      onChange: (selected) => {
        debug('AppCycle onChange', selected);
        this.setState({ selected });
      },
    };

    const navButtons = (
      <div className="col-sm-12">
        <div className="pull-right">
          <Button
            bsSize="small"
            bsStyle="primary"
            onClick={this.goNext}
          >
            Next
          </Button>
        </div>
      </div>
    );

    return (
      <div className="step step1">
        <div className="row">
          <div className="col-sm-12">
            {(processType === 'review' || processType === 'approval') &&
            <div className={notValidClasses.cycleCls}>
              <div className="header-label">{header}</div>
              <Select {...selectProps} className="select-primary-color" bsSize="xs" />
              <div className={notValidClasses.cycleValGrpCls}>{this.state.indexValMsg}</div>
            </div>
            }
          </div>
        </div>

        <div className="row">
          <div className="col-sm-10"><br /></div>
          {this.state.selected && navButtons}
        </div>
      </div>
    );
  }
}

export default createFragmentContainer(AppCycle, {
  approvalCycleList: graphql`
    fragment AppCycle_approvalCycleList on ApprovalCycleList {
      list {
        id
        label
      }
    }
  `,
});
