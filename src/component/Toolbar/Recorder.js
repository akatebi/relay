import equal from 'deep-equal';
import '../../constant/app';

const debug = require('debug')('app:component:Toolbar:Recorder');

// onChangeContent,
// onChangeConfig,
// onChangeField,

export class Recorder {

  constructor() {
    this.mutationInputReset();
  }

  mutationInputDirty = () => {
    const dirty = Object.keys(this.mutationInput).length !== 0;
    if (dirty) {
      this.normalizeIds(this.mutationInput);
      // debug('mutationInput', window.pretty(this.mutationInput));
    }
    return dirty;
  }

  normalizeIds = (obj, tab = '') => {
    if (obj instanceof Array) {
      obj.forEach(x => this.normalizeIds(x, `${tab} `));
    } else if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach((prop) => {
        const item = obj[prop];
        if ((typeof item === 'object' && item !== null) || item instanceof Array) {
          this.normalizeIds(item, `${tab} `);
        } else if (prop === 'id') {
          obj[prop] = item.slice(0, 36);
        }
      });
    }
    return obj;
  };

  mutationInputReset = () => {
    this.mutationInput = {};
  }

  /////////////////////////////
  // propertyContent changes //
  /////////////////////////////
  changeProperty = (object, { id, value, valueVM, propertyType, property }) => {
    if (!object[propertyType]) {
      // debug('no object[propertyType]', propertyType);
      object[propertyType] = [];
    }
    const ary = object[propertyType];
    const item = ary.find(x => x.id === id);
    if (item) {
      const i = ary.indexOf(item);
      if (i !== -1) {
        ary.splice(i, 1);
        debug('Remove', window.pretty({ property, id, valueVM, value, propertyType }));
      } else {
        debug('indexOf', item, 'not found in', ary);
      }
    } else {
      // debug('item not found in', ary);
    }
    if (!equal(value, valueVM)) {
      ary.push({ id, valueVM: value });
      debug('Add', window.pretty({ property, id, valueVM, value, propertyType }));
    }
    if (ary.length === 0) {
      delete object[propertyType];
    }
  };

  ////////////////////////////////////
  // valueVM & defaultValue Changes //
  ////////////////////////////////////
  // value is the changed value and valueVM is the existing value
  onChangeContent = (property, { id, value, valueVM, propertyType }) => {
    debug('====>>>>', property, id, propertyType);
    // debug('value', window.pretty(value));
    // debug('valueVM', window.pretty(valueVM));
    if (!this.mutationInput[property]) {
      this.mutationInput[property] = {};
    }
    const object = this.mutationInput[property];
    this.changeProperty(object, { id, value, valueVM, propertyType, property });
    if (Object.keys(object).length === 0) {
      delete this.mutationInput[property];
    }
  }

  ///////////////////////
  // rootField changes //
  ///////////////////////
  onChangeField = (id, prop, origVal, value) => {
    if (!this.mutationInput.identity) {
      this.mutationInput.identity = { id };
    }
    if (origVal === value) {
      debug('onChangeField remove', prop, origVal, value);
      delete this.mutationInput.identity[prop];
    } else {
      debug('onChangeField add', prop, origVal, value);
      this.mutationInput.identity[prop] = value;
    }
    if (Object.keys(this.mutationInput.identity).length === 1) {
      delete this.mutationInput.identity;
    }
  }

  ////////////////////??????????????????????????????????????????????????????////
  ////                        configProp changes                            ////
  ////////////////////////??????????????????????????????????????????????????????

  configDefaultValue = ({ item, propertyType, origVal, value }) => {
    if (!item.defaultValue) item.defaultValue = {};
    if (equal(origVal, value)) {
      delete item.defaultValue[propertyType];
      delete item.defaultValue;
      debug('configDefaultValue', 'Remove', propertyType);
    } else {
      item.defaultValue[propertyType] = value;
      debug('configDefaultValue', 'Add', propertyType, window.pretty(value));
    }
  }

  configCustomAttributes = ({ propertyType, item, origVal, value, path }) => {
    const name = path[0];
    const type = propertyType;
    if (!item.customAttributes) {
      item.customAttributes = [];
    }
    const { customAttributes } = item;
    const customAttribute = customAttributes.find(x => name === x.name) || {};
    if (!customAttribute.value) customAttribute.value = {};
    customAttribute.name = name;
    customAttribute.type = type;
    customAttribute.value[propertyType] = value;
    if (equal(origVal, value)) {
      const index = customAttributes.findIndex(x => name === x.name);
      if (index !== -1) {
        customAttributes.splice(index, 1);
      }
      debug('customAttribute', 'Remove', window.pretty(customAttribute));
    } else if (!item.customAttributes.find(x => name === x.name)) {
      item.customAttributes.push(customAttribute);
      debug('customAttribute', 'Add', window.pretty(customAttribute));
    }
    if (customAttributes.length === 0) {
      delete item.customAttributes;
    }
  }

  configPropertyLabel = ({ propertyType, item, origVal, value, property }) => {
    const subProperty = propertyType;
    debug('subProperty', subProperty);
    if (!item[property]) item[property] = {};
    const propertyLabel = item[property];
    if (equal(origVal, value)) {
      debug('configPropertyLabel', 'Remove', subProperty);
      delete propertyLabel[subProperty];
      if (Object.keys(item[property]).length === 0) {
        delete item[property];
      }
    } else {
      debug('configPropertyLabel', 'Add', subProperty, value);
      propertyLabel[subProperty] = value;
    }
  }

  configRootValue = ({ origVal, value, item, property, configProperties }) => {
    if (equal(origVal, value)) {
      debug('configRootValue', 'Remove', property);
      delete item[property];
      if (Object.keys(item).length === 1) {
        const index = configProperties.indexOf(item);
        configProperties.splice(index, 1);
      }
    } else {
      debug('configRootValue', 'Add', property, window.pretty(value));
      item[property] = value;
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  onChangeConfig = (id, property, ...args) => {
    // debug('config ...args', args);
    const { length } = args;
    const config = {
      path: args.slice(0, length - 3),
      propertyType: args[length - 3],
      origVal: args[length - 2],
      value: args[length - 1],
    };
    if (!this.mutationInput.configProperties) {
      this.mutationInput.configProperties = [];
    }
    let { configProperties } = this.mutationInput;
    const { origVal, value, path, propertyType } = config;
    // debug('propertyType', propertyType);
    let item = configProperties.find(x => x.id === id);
    if (!item) {
      item = { id };
      configProperties.push(item);
    }
    if (property === 'propertyLabel') {
      this.configPropertyLabel({ propertyType, item, origVal, value, property });
    } else if (property === 'defaultValue') {
      this.configDefaultValue({ item, propertyType, origVal, value });
    } else if (property === 'customAttributes') {
      this.configCustomAttributes({ propertyType, item, origVal, value, path });
    } else {
      this.configRootValue({ origVal, value, item, property, configProperties });
    }
    ///////////////////////////////
    // Delete Empty Objects Here //
    ///////////////////////////////
    configProperties = configProperties.filter(item => Object.keys(item).length > 1);
    // debug('configProperties', configProperties);
    if (configProperties.length === 0) {
      delete this.mutationInput.configProperties;
    }
    // debug('configProperties', configProperties);
  };

}
