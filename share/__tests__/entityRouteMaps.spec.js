import { getEntityUrl } from '../entityRouteMaps';
import { EntityTypes } from '../entityTypes';


describe('Enity Route Maps', () => {

  EntityTypes.forEach(entityType =>
    test(entityType, () => {
      expect(getEntityUrl(entityType)).toBeDefined();
      expect(getEntityUrl(entityType)).toMatchSnapshot();
    }));

});
