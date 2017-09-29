import { getToken, cleanLog, graphql, writeFile, fixGUIDS } from '../../../__tests__/service';
import { entityRevRouteMap } from '../../../../../share/entityRouteMaps';
import { EntityTypes } from '../../../../../share/entityTypes';
import { getProfileList } from '../../../../../server/data/database/profileList';
// import { getEntity } from '../../../../../server/data/database/entity';
import queryApplicationRole from './query/applicationRole';
import queryApprovalCycleConfig from './query/approvalCycleConfig';
import queryOrganization from './query/organization';
import querySectionConfig from './query/sectionConfig';

const debug = require('debug')('app:src:component:base:entities:entityConfig');

const dirname = `${__dirname}/logs`;
const writeSF = writeFile.bind(this, dirname);

const queries = {
  ApplicationRole: queryApplicationRole,
  ApprovalCycleConfig: queryApprovalCycleConfig,
  Organization: queryOrganization,
  SectionConfig: querySectionConfig,
};

////////////////////// M O D I F Y V A R I A B L E S ////////////////////////////
const docCount = 1;
const entityTypeRegExp = /ApprovalCycleConfig|ApplicationRole|Organization$|SectionConfig/;
/////////////////////////////////////////////////////////////////////////////////

describe('entityConfig', () => {

  beforeAll(getToken);
  beforeAll(cleanLog.bind(this, dirname));

  EntityTypes.filter(en => entityTypeRegExp.test(en)).map(entityType =>
    test(entityType, async () => {
      const { token } = global;
      const entity = `/${entityRevRouteMap(entityType)}/ids`;
      const profileList = await getProfileList(token, entity);
      await writeSF(entityType, 'profileList', profileList);
      const count = Math.min(docCount, profileList.length);
      for (let i = 0; i < count; i++) {
        const item = profileList[i];
        const path = `/${entityRevRouteMap(entityType)}/${item}`;
        debug('path', path);
        // const response = await getEntity(token, path);
        // expect(fixGUIDS(response)).toMatchSnapshot();
        debug('entityType', entityType);
        const query = queries[entityType];
        expect(query).toBeDefined();
        const result = await graphql(query, { path });
        await writeSF(entityType, i, 'result', result);
        expect(result.errors).toBeUndefined();
        expect(fixGUIDS(result.data)).toMatchSnapshot();
      }
    }));

});
