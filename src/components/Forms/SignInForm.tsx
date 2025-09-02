import { useState } from 'react';

import { Form } from 'react-router-dom';
import FormInput from './FormInput/FormInput';

import './FormStyles.scss';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Form className="form" method="post">
      <FormInput
        id="email"
        name="email"
        labelText="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      ></FormInput>
      <FormInput
        id="password"
        name="password"
        labelText="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      ></FormInput>
      <button type="submit" className="submit-form-bttn">
        Submit
      </button>
    </Form>
  );
}
