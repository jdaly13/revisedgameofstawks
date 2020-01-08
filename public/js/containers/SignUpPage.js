import React from 'react';
import {withRouter} from 'react-router-dom';
import SignUpForm from '../components/SignUpForm.js';
import dataSource from '../services/dataSource';
import Auth from '../modules/Auth';


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
    this.changeUser = this.changeUser.bind(this);
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
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user
    });
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
