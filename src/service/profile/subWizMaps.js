// used by Toolbar.onArchive
// ==============================
export const mapArchiveData = (lifeCycle) => {
  const toState = lifeCycle.lifeCycleStateContents
    .find(stateContent => stateContent.state === 'Archived');
  delete toState.__id;
  // console.log('mapArchiveData - lifeCycleState', window.pretty(lifeCycle.lifeCycleStateContents));
  return {
    toState,
    directApproval: true,
    isFamily: true,
  };
};
