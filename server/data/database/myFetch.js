import fs from 'fs';
import fetch from 'node-fetch';
import sizeof from 'object-sizeof';
import { writeFile } from './writefile';
import { url2file, url2pathname, mocking } from './constant';

const myFetch = (url, options) => {
  const pathname = url2pathname(url);
  const { method = 'GET' } = options;
  if (mocking()) {
    if (process.env.NODE_ENV !== 'test') {
      if (method === 'GET') {
        console.log(pathname);
      } else {
        console.log(`${pathname} (${method})`);
      }
    }
    return new Promise((resolve, reject) => {
      const file = url2file(method, url);
      fs.readFile(file, (err, data) => {
        if (err) {
          reject(err);
        } else {
          const json = JSON.parse(data);
          const size = sizeof(json);
          const delay = Math.log(size) * 50 * 0.5;
          setTimeout(resolve, delay, json);
        }
      });
    });
  }
  const t1 = Date.now();
  return fetch(url, options)
    .then((resp) => {
      if (!resp.ok) {
        writeFile(url, resp, options);
        const { url: respUrl, status, statusText } = resp;
        throw new Error([statusText, status, url2pathname(respUrl)]);
      }
      return resp;
    })
    .then(resp => resp.json())
    .then(data => writeFile(url, data, options))
    .then((data) => {
      const delta = Date.now() - t1;
      let size = sizeof(data);
      const kb = 1024;
      const mb = kb * kb;
      if (size > mb) size = `${(size / mb).toFixed(0)} mb`;
      else if (size > kb) size = `${(size / kb).toFixed(0)} kb`;
      else size = `${size} b`;
      if (process.env.NODE_ENV !== 'test') {
        console.log(`${method} - ${pathname} - (${delta} ms, ${size})`);
      }
      return data;
    });
};

export default myFetch;
