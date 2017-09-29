/* eslint no-console:0, camelcase:0 */
import Koa from 'koa';
import graphQLHTTP from 'koa-graphql';
import cors from 'kcors';
import bodyparser from 'koa-bodyparser';
import mount from 'koa-mount';
import {
  parse,
  print,
} from 'graphql';
import DataLoader from 'dataloader';
import myFetch from './data/database/myFetch';
import schema from './data/schema';
import { url2file } from './data/database/constant';

const { NODE_ENV: nodeEnv, GQLOG: gqlog } = process.env;

let token = '';
if (nodeEnv === 'development') {
  try {
    const { access_token } = require(url2file('post', '/token'));
    token = access_token || '';
  } catch ({ message }) {
    console.error(message);
  }
}

const GRAPHQL_PORT = nodeEnv === 'development' ? 8080 : 8086;
const hostname = 'localhost';
const port = GRAPHQL_PORT;

console.log('==> NODE_ENV =', nodeEnv);
console.log('==> TOKEN =', `${token.slice(0, 30)}...`);

// Expose a GraphQL endpoint
const app = new Koa();
app.use(cors());
app.use(bodyparser());

const pretty = true;
const graphiql = nodeEnv !== 'production';
const rootValue = graphiql ? { token } : {};
const formatError = (error) => {
  const format = {
    error: error.message,
    locations: error.locations,
    path: error.path,
    stack: nodeEnv === 'development' && error.stack.split('\n')[0],
  };
  console.error(format);
  return format;
};

if (gqlog) {
  app.use(async ({ request, response }, next) => {
    const { method } = request;
    const { variables, query } = request.body;
    if (method === 'POST' && !/IntrospectionQuery/.test(query)) {
      try {
        console.log('<<========================== R E Q U E S T ==========================>>');
        console.log(print(parse(query)));
        console.log('<<========================= V A R I A B L E S =======================>>');
        console.log(JSON.stringify(variables, 0, 2));
        await next();
        console.log('<<========================= R E S P O N S E =========================>>');
        const { data } = JSON.parse(response.body);
        console.log(JSON.stringify(data, 0, 2));
      } catch (err) {
        console.log(err.message);
      }
    } else {
      console.log('GraphQL', method === 'POST' ? 'Introspection POST' : method, 'Silenced');
      await next();
    }
  });
}

const banner = ({ body: { query } }) => {
  if (query) {
    const roof = '------------------------------------------------------------';
    const line = '----------------------------------------';
    const space = '                                        ';
    let name = line;
    if (/Query/.test(query)) {
      name = print(parse(query)).slice(6).split('Query')[0];
    } else if (/Mutation/.test(query)) {
      name = print(parse(query)).slice(9).split('($input:')[0];
    }
    let nameSpaced = ' ';
    name.split('').forEach((x, i) => {
      nameSpaced = `${nameSpaced}${x === x.toUpperCase() && i ? '- ' : ''}${x} `;
    });
    const len = line.length - (nameSpaced.length / 2);
    const titleLength = nameSpaced.length % 2 ? nameSpaced.length + 2 : nameSpaced.length + 1;
    console.log(space.slice(0, len), `+${roof.slice(0, titleLength)}+`);
    const subLine = line.slice(0, len);
    console.log(`>${subLine}|`, nameSpaced, `${nameSpaced.length % 2 ? '|-' : '|'}${subLine}<`);
    console.log(space.slice(0, len), `+${roof.slice(0, titleLength)}+`);
  }
};

const dataLoaderEnable = true;
const cacheKeyFn = ({ url }) => url;
app.use(async ({ request }, next) => {
  const load = ({ url, options }) => myFetch(url, options);
  rootValue.dataLoader = dataLoaderEnable ?
    new DataLoader(keys => Promise.all(keys.map(load)), { cacheKeyFn }) : { load };
  banner(request);
  await next();
});

app.use(mount('/',
  graphQLHTTP({ schema, pretty, graphiql, rootValue, formatError }),
));

app.listen(GRAPHQL_PORT, (error) => {
  if (error) {
    console.error(error);
  }
  console.info('==> ✅  GraphQL Server Started');
  console.info('==> 🌎  Go to http://%s:%s', hostname, port);
});
