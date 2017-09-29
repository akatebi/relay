import moment from 'moment';
import { propertyTypes } from '../../../../../share/entityTypes';
import { random, shuffle } from '../../../__tests__/service';

export const changeCustomProperties = ({
  customProperties,
  valueVMOptions: {
    categoryOptions,
    roleListOptions,
  },
  valueVMTypeOptions: {
    entityOptions,
    entityListOptions,
  },
  types = propertyTypes,
  debug,
}) =>
  customProperties
    .filter(({ tail: { isEditable, propertyType } }) =>
      isEditable && types.indexOf(propertyType) !== -1)
    .map(({ tail: { id, valueVM, propertyType, config: { isMultiSelect } } }) => {
      // debug(entityType, propertyType);
      switch (propertyType) {
        case 'Boolean':
        {
          const { valueVMBoolean } = valueVM;
          return { id, valueVM: valueVMBoolean, propertyType, value: !valueVMBoolean };
        }
        case 'Date': {
          const { valueVMDate } = valueVM;
          const value = moment.utc(valueVMDate).add(1, 'days').format();
          return { id, valueVM: valueVMDate, propertyType, value };
        }
        case 'Decimal':
        {
          const { valueVMDecimal } = valueVM;
          const value = random(0, 10000, 2);
          return { id, valueVM: valueVMDecimal, propertyType, value };
        }
        case 'Float': {
          const { valueVMFloat } = valueVM;
          const value = random(0, 10000, 3);
          return { id, valueVM: valueVMFloat, propertyType, value };
        }
        case 'Integer': {
          const { valueVMInteger } = valueVM;
          const value = random(0, 10000);
          return { id, valueVM: valueVMInteger, propertyType, value };
        }
        case 'RichText': {
          const value = shuffle('Edison invented the light bulb');
          return { id, valueVM, propertyType, value };
        }
        case 'Text': {
          const value = shuffle('Merry had a little lamb');
          return { id, valueVM, propertyType, value };
        }
        case 'Category':
        {
          const { valueVMCategory } = valueVM;
          const options = categoryOptions.filter(({ id }) => id !== valueVMCategory.id);
          const value = isMultiSelect ? options.slice(0, 2) : options.slice(0, 1);
          debug('Old Entity valueVMEntity', valueVMCategory);
          debug('Change Entity value', value);
          return { id, valueVM: valueVMCategory, propertyType, value };
        }
        case 'Entity':
        {
          const { valueVMEntity } = valueVM;
          const options = entityOptions.filter(({ id }) => id !== valueVMEntity.id);
          const value = options[0];
          debug('Old Entity valueVMEntity', valueVMEntity);
          debug('Change Entity value', value);
          return { id, valueVM: valueVMEntity, propertyType, value };
        }
        case 'EntityList':
        {
          const { valueVMEntityList } = valueVM;
          const options = entityListOptions.filter(({ id }) => id !== valueVMEntityList.id);
          const value = isMultiSelect ? options.slice(0, 2) : options.slice(0, 1);
          debug('Old Entity valueVMEntity', valueVMEntityList);
          debug('Change Entity value', value);
          return { id, valueVM: valueVMEntityList, propertyType, value };
        }
        case 'RoleList':
        {
          const { valueVMRoleList } = valueVM;
          const options = roleListOptions.filter(({ id }) => id !== valueVMRoleList.id);
          const value = isMultiSelect ? options.slice(0, 2) : options.slice(0, 1);
          debug('Old Entity valueVMEntity', valueVMRoleList);
          debug('Change Entity value', value);
          return { id, valueVM: valueVMRoleList, propertyType, value };
        }
        default: throw new Error(`Unknown propertyType ${propertyType}`);
      }
    });



export const testCustomProperties = ({ changed, propertyContents, debug, entityType }) => {
  // debug('changed length ====>>>', changed.length);
  changed.filter(() => true).forEach(({ id, value }) => {
    const propertyContent = propertyContents.find(item => item.id === id);
    if (!propertyContent) return;
    const { valueVM, propertyType } = propertyContent;
    expect(valueVM).toBeDefined();
    switch (propertyType) {
      case 'Boolean':
        debug(entityType, 'Boolean', value, valueVM.valueVMBoolean);
        expect(valueVM.valueVMBoolean).toBe(value);
        break;
      case 'Date':
        debug(entityType, 'Date', value, valueVM.valueVMDate);
        if (valueVM.valueVMDate !== value) {
          debug(entityType, id, 'Date Failed');
        }
        expect(valueVM.valueVMDate).toBe(value);
        break;
      case 'Decimal':
        debug(entityType, 'Decimal', value, valueVM.valueVMDecimal);
        expect(valueVM.valueVMDecimal).toBe(value);
        break;
      case 'Integer':
        debug(entityType, 'Integer', value, valueVM.valueVMInteger);
        expect(valueVM.valueVMInteger).toBe(value);
        break;
      case 'Float':
        debug(entityType, 'Float', value, valueVM.valueVMFloat);
        expect(valueVM.valueVMFloat).toBe(value);
        break;
      case 'Text':
        debug(entityType, 'Text', value, valueVM.valueVMText);
        expect(valueVM.valueVMText).toBe(value);
        break;
      case 'RichText':
        debug(entityType, 'RichText', value, valueVM.valueVMRichText);
        expect(valueVM.valueVMRichText).toBe(value);
        break;
      case 'Category':
        debug(entityType, 'Category', value, valueVM.valueVMCategory);
        valueVM.valueVMCategory.forEach((category) => {
          const id = category.id.slice(0, 36);
          const item = value.find(x => x.id === id);
          expect(item).toBeDefined();
          expect(category.label).toBe(item.label);
        });
        break;
      case 'Entity':
        debug(entityType, 'Entity Actual', valueVM.valueVMEntity);
        debug(entityType, 'Entity Expected', value);
        expect(valueVM.valueVMEntity.id.slice(0, 36)).toBe(value.id);
        expect(valueVM.valueVMEntity.label).toBe(value.label);
        break;
      case 'EntityList':
        debug(entityType, 'EntityList', value, valueVM.valueVMEntityList);
        valueVM.valueVMEntityList.forEach((entity) => {
          const id = entity.id.slice(0, 36);
          const item = value.find(x => x.id === id);
          expect(item).toBeDefined();
          expect(entity.label).toBe(item.label);
        });
        break;
      case 'RoleList':
        debug(entityType, 'RoleList', value, valueVM.valueVMRoleList);
        valueVM.valueVMRoleList.forEach((role) => {
          const id = role.id.slice(0, 36);
          const item = value.find(x => x.id === id);
          expect(item).toBeDefined();
          expect(role.label).toBe(item.label);
        });
        break;
      default: throw new Error(`Unknown propertyType: ${propertyType}`);
    }
  });
};
