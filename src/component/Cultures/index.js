import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import Select from './Select';

// const debug = require('debug')('app:component:Cultures');

class Cultures extends Component {

  static propTypes = {
    cultures: PropTypes.object.isRequired,
  }

  static childContextTypes = {
    showSelect: PropTypes.bool.isRequired,
    onHideSelect: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = { showSelect: false };
  }

  onHideSelect = () => this.setState({ showSelect: false });

  toggleShowSelect = (evt) => {
    evt.preventDefault();
    const { showSelect } = this.state;
    this.setState({ showSelect: !showSelect });
  }

  render() {
    const {
      cultures,
      cultures: { toolbarLabels: { label } },
    } = this.props;
    const { showSelect } = this.state;
    return (
      <div className="cultures">
        <div className="col-sm-12">
          <div className="entity-label">Cultures</div>
        </div>
        <div className="col-sm-12">
          <div className="toolbar">
            <a
              href="#"
              onClick={this.toggleShowSelect}
            >{label}</a>
          </div>
        </div>
        <div className="cultures">
          <Select
            cultures={cultures}
            showSelect={showSelect}
            onHideSelect={this.onHideSelect}
          />
        </div>
      </div>
    );
  }
}

export default createFragmentContainer(Cultures, {
  cultures: graphql`
    fragment Cultures_cultures on Cultures {
      toolbarLabels {
        label
      }
      ...Select_cultures
    }
  `,
});
