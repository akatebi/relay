import myFetch from './myFetch';
import { serverPath, fetchOptions } from './constant';
import { getIdentity } from './identity';

export const getApprovalCycleList = (token, { path, processType }) =>
  getIdentity(token, path)
    .then(({ lifeCycle: { id } }) => {
      const url = `${serverPath}/lifecycles/${id}/approvalcycleconfigs/${processType}`;
      const options = fetchOptions(token);
      return myFetch(url, options);
    });


export const getEligibleApprovers = (token, { path, selectedCycleId }) => {
  const pathActors = `${serverPath}${path}/approvalcycles/actors`;
  const tokenOptions = fetchOptions(token);
  const postOptions = {
    method: 'POST',
    body: JSON.stringify({
      isFamily: true,
      id: selectedCycleId,
      entityType: 'ApprovalCycleConfig',
    }),
  };
  const options = { ...tokenOptions, ...postOptions };
  return myFetch(pathActors, options);
};

export const getSelectedApprovalCycle = (token, selectedCycleId) => {
  const pathToRevId = `${serverPath}/approvalcycleconfigs/${selectedCycleId}/activeid`;
  const options = fetchOptions(token);
  return myFetch(pathToRevId, options)
    .then(revId => `${serverPath}/approvalcycleconfigs/revisions/${revId}`)
    .then(pathToRev => myFetch(pathToRev, options));
};
