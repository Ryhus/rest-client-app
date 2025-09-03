import { useState } from 'react';
import { Navigate } from 'react-router-dom';

import { DynamicForm } from '@/components';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/services/supabase';

import './SignUpStyles.scss';

export async function clientAction({ request }: { request: Request }) {
  const formData = await request.formData();

  const email = formData.get('email') as string;
  const name = formData.get('name') as string;
  const password = formData.get('password') as string;

  const user = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name: name } },
  });
  console.log(user);
  return user;
}

export default function SignUp() {
  const { session } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (session) return <Navigate to="/" replace />;

  const signUpFields = [
    {
      id: 'email',
      name: 'email',
      labelText: 'Email',
      value: email,
      onChange: setEmail,
    },
    {
      id: 'name',
      name: 'name',
      labelText: 'Name',
      value: name,
      onChange: setName,
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
      <h2>Create Account</h2>
      <DynamicForm fields={signUpFields} submitLabel="Sign Up"></DynamicForm>
    </div>
  );
}
