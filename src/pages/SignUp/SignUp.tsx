import { SignUpForm } from '@/components';

import { supabase } from '@/services/supabase/supaBaseClient';

import './SignUpStyles.scss';

export default function SignUp() {
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

  return user;
}
