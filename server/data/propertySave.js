import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInputObjectType,
} from 'graphql';

import {
  mutationWithClientMutationId,
} from 'graphql-relay';

import { getToken } from './database/constant';
import { propertySave } from './database/propertySave';
import { GraphQLConfigPropItem } from './config';
import { GraphQLEntityVMInputType, GraphQLControlNumberVMInputType } from './entityVM';
import {
  GraphQLIdentityType,
  GraphQLPropertyContentType,
} from './identity';
import { GraphQLLockStatus } from './lock';
import { GraphQLConfigPropertiesInput } from './propertyConfig';


//////////////////////////////////////////////////////////////////
//                  M  U  T  A  T  I  O  N                      //
//////////////////////////////////////////////////////////////////

const GraphQLBooleanPropInputType = new GraphQLInputObjectType({
  name: 'BooleanPropInput',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    valueVM: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
});

const GraphQLCategoryPropInputType = new GraphQLInputObjectType({
  name: 'CategoryPropInput',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    valueVM: { type: new GraphQLNonNull(new GraphQLList(GraphQLEntityVMInputType)) },
  },
});

const GraphQLControlNumberPropInputType = new GraphQLInputObjectType({
  name: 'ControlNumberPropInput',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    valueVM: { type: new GraphQLNonNull(GraphQLControlNumberVMInputType) },
  },
});

const GraphQLDatePropInputType = new GraphQLInputObjectType({
  name: 'DatePropInput',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    valueVM: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const GraphQLDecimalPropInputType = new GraphQLInputObjectType({
  name: 'DecimalPropInput',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    valueVM: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

const GraphQLEntityPropInputType = new GraphQLInputObjectType({
  name: 'EntityPropInput',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    valueVM: { type: new GraphQLNonNull(GraphQLEntityVMInputType) },
  },
});

const GraphQLEntityListPropInputType = new GraphQLInputObjectType({
  name: 'EntityListPropInput',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    valueVM: { type: new GraphQLNonNull(new GraphQLList(GraphQLEntityVMInputType)) },
  },
});

const GraphQLFloatPropInputType = new GraphQLInputObjectType({
  name: 'FloatPropInput',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    valueVM: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

const GraphQLIntegerPropInputType = new GraphQLInputObjectType({
  name: 'IntegerPropInput',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    valueVM: { type: new GraphQLNonNull(GraphQLInt) },
  },
});

const GraphQLRichTextPropInputType = new GraphQLInputObjectType({
  name: 'RichTextPropInput',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    valueVM: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const GraphQLRoleListPropInputType = new GraphQLInputObjectType({
  name: 'RoleListPropInput',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    valueVM: { type: new GraphQLNonNull(new GraphQLList(GraphQLEntityVMInputType)) },
  },
});

const GraphQLTextPropInputType = new GraphQLInputObjectType({
  name: 'TextPropInput',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    valueVM: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const GraphQLPropertyContentsInputType = new GraphQLInputObjectType({
  name: 'PropertyContentsInput',
  fields: {
    Boolean: { type: new GraphQLList(GraphQLBooleanPropInputType) },
    Category: { type: new GraphQLList(GraphQLCategoryPropInputType) },
    ControlNumber: { type: new GraphQLList(GraphQLControlNumberPropInputType) },
    Date: { type: new GraphQLList(GraphQLDatePropInputType) },
    Decimal: { type: new GraphQLList(GraphQLDecimalPropInputType) },
    Entity: { type: new GraphQLList(GraphQLEntityPropInputType) },
    EntityList: { type: new GraphQLList(GraphQLEntityListPropInputType) },
    Float: { type: new GraphQLList(GraphQLFloatPropInputType) },
    Integer: { type: new GraphQLList(GraphQLIntegerPropInputType) },
    RichText: { type: new GraphQLList(GraphQLRichTextPropInputType) },
    RoleList: { type: new GraphQLList(GraphQLRoleListPropInputType) },
    Text: { type: new GraphQLList(GraphQLTextPropInputType) },
  },
});

const GraphQLPropertyContentPathsInputType = new GraphQLInputObjectType({
  name: 'PropertyContentPathsInput',
  fields: {
    path: { type: new GraphQLNonNull(GraphQLString) },
    secPath: { type: GraphQLString },
  },
});

const GraphQLIdentityInputType = new GraphQLInputObjectType({
  name: 'IdentityInput',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    label: { type: GraphQLString },
    entityType: { type: GraphQLString },
    formHeader: { type: GraphQLString },
    reportingKey: { type: GraphQLString },
  },
});

export const propertySaveMutation = mutationWithClientMutationId({
  name: 'PropertySaveMutation',
  inputFields: {
    configProperties: { type: new GraphQLList(GraphQLConfigPropertiesInput) },
    sectionContents: { type: GraphQLPropertyContentsInputType },
    customProperties: { type: GraphQLPropertyContentsInputType },
    identities: { type: GraphQLPropertyContentsInputType },
    identity: { type: GraphQLIdentityInputType },
    paths: { type: new GraphQLNonNull(GraphQLPropertyContentPathsInputType) },
  },
  outputFields: {
    propertyConfigs: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLConfigPropItem)),
      // resolve: ({ propertyConfigs }) => global.log(propertyConfigs, 'propertyConfigs'),
    },
    propertyContents: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLPropertyContentType)),
    },
    identity: {
      type: new GraphQLNonNull(GraphQLIdentityType),
    },
    lockStatus: {
      type: new GraphQLNonNull(GraphQLLockStatus),
      // resolve: ({ lockStatus }) => global.log(lockStatus, 'lockStatus'),
    },
  },
  mutateAndGetPayload: (...args) => {
    const {
      configProperties = [],
      sectionContents: sect,
      customProperties: cup,
      identities: ids,
      identity = {},
      paths,
    } = args[0];
    const token = getToken(args[1], args[2].rootValue);
    const flatten = (obj = {}) => Object.keys(obj)
      .filter(key => obj[key])
      .reduce((acc, key) => acc.concat(obj[key]), []);
    const sectionContents = flatten(sect);
    const customProperties = flatten(cup);
    const identities = flatten(ids);
    delete identity.id;
    const props = {
      configProperties,
      sectionContents,
      customProperties,
      identities,
      identity,
    };
    // global.log(props);
    return propertySave(token, paths, props);
  },
});
