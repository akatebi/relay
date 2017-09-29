const path = require('path');
const webpack = require('webpack');
const shell = require('shelljs');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

process.argv.forEach((arg) => {
  if (/^NODE_ENV=/.test(arg)) {
    process.env.NODE_ENV = arg.split('=')[1];
  }
});

const DEV = process.env.NODE_ENV === 'development';

process.env.DEBUG = 'app:*';

let cmd;
cmd = shell.exec('git log --date=local -n 1', { silent: true });
process.env.GIT_LOG = cmd.code ? cmd.stderr : cmd.stdout;
cmd = shell.exec('git rev-parse --abbrev-ref HEAD', { silent: true });
process.env.GIT_BRANCH = cmd.code ? cmd.stderr : cmd.stdout;

const vendor = [
  'classnames',
  'clone',
  'debug',
  'deep-equal',
  'deepmerge',
  'halogen',
  'react',
  'react-loader',
  'react-router',
  'react-router-dom',
  'react-relay',
  'react-bootstrap',
  'eonasdan-bootstrap-datetimepicker',
  'react-bootstrap-datetimepicker',
  'react-faux-dom',
  'react-numeric-input',
  'react-s-alert',
  'react-select',
  'react-stepzilla',
  'react-typeahead',
  'react-ui-tree',
  'redbox-react',
  'relay-runtime',
  'prop-types',
  'qs',
  'rc-checkbox',
  'whatwg-fetch',
];


const config = {
  devtool: DEV ? 'source-map' : false,
  entry: DEV ?
    {
      index: ['./src', 'webpack-hot-middleware/client'],
      vendor,
    } : {
      index: './src',
      vendor,
    },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: DEV ? '[name].bundle.js' : '[name].[chunkhash].js',
    publicPath: '/relay/dist/',
    pathinfo: true,
  },
  plugins: DEV ? [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.EnvironmentPlugin(['NODE_ENV', 'DEBUG', 'GIT_LOG', 'GIT_BRANCH']),
    new webpack.optimize.CommonsChunkPlugin({ name: 'common' }),
  ] : [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.EnvironmentPlugin(['NODE_ENV', 'DEBUG', 'GIT_LOG', 'GIT_BRANCH']),
    new webpack.optimize.CommonsChunkPlugin({ name: 'common' }),
    new HtmlWebpackPlugin({ title: 'Linqoln', template: 'index.ejs', filename: '../index.html' }),
    new UglifyJSPlugin(),
    new ProgressBarPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['babel-loader', 'eslint-loader'],
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
        include: path.resolve(__dirname, 'src/style'),
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        // loaders: ['style-loader', 'css-loader'],
        use: ['style-loader', 'css-loader'],
        include: path.resolve(__dirname, 'src/style'),
        exclude: /node_modules/,
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|gif)(\?\S*)?$/,
        use: ['url-loader?limit=100000&name=[name].[ext]'],
      },
    ],
  },
};

module.exports = config;

// console.log(JSON.stringify(config, 0, 2));
