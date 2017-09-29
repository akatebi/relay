import myFetch from './myFetch';
import { writeFile } from './writefile';
import { serverPath, fetchOptions } from './constant';
import { getIdentity } from './identity';
import { getEntityProfile } from './entity';
import { getApprovalCycleToolbar, getToolbar } from './toolbar';

export const getPageSave = (token, { path, docId }) =>
  getEntityProfile(token, path)
    .then(data => ({ ...data, operation: 'Update' }))
    .then((data) => {
      const basePath = path.split(`/${docId}`)[0];
      const url = `${serverPath}${basePath}`;
      const options = {
        ...fetchOptions(token),
        method: 'PUT',
        body: JSON.stringify(data),
      };
      writeFile(`${url}/save`, data, options);
      return myFetch(url, options)
        .then((flag) => {
          if (flag === true) {
            return getIdentity(token, path);
          }
          throw new Error('Save Failed');
        });
    });

export const getPageDocSave = (token, { path, docId }) =>
  getIdentity(token, path)
    .then(data => ({ ...data, operation: 'Update' }))
    .then((data) => {
      const basePath = path.split(`/${docId}`)[0];
      const url = `${serverPath}${basePath}`;
      const options = {
        ...fetchOptions(token),
        method: 'PUT',
        body: JSON.stringify(data),
      };
      writeFile(`${url}/save`, data, options);
      return myFetch(url, options)
        .then((flag) => {
          if (flag === true) {
            return getIdentity(token, path);
          }
          throw new Error('Save Failed');
        });
    });

export const getPageSavePayload = (token, { docId, path }) => {
  const identity = (path.includes('documents')) ?
    getPageDocSave(token, { path, docId }) : getPageSave(token, { path, docId });
  return identity.then((identity) => {
    const approvalCycleToolbar = getApprovalCycleToolbar(token, docId);
    const toolbar = getToolbar(token, path);
    return { identity, approvalCycleToolbar, toolbar };
  });
};
