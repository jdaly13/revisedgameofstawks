import React from 'react';
import ReactDom from 'react-dom';
import AppRouting from './routes.js';
import '../scss/style.scss';

const render = (App) => {
  ReactDom.render(<App/>, document.getElementById('main'));
}

render(AppRouting);

