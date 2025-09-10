import { useState } from 'react';
import { Navigate, Form, useActionData } from 'react-router-dom';
import { Input } from '@/components';
import { useAuthStore } from '@/stores/authStore/authStore';
import { supabase } from '@/services/supabase';
import { Button } from '@/components';
import { ButtonStyle, ButtonType } from '@/components/Button/types';
import type { AuthErrors } from '@/utils/schema';
import { validateInput, type InputName } from '@/utils/validateInput';

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

interface SignUpData {
  email: string;
  name: string;
  password: string;
}

export default function SignUp() {
  const { session } = useAuthStore();
  const [formData, setFormData] = useState<SignUpData>({
    email: '',
    name: '',
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
    validateInput({ key: key, value: value, setErrors: setErrors });
  };

  return (
    <div className="signup-page">
      <h2 className="signup-page__title">Create Account</h2>
      <Form className="signup-page__form" method="post">
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
          type="text"
          id="name"
          labelText="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          errors={errors.name}
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
        {actionData && <p className="signup-page__server-error">{actionData.error}</p>}
        <Button
          style={ButtonStyle.Primary}
          type={ButtonType.Submit}
          customClass="signup-page__form-button"
          isDisabled={errors.isError}
        >
          Sign Up
        </Button>
      </Form>
    </div>
  );
}
