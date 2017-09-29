export default `query CulturesQuery {
  cultures {
    ...Cultures_cultures
    id
  }
}

fragment Cultures_cultures on Cultures {
  toolbarLabels {
    label
  }
  ...Select_cultures
}

fragment Select_cultures on Cultures {
  selectedLabels {
    label
    placeholder
    addToPendingLabel
    cancelLabel
  }
  all {
    cultureCode
    displayName
    nativeName
  }
  enabled {
    cultureCode
    displayName
    nativeName
  }
  ...Pending_cultures
}

fragment Pending_cultures on Cultures {
  id
  enabledLabels {
    message
    headerLabel
    nativeNameLabel
    cultureCodeLabel
  }
  enabled {
    displayName
    cultureCode
    nativeName
  }
  pendingLabels {
    headerLabel
    commitButtonLabel
    cancelAllButtonLabel
  }
  ...Enabled_cultures
}

fragment Enabled_cultures on Cultures {
  enabledLabels {
    message
    headerLabel
    nativeNameLabel
    cultureCodeLabel
  }
  enabled {
    displayName
    cultureCode
    nativeName
  }
}
`;
