import 'babel-polyfill';
import 'es6-promise';
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import NavMenu from './component/base/NavMenu';

localStorage.setItem('debug', process.env.DEBUG);

ReactDOM.render(
  <Router >
    <NavMenu />
  </Router>,
  document.getElementById('root'),
);
