import React from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';
import { Alert } from 'react-bootstrap';
import { withRouter } from 'react-router';
import Spinner from './Spinner';
import NavMenu from '../NavMenu';
import { getToken } from '../../constant/app';
import { getEnvironment } from './environment';


const Root = ({ history, location }) =>
  (<QueryRenderer
    environment={getEnvironment()}
    query={graphql`
      query NavMenuQuery($token: String) {
        viewer(token: $token) {
          ...NavMenu_viewer
        }
      }
    `}
    variables={{ token: getToken() }}
    render={({ error, props: cprops }) => {
      if (error) {
        return (<Alert bsStyle="danger">{error.message}</Alert>);
      } else if (cprops) {
        return (
          <NavMenu
            history={history}
            location={location}
            viewer={cprops.viewer}
          />);
      }
      return <Spinner />;
    }}
  />);

Root.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default withRouter(Root);
