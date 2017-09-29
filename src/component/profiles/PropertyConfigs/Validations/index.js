import PropTypes from 'prop-types';
import React from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import { Panel } from 'react-bootstrap';
import clone from 'clone';
import PickerInput from './PickerInput';
import TextInput from '../TextInput';
import { normalize } from '../../normalize';

// const debug = require('debug')('app:component:profiles:ConfigProps:validationLookup');

const Validations = ({
  action,
  isEditable,
  onChange,
  valueVMOptions: { validationTypeOptions },
  propertyConfig: { validations },
}) => {
  const normalized = normalize(validations);
  const cloned = clone(normalized);
  return (
    <div className="row">
      <div className="col-sm-8 nopadding">
        {validations.map(({ type, messageText, regex }, i) =>
          (<Panel key={type} style={{ marginBottom: 10 }}>
            <PickerInput
              action={action}
              isEditable={isEditable}
              headerLabel="Type"
              type={type}
              placeholder="Choose a Validation Type"
              options={validationTypeOptions.map(({ id: value, label }) => ({ value, label }))}
              onChange={(_, value) => {
                cloned[i].type = value;
                onChange(validations, cloned);
              }}
            />
            <TextInput
              action={action}
              isEditable={isEditable}
              name="Message Text"
              value={messageText}
              onChange={(_, value) => {
                cloned[i].messageText = value;
                onChange(validations, cloned);
              }}
            />
            <TextInput
              action={action}
              isEditable={isEditable}
              name="Regular Expression"
              value={regex}
              onChange={(_, value) => {
                cloned[i].regex = value;
                onChange(validations, cloned);
              }}
            />
          </Panel>),
        )}
      </div>
    </div>
  );
};

Validations.propTypes = {
  action: PropTypes.string.isRequired,
  isEditable: PropTypes.bool.isRequired,
  propertyConfig: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  valueVMOptions: PropTypes.object.isRequired,
};


export default createFragmentContainer(Validations, {
  valueVMOptions: graphql`
    fragment Validations_valueVMOptions on ValueVMOptions {
      validationTypeOptions {
        id
        label
      }
    },
  `,
  propertyConfig: graphql`
    fragment Validations_propertyConfig on PropertyConfig {
      validations {
        type
        messageText
        regex
      }
    },
  `,
});
