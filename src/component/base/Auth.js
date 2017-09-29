import React from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';
import { Alert } from 'react-bootstrap';
import Spinner from './Spinner';
import Auth from '../Auth';
import { getToken } from '../../constant/app';
import { getEnvironment } from './environment';

const Root = ({ location, history }) =>
  (<QueryRenderer
    environment={getEnvironment()}
    query={graphql`
      query AuthQuery {
        viewer {
          ...Auth_viewer
        }
      }
    `}
    variables={{ token: getToken() }}
    render={({ error, props: cprops }) => {
      if (error) {
        return (<Alert bsStyle="danger">{error.message}</Alert>);
      } else if (cprops) {
        return (
          <Auth
            history={history}
            location={location}
            viewer={cprops.viewer}
          />);
      }
      return <Spinner />;
    }}
  />);

Root.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default Root;
