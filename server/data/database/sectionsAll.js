import myFetch from './myFetch';
import { serverPath, fetchOptions } from './constant';

export const getNavLinks = (token, path) => {
  const url = `${serverPath}${path}/nav`;
  const options = fetchOptions(token);
  return myFetch(url, options)
    .then(data => data.nodes.map(({ url }) => url).filter(x => /sections/.test(x)))
    .then(urls => urls.map(url => `${serverPath}${path}/${url}`))
    .then(urls => Promise.all(urls.map(url =>
      myFetch(url, options)
        .catch(error => global.log(error)))))
    .then(sections => ({ sections }))
    .catch(error => global.log(error));
};
