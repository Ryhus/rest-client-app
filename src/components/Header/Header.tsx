import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore/authStore';
import { supabase } from '@/services/supabase';

import './HeaderStyles.scss';

export default function Header() {
  const session = useAuthStore((s) => s.session);

  return (
    <header className="header">
      <Link to="/" className="header__logo">
        Rest Client
      </Link>

      <div className="header__actions">
        {session ? (
          <>
            <Link to="/" className="header__button">
              Home
            </Link>
            <button
              className="header__button header__button--signout"
              onClick={() => supabase.auth.signOut()}
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="header__button header__button--signin">
              Sign In
            </Link>
            <Link to="/signup" className="header__button header__button--signup">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
