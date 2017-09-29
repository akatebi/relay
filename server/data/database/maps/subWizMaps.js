const getSegmentList = (approvalCycle) => {
  const segments = approvalCycle.approvalSegmentConfigs;
  // console.log('approvalCycle.approvalSegmentConfigs',
  //   window.pretty(segments), segments.length);

  const result = segments.length ?
    segments.map(segment => ({
      id: segment.id,
      segmentType: segment.segmentType,
      waitForEverybody: segment.waitForEverybody,
      placeholder: 'select approvers...',
      approverSource: segment.label,
      approverSelectionMode: segment.selectAllUsers ? 'Select Users' : 'All Matching Users',
      approvers: {
        eligible: [],
        selected: [],
      },
    })) :
    ({
      id: '',
      segmentType: 'none',
      waitForEverybody: false,
      placeholder: 'none',
      approverSource: 'none',
      approverSelectionMode: 'none',
      approvers: {
        eligible: [{ value: 'none', label: 'none' }],
        selected: [],
      },
    });
  // console.log('getSegmentList result', window.pretty(result));
  return result;
};

export const approvalCycleMap = approvalCycle =>
  ({
    id: approvalCycle.id,
    entityType: approvalCycle.entityType,
    // label: getProfileLabel(approvalCycle),  // approvalCycle.label,
    label: approvalCycle.label,
    processType: approvalCycle.processType,
    waitForEverybody: approvalCycle.waitForEverybody,
    segmentList: getSegmentList(approvalCycle),
  });

export const approvalSegmentListMap = (segmentList) => {
  const segments = Object.keys(segmentList);

  return segments.map(segment => ({
    segmentId: segment,
    approvers: segmentList[segment],
  }));
};
