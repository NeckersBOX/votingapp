import React from 'react';
import ReactDOM from 'react-dom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import io from 'socket.io-client';

import AppRoutes from './components/AppRoutes';

injectTapEventPlugin ();
const socket = io ();

window.onload = () => {
  ReactDOM.render (
    <MuiThemeProvider muiTheme={getMuiTheme()}>
      <AppRoutes />
    </MuiThemeProvider>, document.getElementById ('container'));
};
