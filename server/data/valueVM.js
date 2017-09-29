import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLString,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLUnionType,
} from 'graphql';

import { GraphQLEntityVMType } from './entityVM';
// import { GraphQLProfileTableType } from './profileList';

const GraphQLPropertyContentValidation = new GraphQLObjectType({
  name: 'PropertyContentValidation',
  fields: {
    type: { type: new GraphQLNonNull(GraphQLString) },
    messageText: { type: GraphQLString },
    regex: { type: GraphQLString },
  },
});

const GraphQLPropertyContentConfigGroup = new GraphQLObjectType({
  name: 'PropertyContentConfigGroup',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    cultureCode: { type: GraphQLString },
    value: { type: GraphQLString },
  },
});

export const GraphQLPropertyContentConfig = new GraphQLObjectType({
  name: 'PropertyContentConfig',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    group: { type: new GraphQLNonNull(GraphQLPropertyContentConfigGroup) },
    isEditable: { type: GraphQLBoolean },
    isRequired: { type: GraphQLBoolean },
    isMultiSelect: { type: GraphQLBoolean },
    isVisible: { type: GraphQLBoolean },
    listType: { type: GraphQLString },
    defaultValue: { type: GraphQLString },
    propertyType: { type: new GraphQLNonNull(GraphQLString) },
    propertyBehavior: { type: GraphQLString },
    label: { type: GraphQLString },
    operation: { type: new GraphQLNonNull(GraphQLString) },
    validations: {
      type: new GraphQLNonNull(new GraphQLList(
        GraphQLPropertyContentValidation,
      )),
    },
  },
});

const BooleanType = new GraphQLObjectType({
  name: 'BooleanProp',
  fields: {
    valueVMBoolean: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: ({ valueVM }) => valueVM,
    },
  },
});

const CategoryType = new GraphQLObjectType({
  name: 'CategoryProp',
  fields: {
    valueVMCategory: {
      type: new GraphQLList(GraphQLEntityVMType),
      resolve: ({ valueVM }) => (valueVM ? valueVM.$values : []),
    },
  },
});

export const GraphQLControlNumberVMType = new GraphQLObjectType({
  name: 'ControlNumberVM',
  fields: () =>
    ({
      type: { type: new GraphQLNonNull(GraphQLString), resolve: x => x.$type },
      prefix: { type: new GraphQLNonNull(GraphQLString) },
      suffix: { type: new GraphQLNonNull(GraphQLString) },
      sequenceNumber: { type: new GraphQLNonNull(GraphQLString) },
      controlNumberString: { type: new GraphQLNonNull(GraphQLString) },
      sequenceType: { type: new GraphQLNonNull(GraphQLString) },
      version: { type: new GraphQLNonNull(GraphQLString) },
      draftVersion: { type: GraphQLString },
      configId: { type: new GraphQLNonNull(GraphQLString) },
    }),
});

const ControlNumberType = new GraphQLObjectType({
  name: 'ControlNumberProp',
  fields: {
    valueVMControlNumber: {
      type: new GraphQLNonNull(GraphQLControlNumberVMType),
      resolve: ({ valueVM }) => valueVM,
    },
  },
});

const DateType = new GraphQLObjectType({
  name: 'DateProp',
  fields: {
    valueVMDate: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ valueVM }) => valueVM,
    },
  },
});

const DecimalType = new GraphQLObjectType({
  name: 'DecimalProp',
  fields: {
    valueVMDecimal: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: ({ valueVM }) => valueVM,
    },
  },
});

// TODO - should type be GQLEntityVMType? ValueVMType is for values, not entities
const EntityType = new GraphQLObjectType({
  name: 'EntityProp',
  fields: {
    valueVMEntity: {
      type: GraphQLEntityVMType,
      resolve: ({ valueVM }) => valueVM,
    },
  },
});

const EntityListType = new GraphQLObjectType({
  name: 'EntityListProp',
  fields: {
    valueVMEntityList: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLEntityVMType)),
      resolve: ({ valueVM }) => (valueVM ? valueVM.$values : []),
    },
  },
});

const FloatType = new GraphQLObjectType({
  name: 'FloatProp',
  fields: {
    valueVMFloat: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: ({ valueVM }) => valueVM,
    },
  },
});

const IntegerType = new GraphQLObjectType({
  name: 'IntegerProp',
  fields: {
    valueVMInteger: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: ({ valueVM }) => valueVM,
    },
  },
});

const RichTextType = new GraphQLObjectType({
  name: 'RichTextProp',
  fields: {
    valueVMRichText: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ valueVM }) => valueVM.value,
    },
  },
});

const RoleListType = new GraphQLObjectType({
  name: 'RoleListProp',
  fields: {
    valueVMRoleList: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLEntityVMType)),
      resolve: ({ valueVM }) => (valueVM ? valueVM.$values : []),
    },
  },
});

const TextType = new GraphQLObjectType({
  name: 'TextProp',
  fields: {
    valueVMText: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ valueVM }) => valueVM.value,
    },
  },
});

export const GraphQLPropertyUnionType = new GraphQLUnionType({
  name: 'PropertyUnion',
  types: [
    BooleanType,
    CategoryType,
    ControlNumberType,
    DateType,
    DecimalType,
    EntityType,
    EntityListType,
    FloatType,
    IntegerType,
    RichTextType,
    RoleListType,
    TextType,
  ],
  resolveType: ({ propertyType }) => {
    // global.log(propertyType, '#####');
    switch (propertyType) {
      case 'Boolean':
        return BooleanType;
      case 'Category':
        return CategoryType;
      case 'ControlNumber':
        return ControlNumberType;
      case 'Date':
        return DateType;
      case 'Decimal':
        return DecimalType;
      case 'Entity':
        return EntityType;
      case 'EntityList':
        return EntityListType;
      case 'Float':
        return FloatType;
      case 'Integer':
        return IntegerType;
      case 'RichText':
        return RichTextType;
      case 'RoleList':
        return RoleListType;
      case 'Text':
        return TextType;
      default:
        console.error(`${propertyType} is unknown`);
        return null;
    }
  },
});
