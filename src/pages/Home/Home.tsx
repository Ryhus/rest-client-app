import { useAuthStore } from '@/stores/authStore/authStore';
import { type UserMetaData } from '@/services/supabase';

import './HomeStyles.scss';

export default function Home() {
  const session = useAuthStore((s) => s.session);
  const userData = session?.user.user_metadata as UserMetaData | null;

  return (
    <div className="home">
      <h1 className="home__tittle">
        {session ? `Welcome back, ${userData?.name ?? 'Dear User'}!` : 'Welcome!'}
      </h1>
      <p className="home__about">
        Our app is a modern API testing and collaboration tool designed to make working with REST
        APIs faster and easier. <br />
        You can send requests, inspect responses and keep your history in one place. <br />
        Whether you’re debugging, exploring, or documenting an API, our app helps you do it
        efficiently.
      </p>
    </div>
  );
}
