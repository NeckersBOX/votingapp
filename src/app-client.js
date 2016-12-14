import React from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import { applyRouterMiddleware, Router, browserHistory } from 'react-router';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import voteReducer from './store';
import routes from './routes';

injectTapEventPlugin ();

let voteStore = createStore (voteReducer);

const AppRouter = React.createClass ({
  render () {
    const useExtraProps = {
      renderRouteComponent: child => React.cloneElement (child, {
        state: this.props.state,
        dispatch: this.props.dispatch
      })
    };

    return (
      <Router
        history={browserHistory}
        routes={routes}
        onUpdate={() => window.scrollTo (0, 0)}
        render={applyRouterMiddleware (useExtraProps)}
        />
    );
  }
});

const RouterConnect = connect ((state) => ({ state: state }))(AppRouter);

window.onload = () => {
  ReactDOM.render (
    <MuiThemeProvider muiTheme={getMuiTheme()}>
      <Provider store={voteStore}>
        <RouterConnect />
      </Provider>
    </MuiThemeProvider>, document.getElementById ('container'));
};
