import React from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import { Alert } from 'react-bootstrap';
import Spinner from './Spinner';
import Cultures from '../Cultures';
import { getEnvironment } from './environment';


const Root = () =>
  (<QueryRenderer
    environment={getEnvironment()}
    query={graphql`
      query CulturesQuery {
        cultures {
          ...Cultures_cultures
        }
      }
    `}
    render={({ error, props: cprops }) => {
      if (error) {
        return (<Alert bsStyle="danger">{error.message}</Alert>);
      } else if (cprops) {
        return (
          <Cultures cultures={cprops.cultures} />
        );
      }
      return <Spinner />;
    }}
  />);

export default Root;
