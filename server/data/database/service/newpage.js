
export const postBody = ({
  org,
  type,
  layout,
  title,
  documentKind,
}) => {
  const object = {
    organization: {
      isFamily: true,
      id: org,
      entityType: 'Organization',
    },
    documentType: {
      isFamily: true,
      id: type,
      entityType: 'DocumentType',
    },
    layoutRevision:
    {
      isFamily: false,
      id: layout,
      entityType: 'Layout',
    },
    documentKind,
    title,
  };
  if (layout === 'null') {
    delete object.layoutRevision;
  }
  return object;
};

export const query = (
  propertyName,
  value,
  isFamily,
) => ({
  baseQueryType: null,
  isFamilyType: false,
  cultureCode: '',
  filters: [
    {
      $type: 'Models.QueryCriteria.Filter, Models',
      filterType: 'Eq',
      propertyName,
      value,
      isFamily,
    },
  ],
  sortOrder: [],
  skip: 0,
  top: 0,
  inlineCount: 0,
  select: null,
  isFamilyTypeResult: false,
});
