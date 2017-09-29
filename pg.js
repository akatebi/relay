const { Pool } = require('pg');
const users = require('./users.json');


const init = async () => {

  // pools will use environment variables
  // for connection information
  const pool = new Pool({
    host: 'localhost',
    port: '5432',
    user: 'postgres',
    database: 'postgres',
    password: 'k1',
  });

  // CREATE EXTENSION IF NOT EXISTS "pgcrypto";
  const createTableText = `
  DROP TABLE IF EXISTS users;
  CREATE TEMP TABLE IF NOT EXISTS users (
    time TIME DEFAULT NOW(),
    method VARCHAR(5),
    url TEXT PRIMARY KEY,
    data JSONB
  );
  `;
  // create our temp table
  await pool.query(createTableText);

  // console.log('pool', res);

  // const newUser = { email: 'brian.m.carlson@gmail.com' };
  // create a new user
  await pool.query(
    'INSERT INTO users(method, url, data) VALUES($1, $2, $3)',
    ['GET', '/999/99', users],
  );
  const { rows } = await pool.query('SELECT * FROM users');
  // console.log(JSON.stringify(rows, 0, 2));
  console.log(rows);

  pool.end();
};

try {
  init();
} catch (x) {
  console.error(x);
}

// setTimeout(() => {}, 10000);
