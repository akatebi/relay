export default `query KlassQuery($entityRoute: String!, $org: String!) {
  newPageKlass(org: $org) {
    ...Klass_newPageKlass
  }
  contentIdentity(entityRoute: $entityRoute) {
    ...Klass_contentIdentity
  }
}

fragment Klass_newPageKlass on NewPageKlass {
  options {
    id
    label
  }
}

fragment Klass_contentIdentity on ContentIdentity {
  documentClass {
    id
    label
  }
  isChangeable {
    documentClass
  }
}

`;
