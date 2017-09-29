import {
  GraphQLList,
  GraphQLString,
  GraphQLObjectType,
} from 'graphql';

import { GraphQLSection } from './section';
import { getToken } from './database/constant';
import { getNavLinks } from './database/sectionsAll';

const GraphQLSections = new GraphQLObjectType({
  name: 'Sections',
  fields: {
    sections: { type: new GraphQLList(GraphQLSection) },
  },
});

export const sectionsAll = {
  type: GraphQLSections,
  args: {
    path: { type: GraphQLString },
  },
  resolve: (...args) => {
    const token = getToken(args[2], args[0]);
    const { path } = args[1];
    return getNavLinks(token, path);
  },
};
