import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Auth from './modules/Auth.js';
import DashboardPage from './containers/DashboardPage';
import SignUpPage from './containers/SignUpPage';
import LoginPage from './containers/LoginPage';


const AppRouting = ()  => {
  return (
      <Router>
      <Switch>
          <Route path="/profile" exact render={(props) => {
              return <DashboardPage {...props} />
          }} />
          <Route path="/signup" exact render={(props) => {
              return <SignUpPage {...props} />
          }} />
          <Route path="/logout" exact render={(props) => {
              Auth.deauthenticateUser();
              return (
                <Redirect to="/" />
              );
          }} />
          <Route exact path="/" render={(props) => {
              if (Auth.isUserAuthenticated()) {
                return <Redirect to="/profile" />
              } else {
                return <LoginPage {...props} />
              }
          }} />
          <Redirect to="/" /> 
      </Switch>
  </Router>

  )
}

export default AppRouting;
