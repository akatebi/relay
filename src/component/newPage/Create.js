import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import { Nav, NavItem } from 'react-bootstrap';
import { entityCreationFamilyRouteMap } from '../../../share/entityRouteMaps';

// const debug = require('debug')('app:component:newpage:Create');

class Create extends Component {

  static propTypes = {
    choiceLookups: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  onSelectEntity = (label, evt) => {
    evt.preventDefault();
    const entityRoute = entityCreationFamilyRouteMap(label);
    this.props.history.push({
      pathname: `/newpage/${entityRoute}`,
    });
  };

  render() {
    const { choiceLookups: { creationEntityTypes } } = this.props;

    return (
      <div className="creation">
        <div className="row" style={{ marginBottom: '8px', marginLeft: '1px' }}>
          <div className="col-sm-12">
            <div className="entity-label">Create New</div>
          </div>
        </div>

        <div className="row"><span>&nbsp;</span></div>

        <div className="row">
          <div className="col-sm-1" />
          <div className="col-sm-8 header-label">
            Select the type of Entity:
          </div>
        </div>

        <div className="row">
          <div className="col-sm-1" />
          <div className="col-sm-3" style={{ marginLeft: 20 }}>
            <Nav bsStyle="pills" stacked >
              { creationEntityTypes.map(({ value, label }) =>
                (<NavItem
                  style={{ lineHeight: 1 }}
                  key={value}
                  eventKey={value}
                  href={`#/newpage/${entityCreationFamilyRouteMap(label)}`}
                  onClick={this.onSelectEntity.bind(this, label)}
                >
                  {label}
                </NavItem>),
              )}
            </Nav>
          </div>
        </div>

      </div>
    );
  }
}

export default createFragmentContainer(Create, {
  choiceLookups: graphql`
    fragment Create_choiceLookups on ChoiceLookups {
      creationEntityTypes {
        label
        value
      }
    }
  `,
});
