export default `query DashboardQuery {
  dashboard {
    ...Dashboard_dashboard
  }
}

fragment Dashboard_dashboard on Dashboard {
  myTrackingList {
    ...EntityLink_entityVM
    id
  }
  myTaskList {
    state
    attachRevision {
      ...EntityLink_entityVM
      id
    }
    id
  }
}

fragment EntityLink_entityVM on EntityVM {
  id
  entityType
  label
  isFamily
  revId
}`;
