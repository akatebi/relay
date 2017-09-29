import myFetch from './myFetch';
import { writeFile } from './writefile';
import { serverPath, fetchOptions } from './constant';
import { getApprovalCycleToolbar, getToolbar } from './toolbar';
import { getIdentity } from './identity';

export const subWizSave = (token, { docId, submitData, path }) => {
  const url = `${serverPath}${path}/promote`;
  const options = {
    ...fetchOptions(token),
    method: 'POST',
    body: JSON.stringify(submitData),
  };
  writeFile(`${url}/submitData`, submitData, options);
  return myFetch(url, options)
    .then((result) => {
      if (result) {
        const approvalCycleToolbar = getApprovalCycleToolbar(token, docId);
        const identity = getIdentity(token, path);
        const toolbar = getToolbar(token, path);
        return { approvalCycleToolbar, identity, toolbar };
      }
      return null;
    });
};
