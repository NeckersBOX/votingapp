import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Layout from './components/Layout';
import IndexPage from './components/IndexPage';
import PullPage from './components/PullPage';
import NotFoundPage from './components/NotFoundPage';

const routes = (
  <Route path="/" component={Layout}>
    <IndexRoute component={IndexPage}/>
    <Route path="pull/:name" component={PullPage}/>
    <Route path="*" component={NotFoundPage}/>
  </Route>
);

export default routes;
