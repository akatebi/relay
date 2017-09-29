import fs from 'fs';
import { graphql as origGraphql } from 'graphql';
import mkdirp from 'mkdirp';
import shell from 'shelljs';
import lockQuery from './query/lock';
import unlockQuery from './query/unlock';
import schema from '../../../server/data/schema';
import myFetch from '../../../server/data/database/myFetch';
import { getAccessToken } from '../../../server/data/database/userIdentity';

const { DEBUG_TEST } = process.env;

global.jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;

export const shuffle = str => str.split('').sort(() => 0.5 - Math.random()).join('');

export const random = (min, max, exp = 0) => {
  const number = (Math.random() * (max - min)) + min;
  const multiplier = 10 ** exp;
  const result = Math.round(number * multiplier) / multiplier;
  return result;
};

export const getToken = async () => {
  const username = 'User0';
  const password = 'Password0!';
  global.token = await getAccessToken(username, password);
  // console.log('access_token', global.token.slice(0, 30));
  global.authorization = `Bearer ${global.token}`;
  return global.token;
};

export const cleanLog = module =>
  new Promise((resolve, reject) => shell.exec(`rm -rf ${module}`,
    (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    }));

export const writeFile = DEBUG_TEST === 'true' ? (...args) => {
  const { length: l } = args;
  const data = args[l - 1];
  const name = args[l - 2];
  const path = args.slice(0, l - 2).join('/');
  return new Promise((resolve, reject) =>
    mkdirp(`${path}`, (err) => {
      if (err) {
        reject(err);
      } else {
        fs.writeFile(`${path}/${name}.json`, JSON.stringify(data, 0, 3),
          (err) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
      }
    }));
} : () => {};

const dataLoader = { load: ({ url, options }) => myFetch(url, options) };

export const graphql = (query, params) => {
  const { authorization } = global;
  const request = { headers: { authorization } };
  return origGraphql(schema, query, { dataLoader }, request, params);
};

export const lockDocument = async (path, method = 'put') => {
  const params = {
    input: {
      method,
      path,
    },
  };
  const result = await graphql(lockQuery, params);
  try {
    expect(result.errors).toBeUndefined();
    if (method === 'put') {
      expect(result.data.lockProfileMutation.lockStatus.isLocked).toBe(true);
    }
  } catch (exp) {
    console.log(path);
    console.error(exp);
    throw exp;
  }
  return result;
};

export const unlockDocument = async (path) => {
  const params = {
    input: {
      path,
    },
  };
  const result = await graphql(unlockQuery, params);
  try {
    expect(result.errors).toBeUndefined();
    // expect(result.data.lockProfile.lockStatus.isLocked).toBe(true);
  } catch (exp) {
    console.error(exp);
    throw exp;
  }
  return result;
};

export const isNewDocument = ({ standardProperties }) => {
  const entityState = standardProperties.find(({ name }) => name === 'Rev_State') || {};
  return entityState.valueVM === 'New';
};

export const errorMessage = (str) => {
  const n = str.indexOf('{');
  const m = str.lastIndexOf('}');
  const msg = str.slice(n, m + 1);
  return msg ? JSON.parse(msg) : msg;
};

const guidRegEx = /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/;
const guidRegExStrict = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export const getGUID = pathname =>
  pathname.split('/').find(item => guidRegExStrict.test(item));

export const fixGUIDS = (obj, tab = '') => {
  if (obj instanceof Array) {
    obj.forEach((x, i) => {
      if (typeof x === 'string') {
        obj[i] = x.replace(guidRegEx, 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
      } else {
        fixGUIDS(x, `${tab} `);
      }
    });
  } else if (typeof obj === 'object' && obj !== null) {
    Object.keys(obj).forEach((prop) => {
      const item = obj[prop];
      if ((typeof item === 'object' && item !== null) || item instanceof Array) {
        fixGUIDS(item, `${tab} `);
      } else if (guidRegEx.test(obj[prop])) {
        obj[prop] = obj[prop].replace(guidRegEx, 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
      }
    });
  }
  return obj;
};

export const printErrors = ({ errors = [] }) =>
  errors.map(({ message: msg }) => {
    if (/\$input/.test(msg)) {
      const first = msg.indexOf('{');
      const last = msg.lastIndexOf('}') + 1;
      const message = msg.slice(first, last);
      return { input: JSON.parse(message), error: msg.slice(last) };
      // console.log(JSON.stringify(obj, 0, 3));
    }
    return null;
  }).filter(x => x).forEach(({ input, error }) => {
    console.log(JSON.stringify(input, 0, 3));
    console.error(error);
  });
