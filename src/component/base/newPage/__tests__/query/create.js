export default `query CreateQuery {
  choiceLookups {
    ...Create_choiceLookups
  }
}

fragment Create_choiceLookups on ChoiceLookups {
  creationEntityTypes {
    label
    value
  }
}
`;
