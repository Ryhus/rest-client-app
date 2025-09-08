import { useState } from 'react';
import { Navigate, useActionData, Form } from 'react-router-dom';

import { Input } from '@/components';
import { supabase } from '@/services/supabase';
import { useAuthStore } from '@/stores/authStore/authStore';
import { Button } from '@/components';
import { ButtonStyle, ButtonType } from '@/components/Button/types';

import eyeHide from '@/assets/img/eyeHide.svg';
import eyeShow from '@/assets/img/eyeShow.svg';

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
      error: error.message === 'Failed to fetch' ? 'Pls, check your internet connection.' : error.message,
    };
  }

  return { data };
}

export default function SignIn() {
  const { session } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const actionData = useActionData() as { error?: string };

  if (session) return <Navigate to="/" replace />;

  return (
    <div className="signin-page">
      <h2 className="signin-page__title">Login</h2>
      <Form className="signin-page__form" method="post">
        <Input
          type="text"
          id="email"
          labelText="Email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></Input>
        <Input
          type={showPassword ? 'text' : 'password'}
          id="password"
          labelText="Password"
          name="password"
          value={password}
          rightIcon={
            <div className="toggler" onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? <img src={eyeHide} alt="eye hide" /> : <img src={eyeShow} alt="eye show" />}
            </div>
          }
          onChange={(e) => setPassword(e.target.value)}
        ></Input>
        {actionData && <p className="form__server-error">{actionData.error}</p>}
        <Button style={ButtonStyle.Primary} type={ButtonType.Submit} customClass="signin-page__form-button">
          Login
        </Button>
      </Form>
    </div>
  );
}
