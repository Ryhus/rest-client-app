import { useState } from 'react';
import { Navigate, useActionData, Form } from 'react-router-dom';

import { Input } from '@/components';
import { supabase } from '@/services/supabase';
import { useAuthStore } from '@/stores/authStore';

import './SignInStyles.scss';

export async function clientAction({ request }: { request: Request }) {
  const formData = await request.formData();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
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

export default function SignIn() {
  const { session } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const actionData = useActionData() as { error?: string };

  if (session) return <Navigate to="/" replace />;

  return (
    <div className="signup-page">
      <h2>Login</h2>
      <Form className="form">
        <Input
          type="text"
          id="email"
          labelText="Email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></Input>
        <Input
          type="password"
          id="password"
          labelText="Password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></Input>
        {actionData && <p className="form__server-error">{actionData.error}</p>}
        <button type="submit" className="form__submit-bttn">
          Login
        </button>
      </Form>
    </div>
  );
}
