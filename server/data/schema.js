import {
  GraphQLSchema,
  GraphQLObjectType,
} from 'graphql';

import { choiceLookups } from './choiceLookups';
import { controlNumberSequence } from './controlNumber';
import { entityOptionLookups } from './entityOptionLookups';
import { config } from './config';
import { cultures, addCulturesMutation } from './cultures';
import { contentIdentity } from './contentIdentity';
import { dashboard } from './dashboard';
import { entity } from './entity';
import { entityList } from './entityList';
import { entityTree } from './entityTree';
import { flatList } from './flatList';
import { identity } from './identity';
import { lockStatus, lockProfileMutation, unlockProfileMutation } from './lock';
import { makeCopyProfileMutation } from './makeCopy';
import { modifyProfileMutation } from './modify';
import { flat, nested, nestedMutation } from './nestedAndFlat';
import {
  newPageMutation,
  newPageOrg,
  newPageKlass,
  newPageType,
  newPageLayout,
  newRevision,
} from './newPage';
import { pageSaveMutation } from './pageSave';
import { profileList } from './profileList';
import { propertySaveMutation } from './propertySave';
import { associations } from './associations';
import { section } from './section';
import { sectionsAll } from './sectionsAll';
import { profileNav } from './profileNav';
import { selfRolesLookup } from './selfRolesLookup';
import { approvalCycleList, eligibleApprovers, selectedApprovalCycle } from './subwiz';
import { subWizSaveMutation } from './subWizSave';
import { toolbar, approvalCycleToolbar, processActionMutation } from './toolbar';
import { viewer, signInMutation, signOutMutation } from './userIdentity';
import { users } from './users';
import { valueVMOptions, valueVMTypeOptions } from './valueVMOptions';

const GraphQLMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addCulturesMutation,
    lockProfileMutation,
    makeCopyProfileMutation,
    modifyProfileMutation,
    nestedMutation,
    newPageMutation,
    pageSaveMutation,
    processActionMutation,
    propertySaveMutation,
    signInMutation,
    signOutMutation,
    subWizSaveMutation,
    unlockProfileMutation,
  },
});

const GraphQLRoot = new GraphQLObjectType({
  name: 'Root',
  fields: {
    approvalCycleList,
    approvalCycleToolbar,
    associations,
    choiceLookups,
    config,
    contentIdentity,
    controlNumberSequence,
    cultures,
    dashboard,
    eligibleApprovers,
    entity,
    entityList,
    entityOptionLookups,
    entityTree,
    flat,
    flatList,
    identity,
    lockStatus,
    nested,
    newPageOrg,
    newPageKlass,
    newPageType,
    newPageLayout,
    newRevision,
    profileList,
    section,
    sectionsAll,
    profileNav,
    selectedApprovalCycle,
    selfRolesLookup,
    toolbar,
    users,
    viewer,
    valueVMOptions,
    valueVMTypeOptions,
  },
});

export default new GraphQLSchema({
  query: GraphQLRoot,
  mutation: GraphQLMutation,
});
