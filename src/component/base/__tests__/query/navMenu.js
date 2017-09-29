export default `
  query NavMenuQuery($token: String) {
    viewer(token: $token) {
      ...NavMenu_viewer
    }
  }
  fragment NavMenu_viewer on Viewer {
    ...UserIdentity_viewer
  }
  fragment UserIdentity_viewer on Viewer {
    error
    userIdentity {
      token
      user {
        ...EntityLink_entityVM
        id
      }
      organization {
        ...EntityLink_entityVM
        id
      }
    }
  }
  fragment EntityLink_entityVM on EntityVM {
    id
    entityType
    label
    isFamily
    revId
  }
`;
