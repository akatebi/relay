export default `query ProfileNavQuery($path: String!) {
  profileNav(path: $path) {
    ...ProfileNav_profileNav
  }
}

fragment ProfileNav_profileNav on ProfileNav {
  navLinks {
    label
    url
  }
}
`;
