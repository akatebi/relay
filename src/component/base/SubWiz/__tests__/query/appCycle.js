export default `
  query AppCycleQuery($path: String!, $processType: String!) {
    approvalCycleList(path: $path, processType: $processType) {
      ...AppCycle_approvalCycleList
    }
  }
  fragment AppCycle_approvalCycleList on ApprovalCycleList {
    list {
      id
      label
    }
  }
`;
