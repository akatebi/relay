import React from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';
import { Alert } from 'react-bootstrap';
import { getEnvironment } from '../environment';
import Spinner from '../Spinner';
import LineItemConfig from '../../entities/entityData/LineItemConfig';
import { getGUID } from '../service';

const debug = require('debug')('app:component:base:entities:LineItemConfig');

const Root = ({ location, location: { pathname } }) => {
  const docId = getGUID(pathname);
  let path = pathname.split(docId)[0];
  path = `${path}${docId}`;
  debug('path', path);
  return (
    <QueryRenderer
      environment={getEnvironment()}
      query={graphql`
        query LineItemConfigQuery($path: String!) {
          entity(path: $path) {
            ...LineItemConfig_entity
          }
          identity(path: $path) {
            ...LineItemConfig_identity
          }
          valueVMOptions {
            ...LineItemConfig_valueVMOptions
          }
          valueVMTypeOptions(path: $path) {
            ...LineItemConfig_valueVMTypeOptions
          }
        }
      `}
      variables={{ path }}
      render={({ error, props: cprops }) => {
        if (error) {
          return (<Alert bsStyle="danger">{error.message}</Alert>);
        } else if (cprops) {
          return (
            <LineItemConfig
              location={location}
              entity={cprops.entity}
              identity={cprops.identity}
              valueVMOptions={cprops.valueVMOptions}
              valueVMTypeOptions={cprops.valueVMTypeOptions}
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
