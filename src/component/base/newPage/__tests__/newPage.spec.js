import clone from 'clone';
import { getToken, cleanLog, writeFile, graphql, fixGUIDS } from '../../../__tests__/service';
import { entityCreationFamilyRouteMap } from '../../../../../share/entityRouteMaps';
import createQuery from './query/create';
import orgQuery from './query/org';
import klassQuery from './query/klass';
import typeQuery from './query/type';
import layoutQuery from './query/layout';

const debug = require('debug')('app:src:component:base:newPage');

const dirname = `${__dirname}/logs`;
const writeNP = writeFile.bind(this, dirname);


describe('newPage', () => {

  beforeAll(getToken);
  beforeAll(cleanLog.bind(this, dirname));

  // TypeFn
  const typeFn = async (entityRoute, org, klass, { label, id }) => {
    const type = id.slice(0, 36);
    debug('type', entityRoute, label, type);
    const result = await graphql(layoutQuery, { entityRoute, org, klass, type });
    await writeNP('layout', result);
    expect(result.errors).toBeUndefined();
    expect(fixGUIDS(clone(result.data))).toMatchSnapshot();
  };
  // KlassFn
  const klassFn = async (entityRoute, org, { label, id }) => {
    const klass = id.slice(0, 36);
    debug('klass', entityRoute, label, klass);
    const result = await graphql(typeQuery, { entityRoute, org, klass });
    await writeNP('type', result);
    expect(result.errors).toBeUndefined();
    expect(fixGUIDS(clone(result.data))).toMatchSnapshot();
    const { newPageType, contentIdentity: { documentType, isChangeable } } = result.data;
    if (isChangeable) {
      await typeFn(entityRoute, org, klass, documentType);
    } else {
      await typeFn(entityRoute, org, klass, newPageType.options[0]);
    }
  };
  // Organization
  const orgFn = async (entityRoute, { label, id }) => {
    const org = id.slice(0, 36);
    debug('org', entityRoute, label, org);
    const result = await graphql(klassQuery, { entityRoute, org });
    await writeNP('klass', result);
    expect(result.errors).toBeUndefined();
    expect(fixGUIDS(clone(result.data))).toMatchSnapshot();
    const { newPageKlass, contentIdentity: { documentClass, isChangeable } } = result.data;
    if (isChangeable) {
      await klassFn(entityRoute, org, documentClass);
    } else {
      await klassFn(entityRoute, org, newPageKlass.options[0]);
    }
  };

  test('create', async () => {
    const { token } = global;
    const result = await graphql(createQuery, { token });
    await writeNP('create', result);
    expect(result.errors).toBeUndefined();
    expect(fixGUIDS(clone(result.data))).toMatchSnapshot();
    const creationEntityTypes = result.data.choiceLookups.creationEntityTypes;
    // entityRoutes
    for (let i = 0; i < creationEntityTypes.length; i++) {
      const { label } = creationEntityTypes[0];
      const entityRoute = entityCreationFamilyRouteMap(label);
      debug('entityRoute', entityRoute);
      const resultOrg = await graphql(orgQuery, { entityRoute });
      await writeNP('org', resultOrg);
      expect(resultOrg.errors).toBeUndefined();
      expect(fixGUIDS(clone(resultOrg.data))).toMatchSnapshot();
      const { newPageOrg, contentIdentity: { organization, isChangeable } } = resultOrg.data;
      if (isChangeable) {
        await orgFn(entityRoute, organization);
      } else {
        await orgFn(entityRoute, newPageOrg.options[0]);
      }
    }
  });

});
