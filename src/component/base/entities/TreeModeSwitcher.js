import React from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';
import { Alert } from 'react-bootstrap';
import Spinner from '../Spinner';
import TreeModeSwitcher from '../../entities/TreeModeSwitcher';
import { getEnvironment } from '../environment';
import { entityRouteToTypeMap } from '../../../../share/entityRouteMaps';
import { getGUID } from '../service';

const debug = require('debug')('app:component:base:entities:TreeModeSwitcher');

const Root = ({ location, location: { pathname } }) => {
  const docId = getGUID(pathname);
  debug('docId', docId);
  let path = pathname.split(docId)[0];
  path = `${path}${docId}`;
  const entityType = entityRouteToTypeMap(pathname);
  const basePath = pathname.split('/')[1];
  const active = docId || 'active';
  const nestFlatPath = `${basePath}/revisions/${active}`;
  const flatOnly = basePath.includes('choicelists');
  debug('path', path);
  debug('basePath', basePath);
  debug('entityType', entityType);
  debug('flatOnly', flatOnly);
  return (
    <QueryRenderer
      environment={getEnvironment()}
      query={graphql`
        query TreeModeSwitcherQuery($entityType: String!, $nestFlatPath: String!, $path: String!, $flatOnly: Boolean!) {
          identity(path: $path) {
            ...TreeModeSwitcher_identity
          }
          entity(path: $path) {
            ...TreeModeSwitcher_entity
          }
          entityOptionLookups(entityType: $entityType) {
            ...TreeModeSwitcher_entityOptionLookups
          }
          nested(nestFlatPath: $nestFlatPath, flatOnly: $flatOnly) {
            ...TreeModeSwitcher_nested @skip(if: $flatOnly)
          }
          flat(nestFlatPath: $nestFlatPath) {
            ...TreeModeSwitcher_flat
          }
        }
      `}
      variables={{ nestFlatPath, path, entityType, flatOnly }}
      render={({ error, props: cprops }) => {
        if (error) {
          return (<Alert bsStyle="danger">{error.message}</Alert>);
        } else if (cprops) {
          return (
            <TreeModeSwitcher
              basePath={basePath}
              location={location}
              entityOptionLookups={cprops.entityOptionLookups}
              entity={cprops.entity}
              identity={cprops.identity}
              nested={cprops.nested}
              flat={cprops.flat}
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
