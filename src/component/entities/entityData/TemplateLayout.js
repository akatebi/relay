import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import qs from 'qs';
import SimpleTextField from '../../profiles/SimpleTextField';
import IdentityHeader from '../../profiles/IdentityHeader';
import EntityLink from '../EntityLink';
import Scrollbar from '../../Scrollbar';

// const debug = require('debug')('component:entities:TemplateLayout');

class TemplateLayout extends Component {

  static propTypes = {
    entity: PropTypes.object.isRequired,
    identity: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount = () => {
    this.setState({ selectedSegment: null });
    // console.log('%%%% TemplateLayout', window.pretty(this.props.entity));
  }

  render() {
    const { location: { search }, entity, identity } = this.props;
    const { action = 'display' } = qs.parse(search, { ignoreQueryPrefix: true });

    const onChange = () => {};

    const textProps = (label, value) => ({
      label,
      value,
      action,
      onChange,
    });

    const relationships = () => {
      const { entity: { relationships } } = this.props;
      // console.log('relationships', window.pretty(relationships));
      return (
        <div style={{ paddingLeft: 8 }}>
          {relationships.map((relation, i) =>
            (<div key={i} style={{ marginTop: '8px' }}>
              <EntityLink entityVM={relation.tail} location={location} />
            </div>))
          }
        </div>);
    };

    return (
      <Scrollbar>
        <div className="col-sm-12 nopadding">
          <IdentityHeader identity={identity} location={location} />
          <div className="row">
            <SimpleTextField {...textProps('TemplateLayout Name', entity.label)} />
          </div><br />
          <div className="row">
            <div className="header-label">Section Configurations</div>
          </div>
          <div className="row">{relationships()}</div>
        </div>
      </Scrollbar>
    );
  }
}

export default createFragmentContainer(TemplateLayout, {
  entity: graphql`
    fragment TemplateLayout_entity on Entity {
      id
      label
      entityType
      relationships {
        id
        relationshipType
        associationType
        tail {
          entityType
          id
          label
          value
          ...EntityLink_entityVM
        }
      }
    }
  `,
  identity: graphql`
    fragment TemplateLayout_identity on Identity {
      ...IdentityHeader_identity
    }
  `,
});
