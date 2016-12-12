import React from 'react';
import { Router, browserHistory } from 'react-router';
import routes from '../routes';

export default React.createClass ({
  render () {
    return (
      <Router history={browserHistory} routes={routes} onUpade={() => window.scrollto (0, 0)} />
    );
  }
});
