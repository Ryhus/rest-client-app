import { useState } from 'react';
import { Navigate } from 'react-router-dom';

import { DynamicForm } from '@/components';
import { supabase } from '@/services/supabase';
import { useAuthStore } from '@/stores/authStore';

import './SignInStyles.scss';

export async function clientAction({ request }: { request: Request }) {
  const formData = await request.formData();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const user = await supabase.auth.signInWithPassword({ email, password });

  return user;
}

export default function SignIn() {
  const { session } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (session) return <Navigate to="/" replace />;

  const loginFields = [
    {
      id: 'email',
      name: 'email',
      labelText: 'Email',
      value: email,
      onChange: setEmail,
    },
    {
      id: 'password',
      name: 'password',
      labelText: 'Password',
      value: password,
      onChange: setPassword,
    },
  ];

  return (
    <div className="signup-page">
      <h2>Login</h2>
      <DynamicForm fields={loginFields} submitLabel="Login"></DynamicForm>
    </div>
  );
}
