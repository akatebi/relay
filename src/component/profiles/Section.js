import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay/compat';
import React from 'react';
import qs from 'qs';
import Header from './Header';
import IdentityHeader from './IdentityHeader';
import PropertyContent from './PropertyContent';

// const debug = require('debug')('component:profiles:Section');

const Section = ({
  identity,
  showHeader,
  location,
  valueVMOptions,
  valueVMTypeOptions,
  section: { lineItemContentRelationships, label },
  location: { search },
}, { onChangeContent }) => {

  if (!label) return false;
  const { action = 'display' } = qs.parse(search, { ignoreQueryPrefix: true });

  return (
    <div>
      {showHeader && <IdentityHeader identity={identity} location={location} />}
      <Header label={label} />
      <div>
        <table className="table table-condensed">
          <tbody>
            {lineItemContentRelationships
              .filter(lineItem => lineItem.tail.roleListContentRelationships.length)
              .map(lineItem =>
                (<tr key={lineItem.id}>
                  <td>
                    <div>
                      {lineItem.tail.roleListContentRelationships.map(property =>
                        (<div key={property.__id}>
                          <PropertyContent
                            action={action}
                            onChange={onChangeContent.bind(this, 'sectionContents')}
                            relationshipToPropertyContent={property}
                            valueVMOptions={valueVMOptions}
                            valueVMTypeOptions={valueVMTypeOptions}
                          />
                        </div>))}
                      {/* lineItem.tail.dateContentRelationships.map(property =>
                        <div key={property.__id}>
                          <PropertyContent
                            action={action}
                            onChange={onChangeContent.bind(this, 'sectionContents')}
                            relationshipToPropertyContent={property}
                          />
                        </div>) */}
                    </div>
                  </td>
                </tr>))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Section.propTypes = {
  location: PropTypes.object.isRequired,
  identity: PropTypes.object.isRequired,
  section: PropTypes.object.isRequired,
  showHeader: PropTypes.bool,
  valueVMOptions: PropTypes.object.isRequired,
  valueVMTypeOptions: PropTypes.object.isRequired,
};

Section.contextTypes = {
  onChangeContent: PropTypes.func.isRequired,
};

Section.defaultProps = {
  showHeader: true,
};

export default createFragmentContainer(Section, {
  section: graphql`
    fragment Section_section on Section {
      label
      lineItemContentRelationships {
        id
        tail {
          label
          roleListContentRelationships {
            ...PropertyContent_relationshipToPropertyContent
          }
          dateContentRelationships {
            ...PropertyContent_relationshipToPropertyContent
          }
        }
      }
    }
  `,
  identity: graphql`
    fragment Section_identity on Identity {
      ...IdentityHeader_identity
    }
  `,
  valueVMOptions: graphql`
    fragment Section_valueVMOptions on ValueVMOptions {
      ...PropertyContent_valueVMOptions
    }
  `,
  valueVMTypeOptions: graphql`
    fragment Section_valueVMTypeOptions on ValueVMTypeOptions {
      ...PropertyContent_valueVMTypeOptions
    }
  `,
});
