import React from 'react'
import { Route, IndexRoute } from 'react-router'
import IndexPage from './components/IndexPage';
import Layout from './components/Layout';
import SignUpPage from './components/SignUpPage';
import LoginPage from './components/LoginPage';
import LogoutPage from './components/LogoutPage';
import NotFoundPage from './components/NotFoundPage';
import AddPollPage from './components/AddPollPage';
import MyPollPage from './components/MyPollPage';
import PollPage from './components/PollPage';

const routes = (
  <Route path="/" component={Layout}>
    <IndexRoute component={IndexPage} />
    <Route path="signup" component={SignUpPage} />
    <Route path="login" component={LoginPage} />
    <Route path="logout" component={LogoutPage} />
    <Route path="add-poll" component={AddPollPage} />
    <Route path="my-poll" component={MyPollPage} />
    <Route path="poll/:id" component={PollPage} />
    <Route path="*" component={NotFoundPage} />
  </Route>
);

export default routes;
