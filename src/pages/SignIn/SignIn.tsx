import { useState } from 'react';
import { Navigate, useActionData, Form } from 'react-router-dom';

import { Input } from '@/components';
import { supabase } from '@/services/supabase';
import { useAuthStore } from '@/stores/authStore/authStore';
import { Button } from '@/components';
import { ButtonStyle, ButtonType } from '@/components/Button/types';
import { authFormSchema, type AuthErrors } from '@/utils/schema';
import { ValidationError } from 'yup';

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
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<AuthErrors>({
    name: [{ id: 0, message: '' }],
    email: [{ id: 0, message: '' }],
    password: [{ id: 0, message: '' }],
    isError: false,
  });

  const actionData = useActionData() as { error?: string };

  if (session) return <Navigate to="/" replace />;

  const validateInput = async (key: 'email' | 'name' | 'password', value: string) => {
    try {
      await authFormSchema.validateAt(key, { [key]: value });
      setErrors((prev) => ({ ...prev, [key]: [{ id: 0, message: '' }], isError: false }));
    } catch (error) {
      if (error instanceof ValidationError) {
        setErrors((prev) => ({
          ...prev,
          [key]: [{ id: 0, message: error.message }],
          isError: true,
        }));
      }
    }
  };

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
          onChange={(e) => {
            setEmail(e.target.value);
            validateInput('email', e.target.value);
          }}
          errors={errors.email}
        />
        <Input
          type={showPassword ? 'text' : 'password'}
          id="password"
          labelText="Password"
          name="password"
          value={password}
          rightIcon={
            <div className="toggler" onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? (
                <img src={eyeHide} alt="eye hide" />
              ) : (
                <img src={eyeShow} alt="eye show" />
              )}
            </div>
          }
          onChange={(e) => {
            setPassword(e.target.value);
            validateInput('password', e.target.value);
          }}
          errors={errors.password}
        />
        {actionData && <p className="signin-page__server-error">{actionData.error}</p>}
        <Button
          style={ButtonStyle.Primary}
          type={ButtonType.Submit}
          customClass="signin-page__form-button"
          isDisabled={errors.isError}
        >
          Login
        </Button>
      </Form>
    </div>
  );
}
