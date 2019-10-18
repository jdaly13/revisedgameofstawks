import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Auth from './modules/Auth.js';
import HomePage from './containers/Home';
import DashboardPage from './containers/DashboardPage';
import SignUpPage from './containers/SignUpPage';


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
              return (
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
