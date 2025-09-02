import { useEffect } from 'react';
import { SignUpForm } from '@/components';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/services/supabase/supaBaseClient';

import './SignUpStyles.scss';

export default function SignUp() {
  const session = useAuthStore((s) => s.session);
  const navigate = useNavigate();

  useEffect(() => {
    if (session) navigate('/');
  });

  return (
    <div className="signup-page">
      <h2>Create Account</h2>
      <SignUpForm />
    </div>
  );
}

export async function clientAction({ request }: { request: Request }) {
  const formData = await request.formData();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const user = await supabase.auth.signUp({ email, password });
  console.log(user);
  return user;
}
