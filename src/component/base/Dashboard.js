import React from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';
import Alert from './Alert';
import Spinner from './Spinner';
import Dashboard from '../Dashboard';
import { getEnvironment } from './environment';

const Root = ({ location, history }) =>
  (<QueryRenderer
    environment={getEnvironment()}
    query={graphql`
      query DashboardQuery {
        dashboard {
          ...Dashboard_dashboard
        }
      }
    `}
    render={({ error, props: cprops }) => {
      if (error) {
        return <Alert message={error.message} />;
      } else if (cprops) {
        return (
          <Dashboard
            location={location}
            history={history}
            dashboard={cprops.dashboard}
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
