import React from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';
import { Alert } from 'react-bootstrap';
import Spinner from '../Spinner';
import Create from '../../newPage/Create';
import { getEnvironment } from '../environment';

// const debug = require('debug')('app:base:newPage:Create');

const Root = ({ history }) =>
  (<QueryRenderer
    environment={getEnvironment()}
    query={graphql`
      query CreateQuery {
        choiceLookups {
          ...Create_choiceLookups
        }
      }
    `}
    render={({ error, props: cprops }) => {
      if (error) {
        return (<Alert bsStyle="danger">{error.message}</Alert>);
      } else if (cprops) {
        return (
          <Create
            history={history}
            choiceLookups={cprops.choiceLookups}
          />
        );
      }
      return <Spinner />;
    }}
  />);

Root.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Root;
