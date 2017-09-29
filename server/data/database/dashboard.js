import myFetch from './myFetch';
import { serverPath, fetchOptions } from './constant';

export const getMyTaskList = (token) => {
  const myTasksUrl = `${serverPath}/dashboards/mytasks`;
  const options = fetchOptions(token);
  return myFetch(myTasksUrl, options);
};

export const getMyTrackingList = (token) => {
  const myTrackingUrl = `${serverPath}/dashboards/mytracking`;
  const options = fetchOptions(token);
  return myFetch(myTrackingUrl, options)
    .then(data => data.sort((a, b) => a.label.localeCompare(b.label)));
};
