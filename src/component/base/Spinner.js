/* eslint react/prop-types:0 */
import React from 'react';
import Halogen from 'halogen';
import { themeKey } from '../../constant/app';

const Spinner = () => {

  const themes = {
    cerulean: '#2FA4E7',
    cosmo: '#2780E3',
    cyborg: '#2A9FD6',
    darkly: '#375a7f',
    flatly: '#2C3E50',
    journal: '#EB6864',
    lumen: '#158CBA',
    paper: '#2196F3',
    readable: '#4582EC',
    sandstone: '#325D88',
    simplex: '#D9230F',
    slate: '#7A8288',
    spacelab: '#446E9B',
    superhero: '#DF691A',
    united: '#E95420',
    yeti: '#008cba',
  };

  const color = themes[localStorage.getItem(themeKey)] || '#1481A8';

  const styleOuter = {
    display: '-webkit-flex',
    display: 'flex',
    WebkitFlex: '0 1 auto',
    flex: '0 1 auto',
    WebkitFlexDirection: 'column',
    flexDirection: 'column',
    WebkitFlexGrow: 1,
    flexGrow: 1,
    WebkitFlexShrink: 0,
    flexShrink: 0,
    WebkitFlexBasis: '100%',
    flexBasis: '100%',
    maxWidth: '100%',
    height: window.innerHeight - 150,
    WebkitAlignItems: 'center',
    alignItems: 'center',
    WebkitJustifyContent: 'center',
    justifyContent: 'center',
  };

  const styleInner = {
    boxSizing: 'border-box',
    display: '-webkit-flex',
    display: 'flex', /* eslint no-dupe-keys:0 */
    WebkitFlex: '0 1 auto',
    flex: '0 1 auto',
    WebkitFlexDirection: 'row',
    flexDirection: 'row',
    WebkitFlexWrap: 'wrap',
    flexWrap: 'wrap',
  };

  const loaders = [
    <Halogen.PulseLoader color={color} />, // 0
    <Halogen.GridLoader color={color} />,
    <Halogen.ClipLoader color={color} />,
    <Halogen.RiseLoader color={color} />,
    <Halogen.BeatLoader color={color} />,
    <Halogen.SyncLoader color={color} />, // 5
    <Halogen.RotateLoader color={color} />,
    <Halogen.FadeLoader color={color} />,
    <Halogen.SquareLoader color={color} />,
    <Halogen.ScaleLoader color={color} />,
    <Halogen.SkewLoader color={color} />, // 10
    <Halogen.MoonLoader color={color} />,
    <Halogen.RingLoader color={color} />,
    <Halogen.BounceLoader color={color} />,
    <Halogen.DotLoader color={color} />,
    <Halogen.PacmanLoader color={color} />, // 15
  ];

  let index = 12;
  if (process.env.NODE_ENV !== 'production') {
    index = Math.floor((Math.random() * 10000000)) % loaders.length;
  }

  return (
    <div style={styleOuter}>
      <div style={styleInner}>
        {loaders[index]}
      </div>
    </div>
  );
};

export default Spinner;

// const loader = Comp => ({ props }) => (props ? <Comp {...props} /> : <Loader />);
