import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';
import React from 'react';
import Identity from './Identity';
import Section from './Section';

// const debug = require('debug')('component:profiles:SectionsAll');

const SectionsAll = ({
  associations,
  controlNumberSequence,
  identity,
  location,
  lockStatus,
  selfRolesLookup,
  sectionsAll: { sections },
  valueVMOptions,
  valueVMTypeOptions,
}) => (
  <div>
    <Identity
      associations={associations}
      controlNumberSequence={controlNumberSequence}
      identity={identity}
      location={location}
      lockStatus={lockStatus}
      selfRolesLookup={selfRolesLookup}
      valueVMOptions={valueVMOptions}
      valueVMTypeOptions={valueVMTypeOptions}
    />
    {sections.map(section =>
      (<Section
        key={section.__id}
        identity={identity}
        location={location}
        section={section}
        showHeader={false}
        valueVMOptions={valueVMOptions}
        valueVMTypeOptions={valueVMTypeOptions}
      />))}
  </div>
);

SectionsAll.propTypes = {
  associations: PropTypes.object.isRequired,
  controlNumberSequence: PropTypes.object,
  identity: PropTypes.object.isRequired,
  lockStatus: PropTypes.object.isRequired,
  sectionsAll: PropTypes.object.isRequired,
  selfRolesLookup: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  valueVMOptions: PropTypes.object.isRequired,
  valueVMTypeOptions: PropTypes.object.isRequired,
};

export default createFragmentContainer(SectionsAll, {
  identity: graphql`
    fragment SectionsAll_identity on Identity {
      ...Identity_identity
      ...Section_identity
    }
  `,
  controlNumberSequence: graphql`
    fragment SectionsAll_controlNumberSequence on ControlNumberSequence {
      ...Identity_controlNumberSequence
    }
  `,
  lockStatus: graphql`
    fragment SectionsAll_lockStatus on LockStatus {
      ...Identity_lockStatus
    }
  `,
  sectionsAll: graphql`
    fragment SectionsAll_sectionsAll on Sections {
      sections {
        ...Section_section
      }
    }
  `,
  valueVMOptions: graphql`
    fragment SectionsAll_valueVMOptions on ValueVMOptions {
      ...Identity_valueVMOptions
      ...Section_valueVMOptions
    }
  `,
  valueVMTypeOptions: graphql`
    fragment SectionsAll_valueVMTypeOptions on ValueVMTypeOptions {
      ...Identity_valueVMTypeOptions
      ...Section_valueVMTypeOptions
    }
  `,
});
