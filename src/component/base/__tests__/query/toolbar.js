export default `
query ToolbarQuery($docId: String!, $path: String!) {
  approvalCycleToolbar(docId: $docId) {
    ...Toolbar_approvalCycleToolbar
    id
  }
  identity(path: $path) {
    ...Toolbar_identity
    id
  }
  lockStatus(path: $path) {
    ...Toolbar_lockStatus
    id
  }
  toolbar(path: $path) {
    ...Toolbar_toolbar
    id
  }
}

fragment Toolbar_approvalCycleToolbar on ApprovalCycleToolbar {
  id
  readMode {
    toolbarKey
    toolbarName
    children {
      toolbarKey
      toolbarName
    }
  }
  editMode {
    toolbarKey
    toolbarName
    children {
      toolbarKey
      toolbarName
    }
  }
}

fragment Toolbar_identity on Identity {
  lifeCycle {
    id
    lifeCycleStateContents {
      state
      id
      entityType
    }
  }
  standardProperties {
    name
    label
    valueVM
  }
}

fragment Toolbar_lockStatus on LockStatus {
  id
}

fragment Toolbar_toolbar on Toolbar {
  id
  readMode {
    toolbarKey
    toolbarName
    children {
      toolbarKey
      toolbarName
    }
  }
  editMode {
    toolbarKey
    toolbarName
    children {
      toolbarKey
      toolbarName
    }
  }
}

`;
