export default `query LayoutQuery($entityRoute: String!, $type: String!) {
  newPageLayout(type: $type) {
    ...Layout_newPageLayout
  }
  contentIdentity(entityRoute: $entityRoute) {
    ...Layout_contentIdentity
  }
}

fragment Layout_newPageLayout on NewPageLayout {
  options {
    id
    label
  }
}

fragment Layout_contentIdentity on ContentIdentity {
  title
  layout {
    id
    label
  }
  isChangeable {
    layout
  }
}
`;
