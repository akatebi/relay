
// const debug = require('debug')('app:root:service');

export const getGUID = pathname =>
  pathname.split('/').find(item =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(item));

export const allParams = ({ location, match, params = {}, name = '' }) => {
  const path = `${match.path}/${name}`.slice(1);
  const pathname = location.pathname.slice(1);
  const pathList = path.split('/');
  const pathnameList = pathname.split('/');
  // debug(name, 'pathList', pathList);
  // debug(name, 'pathnameList', pathnameList);
  const newParams = pathList.reduce((acc, prop, index) => {
    const value = pathnameList[index];
    // debug(name, 'prop', prop);
    if (prop[0] === ':') {
      acc[prop.slice(1)] = value;
    }
    return acc;
  }, {});
  // debug(name, 'newParams', window.pretty(newParams));
  const paramsAll = { ...params, ...newParams };
  // debug(name, 'params keys', Object.keys(paramsAll));
  return paramsAll;
};
