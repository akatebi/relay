import myFetch from './myFetch';
import { serverPath, fetchOptions } from './constant';
import { getIdentity } from './identity';

export const getToolbar = (token, path) => {
  const url = `${serverPath}${path}/toolbar`;
  const options = fetchOptions(token);
  return myFetch(url, options);
};

export const getApprovalCycleToolbar = (token, docId) => {
  const options = fetchOptions(token);
  // global.log(docId, 'org hierarchy docId');
  if (docId === 'active') {
    const orgHierarchyUrl = `${serverPath}/organizationhierarchies/revisions/active/activeid`;
    // global.log(docId, orgHierarchyUrl, 'getApprovalCycleToolbar');
    return myFetch(orgHierarchyUrl, options)
      // .then(data => global.log(data, 'org hierarchy id'))
      .then((data) => {
        const url = `${serverPath}/approvalcycles/revisions/${data}/toolbar`;
        return myFetch(url, options)
          .catch(error => error);
      })
      .catch(error => error);
  }
  const url = `${serverPath}/approvalcycles/revisions/${docId}/toolbar`;
  return myFetch(url, options)
    .catch(error => error);
};

const getToolbarIdentity = (token, { docId, path }, dataLoader) => {
  const identity = getIdentity(token, path, dataLoader);
  const approvalCycleToolbar = getApprovalCycleToolbar(token, docId);
  const toolbar = getToolbar(token, path);
  return { approvalCycleToolbar, toolbar, identity };
};

export const postApproveReject = (token, { action, docId, id, path }) => {
  const options = fetchOptions(token);
  const url = `${serverPath}/dashboards/mytasks`;
  return myFetch(url, options)
    .then(assignments => assignments.find(({ attachRevision }) => {
      if (!attachRevision) throw new Error('https://ibsamerica.visualstudio.com/Linqoln/Linqoln%20Team/_queries?id=3109&triage=false&_a=edit');
      return attachRevision.id === id;
    }))
    .then((assignment) => {
      if (!assignment) throw new Error(`assignment ${id} not found`);
      const options = {
        ...fetchOptions(token),
        method: 'POST',
        body: JSON.stringify(assignment),
      };
      const url = `${serverPath}/approvalcycles/${action}`;
      return myFetch(url, options)
        .then((resp) => {
          if (resp) {
            return getToolbarIdentity(token, { docId, path });
          }
          return null;
        });
    });
};

export const postTerminateClear = (token, { action, docId, id, path }) => {
  const options = fetchOptions(token);
  const url = `${serverPath}/lifecycles/${id}/activestate`;
  return myFetch(url, options)
    .then((data) => {
      const body = data.approvalContent;
      const options2 = {
        ...fetchOptions(token),
        method: 'POST',
        body: JSON.stringify(body),
      };
      const url2 = `${serverPath}/approvalcycles/promote/${action}`;
      return myFetch(url2, options2)
        .then((resp) => {
          if (resp) {
            return getToolbarIdentity(token, { docId, path });
          }
          return null;
        });
    });
};
