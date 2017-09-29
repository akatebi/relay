import PropTypes from 'prop-types';
import React from 'react';
import { NavDropdown, MenuItem } from 'react-bootstrap';
import { themeKey } from '../constant/app';

const themes = [
  'default',
  'cerulean',
  'cosmo',
  'cyborg',
  'darkly',
  'flatly',
  // 'journal',
  // 'lumen',
  // 'paper',
  'readable',
  'sandstone',
  'simplex',
  // 'slate',
  'spacelab',
  // 'superhero',
  'united',
  // 'yeti',
];

let theme = window.localStorage.getItem(themeKey);
if (themes.indexOf(theme) === -1) {
  theme = themes[0];
}
import(`../style/theme/${theme}.less`);

const Themes = (props) => {

  const selectedIndex = themes.indexOf(theme);

  const select = (ekey, evt) => {
    evt.preventDefault();
    const key = ekey.split('.')[1];
    const theme = themes[key];
    // console.log('THEME:', theme);
    window.localStorage.setItem(themeKey, theme);
    location.reload();
  };

  const cog = <span className="glyphicon glyphicon-cog" />;

  return (
    <NavDropdown
      eventKey={props.eventKey}
      title={cog}
      id="collapsible-navbar-dropdown"
    >
      {themes.map((theme, index) =>
        (<MenuItem
          onSelect={select}
          key={theme}
          // active={index === selectedIndex}
          eventKey={`${props.eventKey}.${index}`}
        >
          <div style={{ borderStyle: (index === selectedIndex ? 'dotted' : 'none') }}>
            <div style={{ marginLeft: 5, marginRight: 5 }}>
              {`${theme.charAt(0).toUpperCase()}${theme.slice(1)}`}
            </div>
          </div>
        </MenuItem>))
      }
    </NavDropdown>
  );
};

Themes.propTypes = {
  eventKey: PropTypes.number.isRequired,
};

export default Themes;
