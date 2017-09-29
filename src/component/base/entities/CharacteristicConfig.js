import React from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';
import { Alert } from 'react-bootstrap';
import { getEnvironment } from '../environment';
import Spinner from '../Spinner';
import CharacteristicConfig from '../../entities/entityData/CharacteristicConfig';
import { getGUID } from '../service';

const debug = require('debug')('app:component:base:entities:CharacteristicConfig');

const Root = ({ location, location: { pathname } }) => {
  const docId = getGUID(pathname);
  let path = pathname.split(docId)[0];
  path = `${path}${docId}`;
  debug('CharacteristicConfig path', path);
  return (
    <QueryRenderer
      environment={getEnvironment()}
      query={graphql`
        query CharacteristicConfigQuery($path: String!) {
          entity(path: $path) {
            ...CharacteristicConfig_entity
          }
          identity(path: $path) {
            ...CharacteristicConfig_identity
          }
          valueVMOptions {
            ...CharacteristicConfig_valueVMOptions
          }
          valueVMTypeOptions(path: $path) {
            ...CharacteristicConfig_valueVMTypeOptions
          }
        }
      `}
      variables={{ path }}
      render={({ error, props: cprops }) => {
        if (error) {
          return (<Alert bsStyle="danger">{error.message}</Alert>);
        } else if (cprops) {
          return (
            <CharacteristicConfig
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
