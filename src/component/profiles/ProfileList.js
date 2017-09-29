import PropTypes from 'prop-types';
import React from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import moment from 'moment';
import EntityLink from '../entities/EntityLink';
import Scrollbar from '../Scrollbar';
import { getEntityPluralLabelByRoute } from '../../../share/entityRouteMaps';

// const debug = require('debug')('app:component:profiles:ProfileList');

const ProfileList = ({ profileList: { tables }, history, location }) => {

  const listTotal = (tables) => {
    if (!tables || tables.length === 0) {
      return <span className="property-label"> Error! No data found</span>;
    }
    if (!tables[0].rows || tables[0].rows.length === 0) {
      return <span className="property-label"> No items found</span>;
    }
    if (tables[0].rows.length === 1) {
      return <span className="property-label"> 1 item</span>;
    }
    return <span className="property-label">{`${tables[0].rows.length} items`}</span>;
  };

  const { columnHeaders, rows } = tables[0];
  // debug('columnHeaders', window.pretty(columnHeaders));

  const showLink = rowKey => (
    <td key={`${rowKey.id}-link`}>
      <EntityLink entityVM={rowKey} location={location} />
    </td>);

  const showValue = ({ propertyType, value }) => {
    switch (propertyType) {
      case 'ControlNumber':
        return value.valueControlNumber;
      case 'Date':
        return moment(value.valueDate).format('lll');
      case 'RoleList':
        return value.valueRoleList.map(({ label }) => label);
      case 'Text':
        return value.valueText;
      default:
        console.error(`${propertyType} is unknown`);
        return null;
    }
  };

  const showRows = () => {
    // debug('rowKey', rows[0].rowKey);
    if (rows.length === 1 && rows[0].rowKey.entityType === 'OrganizationHierarchy') {
      history.replace(`/organizationhierarchies/revisions/${rows[0].rowKey.id.slice(0, 36)}/identity`);
      return false;
    }
    return rows.map(row => (
      <tr key={row.rowKey.id}>
        {showLink(row.rowKey)}
        {/* We skip the 1st column since it's the same as what's in rowKey */}
        {row.columns.slice(1).map(col =>
          (<td key={col.index}>
            {showValue(col)}
          </td>))
        }
      </tr>
    ));
  };

  return (
    <Scrollbar>
      <div className="col-sm-11">
        <div className="entity-label">{getEntityPluralLabelByRoute(location.pathname)}</div>
        <table className="table table-striped table-condensed table-hover">
          <thead>
            <tr>
              {columnHeaders.map(item =>
                <th key={item.index} className="header-label">{item.label}</th>)}
            </tr>
          </thead>
          <tbody>{showRows()}</tbody>
        </table>
        <div>{listTotal(tables)}</div>
      </div>
    </Scrollbar>
  );
};

ProfileList.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  profileList: PropTypes.object.isRequired,
};

export default createFragmentContainer(ProfileList, {
  profileList: graphql`
    fragment ProfileList_profileList on ProfileList {
      tables {
       columnHeaders {
         index
         label
         type
       }
       rows {
         rowKey {
            id
            entityType
            cultureCode
            familyId
            isFamily
            label
            operation
            reportingKey
            ...EntityLink_entityVM
         }
         columns {
           index
           propertyType
           value {
             __typename
             ... on TextColumnValue {
               valueText
             }
             ... on DateColumnValue {
               valueDate
             }
             ... on ControlNumberColumnValue {
               valueControlNumber
             }
             ... on RoleListColumnValue {
               valueRoleList {
                 label
               }
             }
           }
         }
       }
     }
   }
  `,
});
