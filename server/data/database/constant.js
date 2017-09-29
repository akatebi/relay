import escapeStringRegexp from 'escape-string-regexp';
import HttpsProxyAgent from 'https-proxy-agent';
// ============================
// Edit these values as required
// ============================
const backEndHost = 'localhost';
// const backEndHost = '134.244.174.23';
const backEndPort = 52395;
const backEndVersion = '/api/v1';
export const serverHost = `http://${backEndHost}:${backEndPort}`;
export const serverPath = `http://${backEndHost}:${backEndPort}${backEndVersion}`;

export const mocking = () => {
  const { platform, env: { HOME } } = process;
  return (platform === 'linux' && HOME !== '/root');
};

global.log = (...args) => {
  if (typeof args[0] === 'object' && typeof args[0].then === 'function') {
    args[0].then(v => console.log(JSON.stringify(v, 0, 2), args[1] ? args[1] : ''));
  } else {
    console.log(JSON.stringify(args[0], 0, 2), args[1] ? args[1] : '');
  }
  return args[0];
};

export const url2file = (method = 'GET', url) => {
  const file = /\/token$/.test(url) ?
    'token' : url.split(`${serverPath}/`)[1].replace(/\//g, '-');
  const pathname = `${__dirname}/${method.toLowerCase()}/${file}.json`;
  if (mocking()) {
    return pathname.replace(process.env.HOME, '/media/akatebi/System/Users/gfoda0');
  }
  return pathname;
};

// const serverHostRegExp = /http:\/\/localhost:52395/;
// const backEndVersionRegExp = /\/api\/v1/;
const serverHostRegExp = new RegExp(escapeStringRegexp(serverHost));
const backEndVersionRegExp = new RegExp(escapeStringRegexp(backEndVersion));
export const url2pathname = url => url
  .replace(serverHostRegExp, '')
  .replace(backEndVersionRegExp, '');

const { NODE_ENV, DEBUG_TEST } = process.env;


const getAgent = () => ((NODE_ENV === 'development' || DEBUG_TEST === 'true') ?
  new HttpsProxyAgent('http://127.0.0.1:8888') : null);

export function authOptions(username, password) {
  function formEncode(data) {
    const pairs = Object.keys(data).map(name =>
      `${encodeURIComponent(name)}=${encodeURIComponent(data[name])}`);
    const encode = pairs.join('&').replace(/%20/g, '+');
    return encode;
  }
  const agent = getAgent();
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formEncode({
      username,
      password,
      grant_type: 'password',
    }),
    agent,
  };
}
export function fetchOptions(token) {
  const Authorization = `Bearer ${token}`;
  const agent = getAgent();
  return {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization,
    },
    agent,
  };
}

export const getToken = ({ headers }, arg0 = {}) => {
  const { authorization } = headers;
  const result = authorization ? authorization.split(' ')[1] : arg0.token;
  // global.log(arg0, '####TOKEN');
  return result;
};

global.pretty = x => JSON.stringify(x, null, 2);
