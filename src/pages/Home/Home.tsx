import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

import './HomeStyles.scss';

export default function Home() {
  const session = useAuthStore((s) => s.session);

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
            Welcome back, {session.user.user_metadata.name}!
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
