import PropTypes from 'prop-types';
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken } from './constant/app';


export const RoutePrv = ({ component: Component, render, ...rest }) => (
  <Route
    {...rest}
    render={(compProps) => {
      if (getToken()) {
        return render ? render(compProps) : <Component {...compProps} />;
      }
      return (
        <Redirect to={{
          pathname: '/signin',
          state: { from: compProps.location },
        }}
        />
      );
    }}
  />
);

RoutePrv.propTypes = {
  component: PropTypes.func,
  render: PropTypes.func,
};
