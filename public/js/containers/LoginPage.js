import React, { PropTypes } from 'react';
import Auth from '../modules/Auth';
import SignIn from '../components/SignIn';
import Dashboard from './DashboardPage';
import dataSource from '../services/dataSource';


class LoginPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    const storedMessage = localStorage.getItem('successMessage');
    let successMessage = '';

    if (storedMessage) {
      successMessage = storedMessage;
      localStorage.removeItem('successMessage');
    }

    this.state = {
      errors: {},
      successMessage,
      user: {
        email: '',
        password: ''
      },
      dbData: null
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  async processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    // create a string for an HTTP body message
    const email = encodeURIComponent(this.state.user.email);
    const password = encodeURIComponent(this.state.user.password);
    const formData = `email=${email}&password=${password}`;

    try {
      const response = await dataSource.authorizeUser(formData);
      Auth.authenticateUser(response.token);
      this.setState({
        dbData: response.data.local
      });

    } catch(err) {
      console.log(err)
      const errors = (typeof err === "object") ? err : {};
      errors.summary = "Something bad happened"
      this.setState({
        errors
      });

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

  render() {
    return (
      <React.Fragment>
        {this.state.dbData ? (
          <Dashboard info={this.state.dbData}/>
        ) : (
          <SignIn
          onSubmit={this.processForm}
          onChange={this.changeUser}
          errors={this.state.errors}
          successMessage={this.state.successMessage}
          user={this.state.user}
        />
        )}
      </React.Fragment>
    );
  }

}

export default LoginPage;
