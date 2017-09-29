
export const selectPropsMap = list =>
  list.map(item => ({
    value: item.id ? item.id.slice(0, 36) : item.value,
    label: item.label,
    cultureCode: item.cultureCode,
    entityType: item.entityType,
    familyId: item.familyId,
    id: item.id,
    isFamily: item.isFamily,
    operation: item.operation,
    reportingKey: item.reportingKey,
  }));

// used by AppSegments
const getSegmentList = (approvalCycle) => {
  const segments = approvalCycle.approvalSegmentConfigs;

  const result = segments.length ?
    segments.map(segment => ({
      id: segment.id,
      segmentType: segment.segmentType,
      segmentLabel: segment.label,
      waitForEverybody: segment.waitForEverybody,
      placeholder: 'select approvers...',
      approverSelectionMode: segment.selectAllUsers ? 'Select Users' : 'All Matching Users',
      approverSource: segment.approverSource,
      approvers: {
        eligible: [],
        selected: [],
      },
    })) :
    ({
      id: '',
      segmentType: 'none',
      segmentLabel: 'none',
      waitForEverybody: false,
      placeholder: 'none',
      approverSelectionMode: 'none',
      approverSource: 'none',
      approvers: {
        eligible: [{ value: 'none', label: 'none' }],
        selected: [],
      },
    });
  // console.log('>>> getSegmentList result', window.pretty(result));
  return result;
};

// used by AppSegments
export const approvalCycleMap = approvalCycle =>
  ({
    id: approvalCycle.id,
    entityType: approvalCycle.entityType,
    label: approvalCycle.label,
    processType: approvalCycle.processType,
    waitForEverybody: approvalCycle.waitForEverybody,
    segmentList: getSegmentList(approvalCycle),
  });

const getAssigneesNew = (selectedApprovers) => {
  // console.log('selectedApprovers', window.pretty(selectedApprovers));
  const list = selectedApprovers.map(approver =>
    approver.reduce((acc, { segmentId, id }) => {
      acc.segmentId = segmentId;
      const obj = { id: id.slice(0, 36), isFamily: true, entityType: 'ApplicationRole' };
      acc.assignees.push(obj);
      return acc;
    }, { assignees: [] }));
  // console.log('list', window.pretty(list));
  return list;
};

const getAppCycleConfig = selectedCycleId => ({
  isFamily: true,
  id: selectedCycleId,
  entityType: 'ApprovalCycleConfig',
});

// used by AppSegments.onSubmit
// ==============================
export const mapSubmitData = ({
  lifeCycle,
  processType,
  selectedCycleId,
  selectedApprovers,
}) => {
  let toState = null;
  if (processType === 'approval') {
    toState = lifeCycle.lifeCycleStateContents
      .find(stateContent => stateContent.state === 'Approved');
    delete toState.__id;
  }
  return {
    toState,
    directApproval: false,
    isFamily: true,
    segmentAssignees: getAssigneesNew(selectedApprovers),
    approvalCycleConfig: getAppCycleConfig(selectedCycleId),
  };
};
