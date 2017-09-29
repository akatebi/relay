import sizeof from 'object-sizeof';
// ============================
// Edit these values as required
// ============================
const { protocol, hostname } = window.location;

const config = window.$SiemensQMS || {
  appName: 'Siemens PLM QMS',
  backEndHost: hostname,
  backEndPort: 52395,
  backEndVersion: 'api/v1',
};
export const { appName, backEndHost, backEndPort, backEndVersion } = config;
export const serverHost = `${protocol}//${backEndHost}:${backEndPort}`;
export const serverPath = `${protocol}//${backEndHost}:${backEndPort}/${backEndVersion}`;
export const signInTokenKey = 'token';
export const themeKey = 'theme';

const GRAPHQL_PORT = process.env.NODE_ENV === 'development' ? 8080 : 8086;
export const graphqlServer = `${protocol}//${hostname}:${GRAPHQL_PORT}`;
export const graphqlURL = `${graphqlServer}/graphql`;

export const getToken = () => localStorage.getItem(signInTokenKey) || '';

window.pretty = obj => JSON.stringify(obj, 0, 3);
window.log = (x, t = '#####') => {
  /* eslint no-console:0 */
  console.log(JSON.stringify(x, 0, 3), t);
  return x;
};
window.save = (data, file = 'data.json') => {
  if (process.env.NODE_ENV === 'development') {
    const options = {
      method: 'POST',
      body: JSON.stringify(data),
    };
    const size = Math.round(sizeof(options) / 1024 / 1024);
    // console.log('######', size / 1024 / 1024);
    if (size < 20) {
      const url = `http://localhost:4000/${file}`;
      // console.log('####', url, data);
      fetch(url, options);
    } else {
      console.log('*** WARNING *** Size %d mb is too large', size);
    }
  }
  return data;
};
