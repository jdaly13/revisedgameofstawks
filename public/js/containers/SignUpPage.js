import React from 'react';
import {withRouter} from 'react-router-dom';
import SignUpForm from '../components/SignUpForm.js';
import dataSource from '../services/dataSource';
import Auth from '../modules/Auth';
import {changeUser} from '../services/utils'


class SignUpPage extends React.Component {

  constructor(props) {
    super(props);

    // set the initial component state
    this.state = {
      errors: {},
      user: {
        email: '',
        name: '',
        password: ''
      },
      signUpSuccess: false
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = changeUser.bind(this);
  }

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  async processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    // create a string for an HTTP body message
    const name = encodeURIComponent(this.state.user.name);
    const email = encodeURIComponent(this.state.user.email);
    const password = encodeURIComponent(this.state.user.password);
    const formData = `name=${name}&email=${email}&password=${password}`;

    try {
      const response = await dataSource.createUser(formData);
      Auth.authenticateUser(response.token);
      this.props.history.push("/profile"+this.props.history.location.search)
    } catch (e) {
      console.log(e);
      const errors = e.errors ? e.errors : {};
    }

  }


  /**
   * Render the component.
   */
  render() {
    return (
        <SignUpForm
          onSubmit={this.processForm}
          onChange={this.changeUser}
          errors={this.state.errors}
          user={this.state.user}
          /> 
    );
  }

}

export default withRouter(SignUpPage);
