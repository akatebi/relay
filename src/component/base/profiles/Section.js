import React from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';
import { Alert } from 'react-bootstrap';
import Spinner from '../Spinner';
import Section from '../../profiles/Section';
import { getEnvironment } from '../environment';
import { getGUID } from '../service';

const debug = require('debug')('app:base:profiles:Section');

const Root = ({ location, location: { pathname }, match: { params: { secId } } }) => {
  const docId = getGUID(pathname);
  debug('docId', docId);
  debug('secId', secId);
  let path = pathname.split(docId)[0];
  path = `${path}${docId}`;
  const secPath = `${path}/sections/${secId}`;
  return (
    <QueryRenderer
      environment={getEnvironment()}
      query={graphql`
        query SectionQuery($path: String!, $secPath: String!) {
          identity(path: $path) {
            ...Section_identity
          }
          section(secPath: $secPath) {
            ...Section_section
          }
          valueVMOptions {
            ...Section_valueVMOptions
          }
          valueVMTypeOptions(path: $path) {
            ...Section_valueVMTypeOptions
          }
        }
      `}
      variables={{ path, secPath }}
      render={({ error, props: cprops }) => {
        if (error) {
          return (<Alert bsStyle="danger">{error.message}</Alert>);
        } else if (cprops) {
          return (
            <Section
              location={location}
              showHeader={cprops.showHeader}
              identity={cprops.identity}
              section={cprops.section}
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
  match: PropTypes.object.isRequired,
};

export default Root;
