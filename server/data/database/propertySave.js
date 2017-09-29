// import merge from 'deepmerge';
import myFetch from './myFetch';
import { writeFile } from './writefile';
import { serverPath, fetchOptions } from './constant';
import { getLockStatus } from './lock';
import { getSection } from './section';
import { getConfig } from './config';
import { getIdentityEntityProfile } from './identity';

const getConfigPayload = (token, path, cop) => {
  const prefix = '/documenttypes';
  if (path.slice(0, prefix.length) === prefix) {
    return getConfig(token, path)
      .then(configProps => configProps.filter(x => cop.find(y => x.id === y.id)));
  }
  return Promise.resolve([]);
};

const getIdentityPayload = (token, path, cup, ids) =>
  getIdentityEntityProfile(token, path)
    .then(({ customProperties, identities, id, label,
      entityType, formHeader, reportingKey, standardProperties }) => {
      const customProps = customProperties.map(
        ({ tail: { id, propertyType, valueVM } }) =>
          ({
            id,
            valueVM,
            propertyType,
          }));
      // global.log(customProps, '##### CustomProps');
      const intersecCustomProps = customProps.filter(x => cup.find(y => x.id === y.id));
      const idenProps = identities.map(
        ({ tail: { id, propertyType, valueVM } }) =>
          ({
            id,
            valueVM,
            propertyType,
          }));
      const intersecIdenProps = idenProps.filter(x => ids.find(y => x.id === y.id));
      // global.log(intersection, '##### Intersection');
      const propertyContents = [...intersecCustomProps, ...intersecIdenProps];
      const identity = { id, identities, label, entityType, formHeader, reportingKey, standardProperties };
      // global.log(identity, 'READ ROOT FIELDS');
      return { propertyContents, identity };
    });

const putSave = (token, path, frame) => {
  const url = `${serverPath}${path.slice(0, -37)}`;
  const options = {
    ...fetchOptions(token),
    method: 'PUT',
    body: JSON.stringify(frame),
  };
  writeFile(`${url}/save`, frame, options);
  return myFetch(url, options);
};

const updateFrame = (frame, src, dst) => {
  src.forEach((property) => {
    let obj = frame[dst].find(x => x.tail.id === property.id);
    if (!obj) {
      obj = frame.profileDocument[dst].find(x => x.tail.id === property.id);
      if (obj) frame.profileDocument.operation = 'Update';
    }
    if (!obj) {
      console.error(`${property.id} not found in frame.${dst}`);
      return;
    }
    obj.operation = 'Update';
    obj = obj.tail;
    obj.operation = 'Update';
    frame.operation = 'Update';
    if (obj.valueVM.$values) {
      obj.valueVM.$values = property.valueVM;
    } else {
      obj.valueVM = property.valueVM;
    }
  });
};

const updateConfig = (frame, src, dst) => {
  src.forEach((property) => {
    const configProps = frame[dst];
    const configPropTail = configProps.find(x => x.tail.id === property.id);
    if (!configPropTail) {
      throw new Error(`##### ERROR: OBJECT NOT FOUND IN FRAME ${dst}`);
    }
    configPropTail.operation = 'Update';
    const { tail: configProp } = configPropTail;
    configProp.operation = 'Update';
    if (property.defaultValue) {
      const { propertyType } = configProp;
      switch (propertyType) {
        case 'Boolean':
        case 'ControlNumber':
        case 'Decimal':
        case 'Date':
        case 'Entity':
        case 'Float':
        case 'Integer':
          configProp.defaultValue = property.defaultValue[propertyType];
          break;
        case 'RichText':
        case 'Text':
        {
          const value = property.defaultValue[propertyType];
          if (configProp.defaultValue) configProp.defaultValue.value = value;
          else configProp.defaultValue = { value, cultureCode: '' };
          break;
        }
        case 'Category':
        case 'EntityList':
        case 'RoleList':
          configProp.defaultValue.$values = property.defaultValue[propertyType];
          break;
        default: throw new Error(`unknown propertyType ${propertyType} in configProperties`);
      }
      delete property.defaultValue;
    } else if (property.customAttributes) {
      const { customAttributes: cas } = property;
      configProp.operation = 'Update';
      const { customAttributes } = configProp;
      cas.forEach((ca) => {
        const customAttribute = customAttributes.find(attr => attr.name === ca.name);
        if (customAttribute) {
          customAttribute.value = ca.value;
        }
      });
      delete property.customAttributes;
    } else if (property.propertyLabel) {
      const { propertyLabel: { cultureCode, value } } = property;
      if (cultureCode) {
        configProp.propertyLabel.cultureCode = cultureCode;
      }
      if (value) {
        configProp.propertyLabel.value = value;
      }
      delete property.propertyLabel;
    } else {
      Object.keys(property).forEach((key) => {
        configProp[key] = property[key];
      });
    }
  });
};

export const propertySave = (token, { path, secPath },
  { configProperties: cop, customProperties: cup, identities: ids, identity }) => {
  const url = `${serverPath}${path}/frame`;
  const options = fetchOptions(token);
  return myFetch(url, options)
    .then((fm) => {
      const frame = { ...fm, ...identity };
      updateConfig(frame, cop, 'configProperties');
      updateFrame(frame, cup, 'customProperties');
      updateFrame(frame, ids, 'identities');
      // Filter out the Noops
      Object.keys(frame)
        .filter(x => x !== 'standardProperties') // Remove later when they fix this issue
        .forEach((key) => {
          if (frame[key] instanceof Array) {
            frame[key] = frame[key].filter(x => x.operation === 'Update');
          }
        });
      return putSave(token, path, frame)
        .then((resp) => {
          if (resp === true) {
            if (secPath) {
              return global.log(getSection(token, secPath));
            }
            const lockStatus = getLockStatus(token, `${path}`);
            const propertyConfigs = getConfigPayload(token, path, cop);
            // global.log(propertyConfigs, 'propertyConfigs ####');
            return getIdentityPayload(token, path, cup, ids)
              .then(({ identity, propertyContents }) => ({
                lockStatus,
                propertyConfigs,
                identity,
                propertyContents,
              }));
          }
          throw new Error('Save Failed!');
        });
    });
};
