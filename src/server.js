import { Server } from 'http';
import Express from 'express';
import React from 'react';
import path from 'path';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import SocketIO from 'socket.io';

import socketHandle from './socket_handle';
import routes from './routes';
import NotFoundPage from './components/NotFoundPage';

const app = new Express ();
const server = new Server (app);

socketHandle (SocketIO (server));
injectTapEventPlugin ();

app.set ('view engine', 'ejs');
app.set ('views', path.join (__dirname, 'views'));

app.use (Express.static ('dist'));

app.get('*', (req, res) => {
  match ({ routes, location: req.url },
    (err, redirectLocation, renderProps) => {
      if (err) {
        return res.status (500).send (err.message);
      }

      if (redirectLocation) {
        return res.redirect (302, redirectLocation.pathname + redirectLocation.search);
      }

      let markup;
      const muiTheme = getMuiTheme ({userAgent: req.headers['user-agent']});

      if (renderProps) {
        markup = renderToString (
          <MuiThemeProvider muiTheme={muiTheme}>
            <RouterContext {...renderProps} />
          </MuiThemeProvider>
        );
      }
      else {
        markup = renderToString (
          <MuiThemeProvider muiTheme={muiTheme}>
            <NotFoundPage />
          </MuiThemeProvider>
        );

        res.status (404);
      }

      return res.render ('index', { markup });
    }
  );
});

server.listen (process.env.PORT || 3000, err => {
  if ( err ) return console.error (err);
  console.log ('Server running.');
});
