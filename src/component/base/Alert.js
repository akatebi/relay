import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';
import qs from 'qs';

const MyAlert = ({ message }) => {
  if (/^https/.test(message)) {
    const { id } = qs.parse(message.split('_queries?')[1]);
    return (<Alert bsStyle="danger">
      <a target="foo" href={message}>{`BUG: ${id}`}</a>
    </Alert>);
  }
  return <Alert bsStyle="danger">{message}</Alert>;
};

MyAlert.propTypes = {
  message: PropTypes.string.isRequired,
};

export default MyAlert;
