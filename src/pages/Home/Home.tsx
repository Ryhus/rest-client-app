import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { type UserMetaData } from '@/services/supabase';

import './HomeStyles.scss';

export default function Home() {
  const session = useAuthStore((s) => s.session);
  const userData = session?.user.user_metadata as UserMetaData | null;

  return (
    <main className="home">
      {!session ? (
        <>
          <h1 className="home__tittle">Welcome!</h1>
          <nav className="home__nav">
            <Link to="login" className="home__link">
              Sign in
            </Link>
            <Link to="signup" className="home__link">
              Sign up
            </Link>
          </nav>
        </>
      ) : (
        <>
          <h1 className="home__tittle">
            Welcome back, {userData?.name ?? 'Dear User'}!
          </h1>
          <nav className="home__nav">
            <Link to="/" className="home__link">
              REST Client
            </Link>
            <Link to="/" className="home__link">
              History
            </Link>
            <Link to="/" className="home__link">
              Variables
            </Link>
          </nav>
        </>
      )}
    </main>
  );
}
