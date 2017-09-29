import moment from 'moment';
import { random, shuffle } from '../../../__tests__/service';

const enabled = true;

export const changeConfigProperties = ({ list }, { onChangeConfig: change }, debug) =>
  list.forEach(({
    id, isMultiSelect, isMasterData, isVisible,
    customAttributes, defaultValue, propertyLabel,
  }) => {
    change(id, 'isMultiSelect', isMultiSelect, !isMultiSelect);
    change(id, 'isMasterData', isMasterData, !isMasterData);
    change(id, 'isVisible', isVisible, !isVisible);
    if (propertyLabel && !enabled) {
      debug('propertyLabel.cultureCode', 'en-US');
      change(id, 'propertyLabel', 'cultureCode', 'en-UK', 'en-US');
      debug('propertyLabel.value', 'v2');
      change(id, 'propertyLabel', 'value', 'v1', 'v2');
    }
    if (customAttributes) {
      //
    }
    if (defaultValue) {
      const {
        valueVMBoolean,
        valueVMCategory,
        valueVMControlNumber,
        valueVMDate,
        valueVMDecimal,
        valueVMEntity,
        valueVMEntityList,
        valueVMFloat,
        valueVMInteger,
        valueVMRichText,
        valueVMRoleList,
        valueVMText,
      } = defaultValue;
      if (valueVMBoolean !== undefined) {
        debug('defaultValue', 'Boolean', valueVMBoolean, !valueVMBoolean);
        change(id, 'defaultValue', 'Boolean', valueVMBoolean, !valueVMBoolean);

      } else if (valueVMCategory !== undefined) {
        // debug('Decimal', valueVMCategory, valueVMCategory);
        // change(id, 'defaultValue', 'Decimal', valueVMCategory, valueVMCategory);

      } else if (valueVMControlNumber !== undefined) {
        // debug('defaultValue', 'ControlNumber', valueVMControlNumber, valueVMControlNumber);
        // change(id, 'defaultValue', 'ControlNumber', valueVMControlNumber, valueVMControlNumber);

      } else if (valueVMDate !== undefined) {
        const value = moment.utc(valueVMDate).add(1, 'days').format();
        debug('defaultValue', 'Date', valueVMDate, value);
        change(id, 'defaultValue', 'Date', valueVMDate, value);

      } else if (valueVMDecimal !== undefined) {
        const value = random(1, 10000, 2);
        debug('defaultValue', 'Decimal', value);
        change(id, 'defaultValue', 'Decimal', 0, value);

      } else if (valueVMEntity !== undefined) {
        // debug('Boolean', valueVMBoolean, !valueVMBoolean);
        // change(id, 'defaultValue', 'Entity', valueVMEntity, valueVMEntity);

      } else if (valueVMEntityList !== undefined) {
        // debug('Boolean', valueVMBoolean, !valueVMBoolean);
        // change(id, 'defaultValue', 'Entity', valueVMEntityList, valueVMEntityList);

      } else if (valueVMFloat !== undefined) {
        const value = random(1, 10000, 3);
        debug('defaultValue', 'Float', value);
        change(id, 'defaultValue', 'Float', 0, value);

      } else if (valueVMInteger !== undefined) {
        const value = random(1, 10000);
        debug('defaultValue', 'Integer', value);
        change(id, 'defaultValue', 'Integer', 0, value);

      } else if (valueVMRichText !== undefined) {
        const value = shuffle('Edison invented the light bulb');
        debug('defaultValue', 'RichText', value);
        change(id, 'defaultValue', 'RichText', '', value);

      } else if (valueVMRoleList !== undefined) {
        // debug('defaultValue', 'RichText', valueVMRoleList, valueVMRoleList);
        // change(id, 'defaultValue', 'RichText', valueVMRoleList, valueVMRoleList);

      } else if (valueVMText !== undefined) {
        const value = shuffle('Merry had a little lamb');
        debug('defaultValue', 'Text', value);
        change(id, 'defaultValue', 'Text', '', value);
      }
    }
  });

export const checkConfigProperties = (write, read, debug) =>
  write.forEach(({
    id, isMultiSelect, isMasterData, isVisible,
    defaultValue, propertyLabel,
  }) => {
    const pc = read.find(x => x.id === id);
    expect(pc).toBeDefined();
    expect(pc.isMultiSelect).toBe(!isMultiSelect);
    expect(pc.isMasterData).toBe(!isMasterData);
    expect(pc.isVisible).toBe(!isVisible);
    if (propertyLabel) {
      debug('propertyLabel.value', pc.propertyLabel.value);
      expect(pc.propertyLabel.value).toBe(propertyLabel.value);
      debug('propertyLabel.cultureCode', pc.propertyLabel.cultureCode);
      expect(pc.propertyLabel.cultureCode).toBe(propertyLabel.cultureCode);
    }
    if (defaultValue) {
      debug('defaultValue', defaultValue);
      if (defaultValue.Boolean !== undefined) {
        debug('defaultValue.Boolean', pc.defaultValue.valueVMBoolean);
        expect(pc.defaultValue.valueVMBoolean).toBe(defaultValue.Boolean);
      } else if (defaultValue.Date !== undefined) {
        debug('defaultValue.Date', pc.defaultValue.valueVMDate);
        expect(pc.defaultValue.valueVMDate).toBe(defaultValue.Date);
      } else if (defaultValue.Decimal !== undefined) {
        debug('defaultValue.Decimal', pc.defaultValue.valueVMDecimal);
        expect(pc.defaultValue.valueVMDecimal).toBe(defaultValue.Decimal);
      } else if (defaultValue.Float !== undefined) {
        debug('defaultValue.Float', pc.defaultValue.valueVMFloat);
        expect(pc.defaultValue.valueVMFloat).toBe(defaultValue.Float);
      } else if (defaultValue.Integer !== undefined) {
        debug('defaultValue.Integer', pc.defaultValue.valueVMInteger);
        expect(pc.defaultValue.valueVMInteger).toBe(defaultValue.Integer);
      } else if (defaultValue.RichText !== undefined) {
        debug('defaultValue.RichText', pc.defaultValue.valueVMRichText);
        expect(pc.defaultValue.valueVMRichText).toBe(defaultValue.RichText);
      } else if (defaultValue.Text !== undefined) {
        debug('defaultValue.Text', pc.defaultValue.valueVMText);
        expect(pc.defaultValue.valueVMText).toBe(defaultValue.Text);
      }
    }
  });
