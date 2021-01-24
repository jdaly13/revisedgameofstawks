import React from 'react';
import { Link } from 'react-router-dom';
import TextField, {HelperText, Input} from '@material/react-text-field';


const SignUpForm = ({
  onSubmit,
  onChange,
  errors,
  user,
}) => (
  <section className="container signin">
    <form action="/" onSubmit={onSubmit}>
      <h2 className="card-heading">Sign Up</h2>

      {errors.summary && <p className="error-message">{errors.summary}</p>}

      <div className="field-line">
        <TextField
          label='Name'
          helperText={<HelperText>First and Last</HelperText>}
        ><Input
           name="name"
           id="name"
           value={user.name}
           onChange={onChange} />
        </TextField>
      </div>

      <div className="field-line">
        <TextField
          label='Email'
          helperText={<HelperText></HelperText>}
        ><Input
           name="email"
           id="email"
           value={user.email}
           onChange={onChange} />
        </TextField>
      </div>

      <div className="field-line">
        <TextField
          label='Password'
          helperText={<HelperText>Minimum eight characters</HelperText>}
        ><Input
           value={user.password}
           name="password"
           id="password"
           onChange={onChange}
           type="password" />
        </TextField>
      </div>

      <div className="button-line">
        <input type="submit" label="Create New Account"  />
      </div>

      <div>Already have an account? <Link to={'/login'}>Log in</Link></div>
    </form>
  </section>
);


export default SignUpForm;
