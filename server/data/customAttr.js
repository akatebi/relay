import {
  GraphQLInt,
  GraphQLList,
  GraphQLString,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLUnionType,
} from 'graphql';

import {
  GraphQLEntityVMType,
} from './entityVM';

import {
  GraphQLControlNumberVMType,
} from './valueVM';

const BooleanType = new GraphQLObjectType({
  name: 'BooleanAttr',
  fields: {
    valueBoolean: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: ({ value }) => value,
    },
  },
});

const CategoryType = new GraphQLObjectType({
  name: 'CategoryAttr',
  fields: {
    valueCategory: {
      type: new GraphQLNonNull(GraphQLEntityVMType),
      resolve: ({ value }) => value,
    },
  },
});

const ControlNumberType = new GraphQLObjectType({
  name: 'ControlNumberAttr',
  fields: {
    valueControlNumber: {
      type: new GraphQLNonNull(GraphQLControlNumberVMType),
      resolve: ({ value }) => value,
    },
  },
});

const DateType = new GraphQLObjectType({
  name: 'DateAttr',
  fields: {
    valueDate: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ value }) => value,
    },
  },
});

const DecimalType = new GraphQLObjectType({
  name: 'DecimalAttr',
  fields: {
    valueDecimal: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: ({ value }) => value,
    },
  },
});

const EntityType = new GraphQLObjectType({
  name: 'EntityAttr',
  fields: {
    valueEntity: {
      type: new GraphQLNonNull(GraphQLEntityVMType),
      resolve: ({ value }) => value,
    },
  },
});

const EntityListType = new GraphQLObjectType({
  name: 'EntityListAttr',
  fields: {
    valueEntityList: {
      type: new GraphQLNonNull(GraphQLEntityVMType),
      resolve: ({ value }) => value,
    },
  },
});

const FloatType = new GraphQLObjectType({
  name: 'FloatAttr',
  fields: {
    valueFloat: {
      type: new GraphQLNonNull(GraphQLFloat),
      resolve: ({ value }) => value,
    },
  },
});

const IntegerType = new GraphQLObjectType({
  name: 'IntegerAttr',
  fields: {
    valueInteger: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: ({ value }) => value,
    },
  },
});

const RichTextType = new GraphQLObjectType({
  name: 'RichTextAttr',
  fields: {
    valueRichText: {
      type: GraphQLString,
      resolve: ({ value }) => value,
    },
  },
});

const RoleListType = new GraphQLObjectType({
  name: 'RoleListAttr',
  fields: {
    valueRoleList: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLEntityVMType)),
      resolve: ({ value }) => value.$values,
    },
  },
});

const TextType = new GraphQLObjectType({
  name: 'TextAttr',
  fields: {
    valueText: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ value }) => value,
    },
  },
});

export const GraphQLCustomAttributUnionType = new GraphQLUnionType({
  name: 'CustomAttributeUnion',
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
  resolveType: ({ type }) => {
    switch (type) {
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
        return null;
    }
  },
});
