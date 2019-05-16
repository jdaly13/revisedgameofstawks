//import Base from './components/Base.js';
//import HomePage from './components/HomePage.js';
//import DashboardPage from './containers/DashboardPage.js';
//import LoginPage from './containers/LoginPage.js';
//import SignUpPage from './containers/SignUpPage.js';
import Auth from './modules/Auth.js';
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import HomePage from './containers/Home';
import DashboardPage from './containers/DashboardPage';
import SignUpPage from './containers/SignUpPage';




/*
const routes = {
  // base component (wrapper for the whole application).
  component: Base,
  childRoutes: [

    {
      path: '/',
      getComponent: (location, callback) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, DashboardPage);
        } else {
          callback(null, HomePage);
        }
      }
    },

    {
      path: '/login',
      component: LoginPage
    },

    {
      path: '/signup',
      component: SignUpPage
    },

    {
      path: '/logout',
      onEnter: (nextState, replace) => {
        Auth.deauthenticateUser();

        // change the current URL to /
        replace('/');
      }
    }

  ]
};
*/

const AppRouting = ()  => {
  return (
      <Router >
      <Switch>
          <Route path="/" exact render={(props) => {
              return <HomePage {...props} />
          }} />
          <Route path="/profile" exact render={(props) => {
              return <DashboardPage {...props} />
          }} />
          <Route path="/signup" exact render={(props) => {
              return <SignUpPage {...props} />
          }} />
          <Route path="/logout" exact render={(props) => {
              Auth.deauthenticateUser();
              return <HomePage {...props} />
          }} />
          <Redirect to="/" />
      </Switch>
  </Router>

  )
}

export default AppRouting;
