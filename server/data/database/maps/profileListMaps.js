
import moment from 'moment';

// const debug = require('debug')('server:data:database:maps:profileList');

const getStdProps = (profile) => {
  const { entityType } = profile;
  return (entityType === 'User' || entityType === 'LifeCycleConfig'
    || entityType === 'AssociationConfiguration' || entityType === 'CharacteristicConfig') ?
    profile.profileDocument.standardProperties : profile.standardProperties;
};

const getFullStatus = (profile) => {
  const stdProps = getStdProps(profile);
  return stdProps.find(property => property.name === 'Rev_FullStatus').valueVM;
};

const getCreatedDate = (profile) => {
  const stdProps = getStdProps(profile);
  const created = stdProps.find(property => property.name === 'Rev_Utc_Created');
  return moment(created.valueVM).format('lll');
};

const getIdentities = (profile) => {
  const { entityType } = profile;
  return (entityType === 'Document' || entityType === 'DocumentType') ?
    profile.identities : profile.profileDocument.identities;
};
const getAuthorName = (profile) => {
  const identities = getIdentities(profile);
  if (!identities) return null;
  const rel = identities.find(rel => rel.tail.label === 'Author');
  return rel ? rel.tail.valueVM.$values[0].label : 'null';
};

const getControlNumber = (profile) => {
  const identities = getIdentities(profile);
  const prop = identities.find(prop => prop.tail.propertyType === 'ControlNumber');
  if (prop && prop.tail && prop.tail.valueVM) {
    return prop.tail.valueVM.controlNumberString;
  }
  return 'null';
};

export const profileListMap = profileList =>
  profileList.map(data =>
    ({
      id: data.id,
      entityType: data.entityType,
      title: data.label || `${data.label}`,
      controlNumber: getControlNumber(data),
      author: getAuthorName(data),
      fullStatus: getFullStatus(data) || `${getFullStatus(data)}`,
      created: getCreatedDate(data),
    }));
