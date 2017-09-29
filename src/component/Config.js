import PropTypes from 'prop-types';
import React from 'react';
import { NavDropdown, MenuItem } from 'react-bootstrap';
import menu from '../constant/menu.json';

const Config = (props) => {

  const { history } = props;

  const pushPath = (path, evt) => {
    evt.preventDefault();
    history.push(`/${path}`);
  };

  const paths = menu.config.map(item => item.url);

  return (
    <NavDropdown
      eventKey={props.eventKey}
      href="#config"
      title="Config"
      id="collapsible-navbar-dropdown"
    >
      {paths.map((path, i) => (
        <MenuItem
          key={path}
          href={`#${menu.config[i].url}`}
          disabled={!menu.config[i].enabled}
          eventKey={`${props.eventKey}.${i}`}
          onClick={pushPath.bind(this, menu.config[i].url)}
        >
          <span className={'glyphicon glyphicon-menu-right'} />
          &nbsp;&nbsp;{menu.config[i].label}
        </MenuItem>
      ))
      }
    </NavDropdown>
  );
};


Config.propTypes = {
  eventKey: PropTypes.number.isRequired,
  history: PropTypes.object.isRequired,
};

export default Config;
