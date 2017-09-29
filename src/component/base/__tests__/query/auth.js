export default `query AuthQuery {
  viewer {
    ...Auth_viewer
  }
}

fragment Auth_viewer on Viewer {
  error
  userIdentity {
    token
    user {
      id
      label
      entityType
    }
    organization {
      id
      label
      entityType
    }
  }
}
`;
