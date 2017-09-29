export default `query TypeQuery($entityRoute: String!, $klass: String!) {
  newPageType(klass: $klass) {
    ...Type_newPageType
  }
  contentIdentity(entityRoute: $entityRoute) {
    ...Type_contentIdentity
  }
}

fragment Type_newPageType on NewPageType {
  options {
    id
    label
  }
}

fragment Type_contentIdentity on ContentIdentity {
  documentType {
    id
    label
  }
  isChangeable {
    documentType
  }
}
`;
