import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import {
  getEntity,
} from './database/entity';

import { GraphQLEntityVMType } from './entityVM';
import { GraphQLConfigPropItem } from './config';

import { getToken } from './database/constant';

import { GraphQLRelationshipToPropertyContent } from './identity';

import {
  GraphQLPropertyUnionType,
  GraphQLPropertyContentConfig,
} from './valueVM';

export const GraphQLPropertyStandardType = new GraphQLObjectType({
  name: 'PropertyStandard',
  fields: {
    name: { type: GraphQLString },
    propertyType: { type: new GraphQLNonNull(GraphQLString) },
    entityType: { type: new GraphQLNonNull(GraphQLString) },
    label: { type: new GraphQLNonNull(GraphQLString) },
    operation: { type: new GraphQLNonNull(GraphQLString) },
    config: { type: new GraphQLNonNull(GraphQLPropertyContentConfig) },
    valueVM: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export const GraphQLPropertyContentType = new GraphQLObjectType({
  name: 'PropertyContent',
  fields: {
    name: { type: GraphQLString },
    id: { type: new GraphQLNonNull(GraphQLID) },
    propertyType: { type: new GraphQLNonNull(GraphQLString) },
    entityType: { type: new GraphQLNonNull(GraphQLString) },
    label: { type: new GraphQLNonNull(GraphQLString) },
    operation: { type: new GraphQLNonNull(GraphQLString) },
    config: { type: new GraphQLNonNull(GraphQLPropertyContentConfig) },
    valueVM: {
      type: new GraphQLNonNull(GraphQLPropertyUnionType),
      resolve: ({ valueVM, propertyType, config, entityType: et }) => {
        let entityType = et;
        if (propertyType === 'Entity' || propertyType === 'EntityList') {
          const customAttribute = config.customAttributes.find(({ name }) =>
            (name === 'ValueType' || name === 'ListType'));
          const { value: { value } = {} } = customAttribute;
          entityType = value;
        }
        // global.log(entityType, '##### EntityType');
        return { valueVM, propertyType, entityType };
      },
    },
  },
});

const GraphQLApprovalSegmentConfigList = new GraphQLObjectType({
  name: 'ApprovalSegmentConfigList',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    label: { type: new GraphQLNonNull(GraphQLString) },
    customProperties: { type: new GraphQLList(GraphQLRelationshipToPropertyContent) },
  },
});

const GraphQLStartStateConfig = new GraphQLObjectType({
  name: 'StartStateConfig',
  fields: {
    state: { type: new GraphQLNonNull(GraphQLString) },
    satisfiedState: { type: new GraphQLNonNull(GraphQLBoolean) },
    subscriptionEffective: { type: new GraphQLNonNull(GraphQLBoolean) },
    stateLink: {
      type: new GraphQLNonNull(GraphQLEntityVMType),
      resolve: ({
        cultureCode,
        entityType,
        familyId,
        id,
        isFamily,
        label,
        operation,
        reporting,
      }) => ({
        cultureCode,
        entityType,
        familyId,
        id,
        isFamily,
        label,
        operation,
        reporting,
      }),
    },
    // familyId: { type: new GraphQLNonNull(GraphQLID) },
    // isFamily: { type: new GraphQLNonNull(GraphQLBoolean) },
    // cultureCode: { type: GraphQLString },
    // id: { type: new GraphQLNonNull(GraphQLID) },
    // reportingKey: { type: GraphQLString },
    // entityType: { type: new GraphQLNonNull(GraphQLString) },
    // label: { type: new GraphQLNonNull(GraphQLString) },
    // operation: { type: GraphQLString },
  },
});

const GraphQLEntityRelationship = new GraphQLObjectType({
  name: 'EntityRelationship',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    relationshipType: { type: new GraphQLNonNull(GraphQLString) },
    associationType: { type: new GraphQLNonNull(GraphQLString) },
    head: { type: new GraphQLNonNull(GraphQLEntityVMType) },
    tail: { type: new GraphQLNonNull(GraphQLEntityVMType) },
    configId: { type: new GraphQLNonNull(GraphQLString) },
    operation: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const GraphQLPrerequisite = new GraphQLObjectType({
  name: 'Prerequisite',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
});

const GraphQLTrigger = new GraphQLObjectType({
  name: 'Trigger',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
});

const GraphQLLifeCycleAction = new GraphQLObjectType({
  name: 'LifeCycleAction',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
});

// configProperties >>>
const GraphQLSectionConfigRoleListConfig = new GraphQLObjectType({
  name: 'SectionConfigRoleListConfig',
  fields: () =>
    ({
      id: { type: new GraphQLNonNull(GraphQLID) },
      configId: { type: new GraphQLNonNull(GraphQLID) },
      relationshipType: { type: new GraphQLNonNull(GraphQLString) },
      operation: { type: GraphQLString },
      propertyLabel: {
        type: new GraphQLNonNull(GraphQLString),
        resolve: x => x.value,
      },
      property: {
        type: new GraphQLNonNull(GraphQLConfigPropItem),
        resolve: x => x.tail,
      },
    }),
});

// relationships2 >>>
const GraphQLSectionConfigLineItemConfig = new GraphQLObjectType({
  name: 'SectionConfigLineItemConfig',
  fields: {
    type: { type: GraphQLString, resolve: x => x.$type },
    lifeCycleActions: { type: new GraphQLList(GraphQLLifeCycleAction) },
    associationConfigs: { type: new GraphQLList(GraphQLEntityVMType) }, // ?
    lineItemConfig: {
      type: new GraphQLNonNull(GraphQLEntityVMType),
      resolve: x => x.tail,
    },
  },
});

export const GraphQLEntityType = new GraphQLObjectType({
  name: 'Entity',
  fields: {
    supportsMultilevel: { type: GraphQLBoolean },
    reportingKey: { type: GraphQLString },
    customProperties: { type: new GraphQLNonNull(
      new GraphQLList(GraphQLRelationshipToPropertyContent)) },
    familyId: { type: new GraphQLNonNull(GraphQLString) },
    isFamily: { type: new GraphQLNonNull(GraphQLBoolean) },
    cultureCode: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLID) },
    entityType: { type: new GraphQLNonNull(GraphQLString) },
    label: { type: GraphQLString },
    operation: { type: new GraphQLNonNull(GraphQLString) },
    // Approval Cycle Configs
    processType: { type: GraphQLString },
    approvalSegmentConfigs: { type: new GraphQLList(GraphQLApprovalSegmentConfigList) },
    waitForEverybody: { type: GraphQLBoolean },
    // Life Cycle Configs
    type: { type: GraphQLString },
    startState: { type: GraphQLStartStateConfig },
    // Layouts
    relationships: { type: new GraphQLList(GraphQLEntityRelationship) },
    // Section Configs
    prerequisites: { type: new GraphQLList(GraphQLPrerequisite) },
    triggers: { type: new GraphQLList(GraphQLTrigger) },
    lifeCycleActions: { type: new GraphQLList(GraphQLLifeCycleAction) },
    configProperties: { type: new GraphQLList(GraphQLSectionConfigRoleListConfig) },
    relationships2: {
      type: new GraphQLList(GraphQLSectionConfigLineItemConfig),
      resolve: x => x.relationships,
    },
  },
});

export const entity = {
  type: GraphQLEntityType,
  args: {
    path: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: (...args) => {
    const token = getToken(args[2], args[0]);
    const { path } = args[1];
    return getEntity(token, path);
  },
};
