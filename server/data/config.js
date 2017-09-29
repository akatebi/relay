import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';

import {
  GraphQLCustomAttributUnionType,
} from './customAttr';

import {
  GraphQLPropertyUnionType,
} from './valueVM';

import { getToken } from './database/constant';
import { getConfig } from './database/config';

export const GraphQLPropertyConfigValidation = new GraphQLObjectType({
  name: 'PropertyConfigValidation',
  fields: {
    type: { type: new GraphQLNonNull(GraphQLString) },
    messageText: { type: GraphQLString },
    regex: { type: GraphQLString },
  },
});

const GraphQLPropertyLabelType = new GraphQLObjectType({
  name: 'PropertyLabel',
  fields: {
    id: { type: GraphQLID },
    cultureCode: { type: GraphQLString },
    value: { type: GraphQLString },
  },
});

export const GraphQLCustomAttribute = new GraphQLObjectType({
  name: 'CustomAttribute',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    type: { type: new GraphQLNonNull(GraphQLString) },
    value: {
      type: GraphQLCustomAttributUnionType,
      resolve: ({ type, value }) => ({ type, value }),
    },
  },
});

export const GraphQLConfigPropItem = new GraphQLObjectType({
  name: 'PropertyConfig',
  fields: {
    isMasterData: { type: new GraphQLNonNull(GraphQLBoolean) },
    masterDataType: { type: GraphQLString },
    masterDataPropertyConfig: { type: GraphQLString },
    url: { type: GraphQLString },
    group: { type: GraphQLString },
    validations: { type: new GraphQLNonNull(new GraphQLList(GraphQLPropertyConfigValidation)) },
    isMultiSelect: { type: new GraphQLNonNull(GraphQLBoolean) },
    isVisible: { type: new GraphQLNonNull(GraphQLBoolean) },
    isEditable: { type: new GraphQLNonNull(GraphQLBoolean) },
    defaultValue: {
      type: new GraphQLNonNull(GraphQLPropertyUnionType),
      resolve: ({ defaultValue: valueVM, propertyType, customAttributes }) => {
        try {
          const customAttribute = customAttributes.find(({ name }) =>
            (name === 'ValueType' || name === 'ListType'));
          const entityType = customAttribute.value.value;
          return { valueVM, propertyType, entityType };
        } catch (exp) {
          return { valueVM, propertyType };
        }
      },
    },
    propertyType: { type: new GraphQLNonNull(GraphQLString) },
    propertyLabel: { type: GraphQLPropertyLabelType },
    propertyBehavior: { type: new GraphQLNonNull(GraphQLString) },
    customAttributes: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLCustomAttribute)),
      resolve: ({ customAttributes }) =>
        customAttributes.filter(({ type }) => type !== 'Duration'),
    },
    id: { type: new GraphQLNonNull(GraphQLID) },
    reportingKey: { type: GraphQLString },
    entityType: { type: new GraphQLNonNull(GraphQLString) },
    label: { type: GraphQLString },
    operation: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const GraphQLConfig = new GraphQLObjectType({
  name: 'PropertyConfigs',
  fields: () =>
    ({
      list: {
        type: new GraphQLNonNull(new GraphQLList(GraphQLConfigPropItem)),
        resolve: x => x.filter(({ propertyType }) => propertyType !== 'ControlNumber'),
      },
    }),
});

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

export const config = {
  type: GraphQLConfig,
  args: {
    path: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: (...args) => {
    const token = getToken(args[2], args[0]);
    const { path } = args[1];
    return getConfig(token, path);
  },
};
