import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Auth from './modules/Auth.js';
//import HomePage from './containers/Home';
import DashboardPage from './containers/DashboardPage';
import SignUpPage from './containers/SignUpPage';
import LoginPage from './containers/LoginPage';


const AppRouting = ()  => {
  return (
      <Router >
      <Switch>
          <Route path="/" exact render={(props) => {
              if (Auth.isUserAuthenticated()) {
                return <DashboardPage {...props} />
              } else {
                return <LoginPage {...props} />
              }
          }} />
          <Route path="/profile" exact render={(props) => {
              return <DashboardPage {...props} />
          }} />
          <Route path="/signup" exact render={(props) => {
              return <SignUpPage {...props} />
          }} />
          <Route path="/logout" exact render={(props) => {
              Auth.deauthenticateUser();
              return (
                //<LoginPage {...props} />
                <Redirect to="/" />
              );
          }} />
          <Redirect to="/" />
      </Switch>
  </Router>

  )
}

//export default AppRouting;
export default AppRouting;
