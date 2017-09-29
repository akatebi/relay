/* eslint no-console:0 */
import Koa from 'koa';
import fs from 'fs';
import logger from 'koa-logger';
import mount from 'koa-mount';
import send from 'koa-send';
import webpack from 'webpack';
import {
  // devMiddleware,
  hotMiddleware,
} from 'koa-webpack-middleware';
import devMiddleware from 'webpack-koa2-middleware';
import config from '../webpack.config';

const { NODE_ENV: nodeEnv } = process.env;
console.log('==> NODE_ENV =', nodeEnv);
const APP_PORT = nodeEnv === 'development' ? 3000 : 3006;
const hostname = 'localhost';
const port = APP_PORT;

// Serve the Relay app
let app;
try {
  app = new Koa();
} catch (exp) {
  console.error('####', exp);
}

app.use(logger());

if (nodeEnv === 'development') {
  const compile = webpack(config);
  app.use(devMiddleware(compile, {
    publicPath: config.output.publicPath,
    // historyApiFallback: true,
    // contentBase: '.',
    stats: { colors: true },
    noInfo: true,
  }));
  app.use(hotMiddleware(compile));
} else {
  // Serve static resources
  const assets = new Koa();
  assets.use(async (ctx) => {
    const root = `${__dirname}/../dist`;
    console.log('==> ASSETS PATH', ctx.path, root);
    await send(ctx, ctx.path, { root });
    // await next();
  });
  app.use(mount('/relay/dist', assets));
}

// Html5 Routing
const encoding = 'utf8';
const readFileThunk = src =>
  new Promise((resolve, reject) =>
    fs.readFile(src, { encoding }, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    }));

const indexFile = nodeEnv === 'development' ? 'index-dev.html' : 'index.html';

app.use(async (ctx) => {
  console.log('==> APP PATH', ctx.path);
  const index = `${__dirname}/../${indexFile}`;
  ctx.type = 'html';
  ctx.body = await readFileThunk(index);
});

app.listen(port, (error) => {
  if (error) {
    console.error(error);
  }
  console.info('==> ✅  HTTP Server Started');
  console.info('==> 🌎  Go to http://%s:%s', hostname, port);
});
