export default `query OrgQuery($entityRoute: String!) {
  newPageOrg {
    ...Org_newPageOrg
  }
  contentIdentity(entityRoute: $entityRoute) {
    ...Org_contentIdentity
  }
}

fragment Org_newPageOrg on NewPageOrg {
  options {
    id
    label
  }
}

fragment Org_contentIdentity on ContentIdentity {
  organization {
    id
    label
  }
  isChangeable {
    organization
  }
}
`;
