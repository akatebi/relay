import React from 'react';
import qs from 'qs';
import Alert from 'react-s-alert';
import moment from 'moment';

// const debug = require('debug')('app:service:alert');

const options = {
  position: 'top-right',
  effect: 'slide',
  beep: false,
  timeout: 3000,
  offset: 0,
};

const timeString = (timeStr) => {
  const fromNow = `${moment(timeStr).fromNow()}`;
  const dateFmt = `${moment(timeStr).format('ll')} ${moment(timeStr).format('LT')}`;
  const dateOut = `${fromNow} on ${dateFmt}`;
  return dateOut;
};

const getMsg = (msg, eventTime) =>
  (eventTime ? `${msg} - ${timeString(eventTime)}` : msg);

export const successAlert = (msg, eventTime) => {
  setTimeout(() => {
    const message = getMsg(msg, eventTime);
    Alert.success(message, options);
  }, 1000);
};

export const infoAlert = (msg, eventTime) => {
  let message;
  if (!eventTime || eventTime === '0001-01-01T00:00:00Z') {
    message = msg;
  } else {
    message = getMsg(msg, eventTime);
  }
  Alert.info(message, options);
};

export const errorAlert = (msg, eventTime) => {
  const message = getMsg(msg, eventTime);
  if (/^https/.test(message)) {
    const { id } = qs.parse(message.split('_queries?')[1]);
    Alert.error(<a target="foo" href={message}>{`BUG: ${id}`}</a>, { ...options, timeout: 10000 });
  } else {
    Alert.error(message, { ...options, timeout: 10000 });
  }
};
