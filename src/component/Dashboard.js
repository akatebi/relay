import PropTypes from 'prop-types';
import React from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import Scrollbar from './Scrollbar';
import EntityLink from './entities/EntityLink';

// const debug = require('debug')('app:component:Dashboard');

const Dashboard = ({ dashboard: { myTaskList, myTrackingList }, location }) => {
  const emptyList = (
    <tr>
      <td colSpan="2">
        <span className="header-label2">-- no items --</span>
      </td>
    </tr>
  );
  const getMyTaskList = myTaskList =>
    myTaskList.map((myTask, i) =>
      (<tr key={i}>
        <td>
          <EntityLink
            location={location}
            entityVM={myTask.attachRevision}
          />
        </td>
        <td>
          {myTask.state}
        </td>
      </tr>),
    );
  const getMyTrackingList = myTrackingList =>
    myTrackingList.map((entity, i) =>
      (<tr key={i}>
        <td colSpan="2">
          <EntityLink
            location={location}
            entityVM={entity}
          />
        </td>
      </tr>),
    );
  return (
    <div>
      <Scrollbar>
        <div>
          <div className="row" style={{ marginBottom: '8px', marginLeft: '1px' }}>
            <div className="col-sm-12">
              <div className="entity-label">Dashboard</div>
            </div>
          </div>
          <div className="row" style={{ marginBottom: '8px', marginLeft: '1px' }}>
            <div className="col-sm-5">
              <div className="header-label" style={{ fontWeight: 'bold' }} >My Tasks</div>
              <table className="table table-striped table-condensed table-hover">
                <tbody>
                  {myTaskList.length ? getMyTaskList(myTaskList) : emptyList}
                </tbody>
              </table>
            </div>
            <div className="col-sm-5">
              <div className="header-label" style={{ fontWeight: 'bold' }} >My Tracking</div>
              <table className="table table-striped table-condensed table-hover">
                <tbody>
                  {myTrackingList.length ? getMyTrackingList(myTrackingList) : emptyList}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Scrollbar>
    </div>
  );
};

Dashboard.propTypes = {
  dashboard: PropTypes.shape({
    myTaskList: PropTypes.array.isRequired,
    myTrackingList: PropTypes.array.isRequired,
  }).isRequired,
  location: PropTypes.object.isRequired,
};

export default createFragmentContainer(Dashboard, {
  dashboard: graphql`
    fragment Dashboard_dashboard on Dashboard {
      myTrackingList {
        ...EntityLink_entityVM
      }
      myTaskList {
        state
        attachRevision {
          ...EntityLink_entityVM
        }
      }
    }
  `,
});

/*

*/
