import React from 'react'
import { Route, IndexRoute } from 'react-router'
import IndexPage from './components/IndexPage';
import Layout from './components/Layout';
import SignUpPage from './components/SignUpPage';
import LoginPage from './components/LoginPage';
import NotFoundPage from './components/NotFoundPage';

const routes = (
  <Route path="/" component={Layout}>
    <IndexRoute component={IndexPage} />
    <Route path="signup" component={SignUpPage} />
    <Route path="login" component={LoginPage} />
    <Route path="*" component={NotFoundPage} />
  </Route>
);

export default routes;
