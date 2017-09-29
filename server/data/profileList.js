import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLUnionType,
} from 'graphql';

import {
  getProfileList,
} from './database/profileList';

import { getToken } from './database/constant';

import { GraphQLEntityVMType } from './entityVM';

const GraphQLColumnHeaderType = new GraphQLObjectType({
  name: 'ListColumnHeader',
  fields: {
    index: { type: new GraphQLNonNull(GraphQLInt) },
    label: { type: new GraphQLNonNull(GraphQLString) },
    type: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const ControlNumberColumnValueType = new GraphQLObjectType({
  name: 'ControlNumberColumnValue',
  fields: {
    valueControlNumber: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ value: { controlNumberString } }) => controlNumberString,
    },
  },
});

const DateColumnValueType = new GraphQLObjectType({
  name: 'DateColumnValue',
  fields: {
    valueDate: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ value }) => value,
    },
  },
});

const RoleListColumnValueType = new GraphQLObjectType({
  name: 'RoleListColumnValue',
  fields: {
    valueRoleList: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLEntityVMType)),
      resolve: ({ value: { $values } }) => $values,
    },
  },
});

const TextColumnValueType = new GraphQLObjectType({
  name: 'TextColumnValue',
  fields: {
    valueText: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ value }) => value,
    },
  },
});

export const GraphQLColumnValueUnionType = new GraphQLUnionType({
  name: 'ProfileTableColumnValueUnion',
  types: [
    ControlNumberColumnValueType,
    DateColumnValueType,
    RoleListColumnValueType,
    TextColumnValueType,
  ],
  resolveType: ({ propertyType }) => {
    switch (propertyType) {
      case 'ControlNumber':
        return ControlNumberColumnValueType;
      case 'Date':
        return DateColumnValueType;
      case 'RoleList':
        return RoleListColumnValueType;
      case 'Text':
        return TextColumnValueType;
      default:
        console.error(`${propertyType} is unknown`);
        return null;
    }
  },
});

const GraphQLColumnType = new GraphQLObjectType({
  name: 'ProfileTableColumn',
  fields: {
    index: { type: new GraphQLNonNull(GraphQLInt) },
    propertyType: { type: new GraphQLNonNull(GraphQLString) },
    value: {
      type: GraphQLColumnValueUnionType,
      resolve: ({ propertyType, value }) => ({ propertyType, value }),
    },
  },
});

const GraphQLRowType = new GraphQLObjectType({
  name: 'ProfileTableRow',
  fields: {
    rowKey: { type: new GraphQLNonNull(GraphQLEntityVMType) },
    columns: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLColumnType)),
    },
  },
});

export const GraphQLProfileTableType = new GraphQLObjectType({
  name: 'ProfileTable',
  fields: {
    sortedColumnIndex: { type: new GraphQLNonNull(GraphQLInt) },
    sortOrder: { type: new GraphQLNonNull(GraphQLString) },
    columnHeaders: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLColumnHeaderType)),
    },
    rows: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLRowType)),
      resolve: ({ rows, columnHeaders }) => {
        rows.forEach(row => row.columns.forEach((col, i) => {
          col.propertyType = columnHeaders[i].type;
        }));
        return rows;
      },
    },
  },
});

const GraphQLProfileList = new GraphQLObjectType({
  name: 'ProfileList',
  fields: {
    tables: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLProfileTableType)),
    },
  },
});

export const profileList = {
  type: GraphQLProfileList,
  args: {
    entity: { type: GraphQLString },
  },
  resolve: (...args) => {
    const token = getToken(args[2], args[0]);
    const { entity } = args[1];
    return getProfileList(token, entity);
  },
};
