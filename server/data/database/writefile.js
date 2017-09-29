import fs from 'fs';
import 'babel-polyfill';
import { Pool } from 'pg';
import sizeof from 'object-sizeof';
import { url2file, url2pathname } from './constant';

const db = {
  host: 'localhost',
  port: '5432',
  user: 'postgres',
  database: 'postgres',
  password: 'k1',
};

const dbInit = async () => {
  if (global.dbInit) return;
  global.dbInit = true;
  const pool = new Pool(db);
  const createTableText = `
    DROP TABLE IF EXISTS capture;
    CREATE TEMP TABLE IF NOT EXISTS files (
      time TIME DEFAULT NOW(),
      method VARCHAR(5),
      url TEXT PRIMARY KEY,
      data JSONB
    );
  `;
  // const res =
  await pool.query(createTableText);
  // console.log(res);
  await pool.end();
};

export const writeFile = async (url, data, options) => {
  if (process.env.NODE_ENV === 'development') {
    return new Promise((resolve, reject) => {
      const { method = 'GET' } = options;
      const maxFileSizeKB = 500000;
      const fileSize = sizeof(data);
      const pretty = data => JSON.stringify(data, 0, 3);
      let content = data;
      if (fileSize > maxFileSizeKB * 1024) {
        content = `file size is ${fileSize} Bytes. Too large to save`;
      }
      const file = url2file(method, url);
      fs.writeFile(file, pretty(content),
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
    });
  } else if (process.env.NODE_ENV === 'test') {
    await dbInit();
    const pool = new Pool(db);
    const { method = 'GET' } = options;
    const res = await pool.query(
      'INSERT INTO capture(method, url, data) VALUES($1, $2, $3)',
      [{ method, url: url2pathname(url), data }],
    );
    console.log(res);
    await pool.end();
    return data;
  }
  return data;
};
