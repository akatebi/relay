import PropTypes from 'prop-types';
import React from 'react';
import { NavDropdown, MenuItem } from 'react-bootstrap';
import menu from '../constant/menu.json';

const Admin = (props) => {

  const { history } = props;

  const pushPath = (path, evt) => {
    evt.preventDefault();
    history.push(`/${path}`);
  };

  const paths = menu.admin.map(item => item.url);

  return (
    <NavDropdown
      eventKey={props.eventKey}
      href="#admin"
      title="Admin"
      id="collapsible-navbar-dropdown"
    >
      {paths.map((path, i) => (
        <MenuItem
          key={path}
          href={`#${menu.admin[i].url}`}
          disabled={!menu.admin[i].enabled}
          eventKey={`${props.eventKey}.${i}`}
          onClick={pushPath.bind(this, menu.admin[i].url)}
        >
          <span className={'glyphicon glyphicon-menu-right'} />
          &nbsp;&nbsp;{menu.admin[i].label}
        </MenuItem>
      ))
      }
    </NavDropdown>
  );
};

Admin.propTypes = {
  eventKey: PropTypes.number.isRequired,
  history: PropTypes.object.isRequired,
};

export default Admin;
