import React, { PropTypes } from 'react';
import Auth from '../modules/Auth';
import SignIn from '../components/SignIn';
import Dashboard from './DashboardPage';
import dataSource from '../services/dataSource';


class LoginPage extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props, context) {
    super(props, context);

    const storedMessage = localStorage.getItem('successMessage');
    let successMessage = '';

    if (storedMessage) {
      successMessage = storedMessage;
      localStorage.removeItem('successMessage');
    }

    // set the initial component state
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

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  async processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    // create a string for an HTTP body message
    const email = encodeURIComponent(this.state.user.email);
    const password = encodeURIComponent(this.state.user.password);
    const formData = `email=${email}&password=${password}`;
    console.log(formData)
    try {
      const response = await dataSource.authorizeUser(formData);
      console.log(response);
      this.setState({
        dbData: response.data.local
      });
      Auth.authenticateUser(xhr.response.token);
    } catch(err) {
      console.log(err)
      const errors = (typeof err === "object") ? err : {};
      errors.summary = "Something bad happened"
      this.setState({
        errors
      });

    }

    // create an AJAX request
    /*
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/auth/login');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success

        // change the component-container state
        this.setState({
          errors: {},
					data: xhr.response.data.local
        });

        // save the token
        Auth.authenticateUser(xhr.response.token);

				console.log(xhr.response.data.local);
        // change the current URL to /
        console.log(this.context, 'context');
        this.context.router.replace('/');

      } else {
        // failure

        // change the component state
        const errors = xhr.response.errors ? xhr.response.errors : {};
        errors.summary = xhr.response.message;

        this.setState({
          errors
        });
      }
    });
    xhr.send(formData);
    */
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
