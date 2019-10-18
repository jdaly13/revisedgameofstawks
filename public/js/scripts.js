import React from 'react';
import ReactDom from 'react-dom';
//import injectTapEventPlugin from 'react-tap-event-plugin';
//import getMuiTheme from 'material-ui/styles/getMuiTheme';
//import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
//import { browserHistory, Router } from 'react-router';
import AppRouting from './routes.js';
import '../scss/style.scss';

const render = (App) => {
  ReactDom.render(<App/>, document.getElementById('main'));
}

render(AppRouting);

