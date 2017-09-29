import React from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';
import { Alert } from 'react-bootstrap';
import { getEnvironment } from '../environment';
import Spinner from '../Spinner';
import TemplateLayout from '../../entities/entityData/TemplateLayout';
import { getGUID } from '../service';

const debug = require('debug')('app:component:base:entities:TemplateLayout');

const Root = ({ location, location: { pathname } }) => {
  const docId = getGUID(pathname);
  let path = pathname.split(docId)[0];
  path = `${path}${docId}`;
  debug('path', path);
  return (
    <QueryRenderer
      environment={getEnvironment()}
      query={graphql`
        query TemplateLayoutQuery($path: String!) {
          entity(path: $path) {
            ...TemplateLayout_entity
          }
          identity(path: $path) {
            ...TemplateLayout_identity
          }
        }
      `}
      variables={{ path }}
      render={({ error, props: cprops }) => {
        if (error) {
          return (<Alert bsStyle="danger">{error.message}</Alert>);
        } else if (cprops) {
          return (
            <TemplateLayout
              location={location}
              entity={cprops.entity}
              identity={cprops.identity}
            />
          );
        }
        return <Spinner />;
      }}
    />
  );
};

Root.propTypes = {
  location: PropTypes.object.isRequired,
};

export default Root;
