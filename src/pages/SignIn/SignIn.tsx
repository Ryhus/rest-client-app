import { useState } from 'react';
import { Navigate, useActionData, Form } from 'react-router-dom';

import { Input } from '@/components';
import { supabase } from '@/services/supabase';
import { useAuthStore } from '@/stores/authStore/authStore';
import { Button } from '@/components';
import { ButtonStyle, ButtonType } from '@/components/Button/types';
import type { AuthErrors } from '@/utils/schema';
import { validateInput, type InputName } from '@/utils/validateInput';

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

interface SignInData {
  email: string;
  password: string;
}

export default function SignIn() {
  const { session } = useAuthStore();
  const [formData, setFormData] = useState<SignInData>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<AuthErrors>({
    name: [{ id: 0, message: '' }],
    email: [{ id: 0, message: '' }],
    password: [{ id: 0, message: '' }],
    isError: false,
  });

  const actionData = useActionData() as { error?: string };

  if (session) return <Navigate to="/" replace />;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const key = name as InputName;
    setFormData((prev) => ({ ...prev, [key]: value }));
    validateInput({ key, value, setErrors });
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
          value={formData.email}
          onChange={handleChange}
          errors={errors.email}
        />
        <Input
          type={showPassword ? 'text' : 'password'}
          id="password"
          labelText="Password"
          name="password"
          value={formData.password}
          rightIcon={
            <div className="toggler" onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? (
                <img src={eyeHide} alt="eye hide" />
              ) : (
                <img src={eyeShow} alt="eye show" />
              )}
            </div>
          }
          onChange={handleChange}
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
