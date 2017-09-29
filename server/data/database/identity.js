import myFetch from './myFetch';
import { serverPath, fetchOptions } from './constant';

export const getIdentity = (token, path, dataLoader) => {
  const url = `${serverPath}${path}/identity`;
  const options = fetchOptions(token);
  if (dataLoader) return dataLoader.load({ url, options });
  return myFetch(url, options);
};

export const getIdentityEntityProfile = (token, path, dataLoader) => {
  if (/documents|documenttypes/.test(path)) {
    return getIdentity(token, path, dataLoader);
  }
  const url = `${serverPath}${path}/identity/entityprofile`;
  const options = fetchOptions(token);
  if (dataLoader) return dataLoader.load({ url, options });
  return myFetch(url, options)
    .then(({ /*entityType, label, */customProperties, profileDocument: pd }) => ({
      id: pd.id,
      label: pd.label,
      entityType: pd.label,
      formHeader: pd.formHeader,
      reportingKey: pd.reportingKey,
      standardProperties: pd.standardProperties,
      customProperties: [...customProperties, ...pd.customProperties],
      identities: pd.identities,
    }));
};

// id - UP
// label - EITHER
// entityType - UP
// formHeader - DOWN
// reportingKey - DOWN
// standardProperties - EITHER
// customProperties - BOTH
// identities - DOWN
