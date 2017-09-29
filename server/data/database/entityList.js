import myFetch from './myFetch';
import { serverPath, fetchOptions } from './constant';
import { profileListMap } from './maps/profileListMaps';

export const getEntityList = (token, entity) => {
  const url = `${serverPath}${entity}`;
  const options = fetchOptions(token);
  return myFetch(url, options)
    .then(data => profileListMap(data))
    .then(list => list.sort((a, b) => a.title.localeCompare(b.title)));
};

export const getEntityListLabels = () => {
  const labels = [
    {
      label: 'Title',
      id: 'title',
    },
    {
      label: 'Control Number',
      id: 'controlNumber',
    },
    {
      label: 'Author',
      id: 'author',
    },
    {
      label: 'Status',
      id: 'fullStatus',
    },
    {
      label: 'Created',
      id: 'created',
    },
  ];
  return Promise.resolve(labels);
};
