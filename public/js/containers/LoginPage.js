import React, { useState } from 'react';
import {withRouter} from 'react-router-dom';
import Auth from '../modules/Auth';
import SignIn from '../components/SignIn';
import dataSource from '../services/dataSource';
import {useChangeUser} from '../services/utils'


function LoginPage(props) {
  const [errors, setErrors] = useState({});
  const [user, setUserState] = useChangeUser({email: '',  password: ''});
  async function processForm (event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    // create a string for an HTTP body message
    const email = encodeURIComponent(user.email);
    const password = encodeURIComponent(user.password);
    const formData = `email=${email}&password=${password}`;

    try {
      const response = await dataSource.authorizeUser(formData);
      if (response.success) {
        Auth.authenticateUser(response.token);
        /* TO DO Render out Dashboard page here and instead of using router */
        props.history.push("/profile"+props.history.location.search, response.data.local)
     } else {
      console.warn(response);
      const errors = (typeof err === "object") ? err : {};
      errors.summary = response.message || "Something bad happened";
      setErrors(errors);
     }
    } catch(err) {
      console.warn(err);
      const errors = (typeof err === "object") ? err : {};
      errors.summary = "Something bad happened"
      setErrors(errors);

    }

  }
  return (
    <SignIn
    onSubmit={processForm}
    onChange={setUserState}
    errors={errors}
    user={user}
  />
  )
}

export default withRouter(LoginPage);
