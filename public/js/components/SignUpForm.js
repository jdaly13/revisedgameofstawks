import React from 'react';
import { Link } from 'react-router-dom';
//import { Card, CardText } from 'material-ui/Card';
//import RaisedButton from 'material-ui/RaisedButton';
//import TextField from 'material-ui/TextField';


const SignUpForm = ({
  onSubmit,
  onChange,
  errors,
  user,
}) => (
  <section className="container">
    <form action="/" onSubmit={onSubmit}>
      <h2 className="card-heading">Sign Up</h2>

      {errors.summary && <p className="error-message">{errors.summary}</p>}

      <div className="field-line">
        <input
          floatingLabelText="Name"
          name="name"
          errorText={errors.name}
          onChange={onChange}
          value={user.name}
        />
      </div>

      <div className="field-line">
        <input
          floatingLabelText="Email"
          name="email"
          errorText={errors.email}
          onChange={onChange}
          value={user.email}
        />
      </div>

      <div className="field-line">
        <input
          floatingLabelText="Password"
          type="password"
          name="password"
          onChange={onChange}
          errorText={errors.password}
          value={user.password}
        />
      </div>

      <div className="button-line">
        <input type="submit" label="Create New Account"  />
      </div>

      <div>Already have an account? <Link to={'/login'}>Log in</Link></div>
    </form>
  </section>
);


export default SignUpForm;
