const getProperty = (tail) => {
  const cfg = tail.config;
  return {
    id: tail.id,
    propertyType: tail.propertyType,
    name: tail.name,
    valueVM: tail.valueVM,
    label: tail.label,
    reportingKey: tail.reportingKey,
    operation: tail.operation,
    config: {
      id: cfg.id,
      isMultiSelect: cfg.isMultiSelect,
      isVisible: cfg.isVisible,
      listType: cfg.listType,
      defaultValue: cfg.defaultValue,
      propertyType: cfg.propertyType,
      propertyBehavior: cfg.propertyBehavior,
      label: cfg.label,
      operation: cfg.operation,
      validations: cfg.validations,
      isRequired: !!cfg.validations.find(validation => validation.type === 'Required'),
    },
  };
};

export const customPropsMap = (customProperties) => {
  const props = customProperties.map((cp, i) => ({
    group: cp.tail.config && cp.tail.config.group.value,
    cultureCode: cp.tail.config && cp.tail.config.group.cultureCode,
    property: getProperty(cp.tail, i),
  })).sort((a, b) => a.group.localeCompare(b.group));
  // console.log('#### 1111', window.pretty(props));
  const ary = props.reduce((accum, value) => {
    const itemFound = accum.find(item => value.group === item.group);
    if (itemFound) {
      itemFound.properties.push(value.property);
    } else {
      accum.push({
        group: value.group,
        cultureCode: value.cultureCode,
        properties: [value.property],
      });
    }
    return accum;
  }, []);
  // console.log('#### 2222', window.pretty(ary));
  return ary;
};
