import React, { useState } from 'react';
import {withRouter} from 'react-router-dom';
import SignUpForm from '../components/SignUpForm.js';
import dataSource from '../services/dataSource';
import Auth from '../modules/Auth';
import {useChangeUser} from '../services/utils'


function SignUpPage(props) {

  const [errors, setErrors] = useState({});
  const [user, setUserState] = useChangeUser({email: '', name: '',  password: ''});

  async function processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    // create a string for an HTTP body message
    const name = encodeURIComponent(user.name);
    const email = encodeURIComponent(user.email);
    const password = encodeURIComponent(user.password);

    const formData = `name=${name}&email=${email}&password=${password}`;

    try {
      const response = await dataSource.createUser(formData);
      if (response.success) {
        Auth.authenticateUser(response.token);
        props.history.push("/profile"+props.history.location.search);
      } else {
        console.warn(response);
        const errors = (typeof err === "object") ? err : {};
        errors.summary = response.message || "Something bad happened";
        setErrors(errors);
      }
    } catch (err) {
      console.warn(err);
      const errors = (typeof err === "object") ? err : {};
      errors.summary = "Something bad happened"
      setErrors(errors);
    }

  }
  return (
    <SignUpForm
    onSubmit={processForm}
    onChange={setUserState}
    errors={errors}
    user={user}
    /> 
  )
}

export default withRouter(SignUpPage);
