import { useState } from 'react';
import { Navigate, Form, useActionData } from 'react-router-dom';
import { Input } from '@/components';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/services/supabase';

import eyeHide from '@/assets/img/eyeHide.svg';
import eyeShow from '@/assets/img/eyeShow.svg';

import './SignUpStyles.scss';

export async function clientAction({ request }: { request: Request }) {
  const formData = await request.formData();

  const email = formData.get('email') as string;
  const name = formData.get('name') as string;
  const password = formData.get('password') as string;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name: name } },
  });

  if (error) {
    return {
      error:
        error.message === 'Failed to fetch'
          ? 'Pls, check your internet connection.'
          : error.message,
    };
  }

  return { data };
}

export default function SignUp() {
  const { session } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const actionData = useActionData() as { error?: string };

  if (session) return <Navigate to="/" replace />;

  return (
    <div className="signup-page">
      <h2>Create Account</h2>
      <Form className="form" method="post">
        <Input
          type="text"
          id="email"
          labelText="Email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></Input>
        <Input
          type="text"
          id="name"
          labelText="Name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></Input>
        <Input
          type={showPassword ? 'text' : 'password'}
          id="password"
          labelText="Password"
          name="password"
          value={password}
          rightIcon={
            <button
              type="button"
              className="icon-button"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <img src={eyeHide} alt="eye hide" />
              ) : (
                <img src={eyeShow} alt="eye show" />
              )}
            </button>
          }
          onChange={(e) => setPassword(e.target.value)}
        ></Input>
        {actionData && <p className="form__server-error">{actionData.error}</p>}
        <button type="submit" className="form__submit-bttn">
          Sign Up
        </button>
      </Form>
    </div>
  );
}
