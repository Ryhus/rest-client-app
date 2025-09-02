import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/services/supabase/supaBaseClient';

import { SignInForm } from '@/components';

import './SignInStyles.scss';

export async function clientAction({ request }: { request: Request }) {
  const formData = await request.formData();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const user = await supabase.auth.signInWithPassword({ email, password });

  return user;
}

export default function SignIn() {
  const session = useAuthStore((s) => s.session);

  const navigate = useNavigate();

  useEffect(() => {
    if (session) navigate('/');
  });

  return (
    <div className="signup-page">
      <h2>Login</h2>
      <SignInForm />
    </div>
  );
}
