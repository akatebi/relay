import PropTypes from 'prop-types';
import React from 'react';
import { NavDropdown, MenuItem } from 'react-bootstrap';
import menu from '../constant/menu.json';

const Content = (props) => {

  const { history } = props;

  const pushPath = (path, evt) => {
    evt.preventDefault();
    history.push(`/${path}`);
  };

  const paths = menu.content.map(item => item.url);

  return (
    <NavDropdown
      eventKey={props.eventKey}
      href="#content"
      title="Content"
      id="collapsible-navbar-dropdown"
    >
      {paths.map((path, i) => (
        <MenuItem
          key={path}
          href={`#${menu.content[i].url}`}
          disabled={!menu.content[i].enabled}
          eventKey={`${props.eventKey}.${i}`}
          onClick={pushPath.bind(this, menu.content[i].url)}
        >
          <span className={'glyphicon glyphicon-menu-right'} />
          &nbsp;&nbsp;{menu.content[i].label}
        </MenuItem>
      ))
      }
    </NavDropdown>
  );
};


Content.propTypes = {
  eventKey: PropTypes.number.isRequired,
  history: PropTypes.object.isRequired,
};

export default Content;
