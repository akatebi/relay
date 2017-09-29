import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLString,
  GraphQLInputObjectType,
} from 'graphql';

import {
  GraphQLEntityVMInputType,
} from './entityVM';

const GraphQLValidationInputType = new GraphQLInputObjectType({
  name: 'ValidationInput',
  fields: {
    type: { type: new GraphQLNonNull(GraphQLString) },
    messageText: { type: GraphQLString },
    regex: { type: GraphQLString },
  },
});

const GraphQLValueInputType = new GraphQLInputObjectType({
  name: 'ValueInput',
  fields: {
    Boolean: { type: GraphQLBoolean },
    Category: { type: new GraphQLList(GraphQLEntityVMInputType) },
    ControlNumber: { type: GraphQLEntityVMInputType },
    Date: { type: GraphQLString },
    Decimal: { type: GraphQLFloat },
    Entity: { type: GraphQLEntityVMInputType },
    EntityList: { type: new GraphQLList(GraphQLEntityVMInputType) },
    Float: { type: GraphQLFloat },
    Integer: { type: GraphQLInt },
    RichText: { type: GraphQLString },
    RoleList: { type: new GraphQLList(GraphQLEntityVMInputType) },
    Text: { type: GraphQLString },
  },
});

const GraphQLCustomAttributeInputType = new GraphQLInputObjectType({
  name: 'CustomAttributeInput',
  fields: {
    name: { type: GraphQLString },
    type: { type: GraphQLString },
    value: { type: GraphQLValueInputType },
  },
});

export const GraphQLConfigPropertiesInput = new GraphQLInputObjectType({
  name: 'ConfigPropertiesInput',
  fields: () => ({
    isMasterData: { type: GraphQLBoolean },
    masterDataType: { type: GraphQLString },
    masterDataPropertyConfig: { type: GraphQLString },
    url: { type: GraphQLString },
    group: { type: GraphQLString },
    validations: { type: new GraphQLList(GraphQLValidationInputType) },
    isMultiSelect: { type: GraphQLBoolean },
    isVisible: { type: GraphQLBoolean },
    defaultValue: { type: GraphQLValueInputType },
    propertyLabel: {
      type: new GraphQLInputObjectType({
        name: 'PropertyLabelInput',
        fields: {
          cultureCode: { type: GraphQLString },
          value: { type: GraphQLString },
        },
      }),
    },
    customAttributes: { type: new GraphQLList(GraphQLCustomAttributeInputType) },
    id: { type: new GraphQLNonNull(GraphQLID) },
    reportingKey: { type: GraphQLString },
    label: { type: GraphQLString },
  }),
});
