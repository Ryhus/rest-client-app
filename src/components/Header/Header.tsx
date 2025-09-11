import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore/authStore';
import { supabase } from '@/services/supabase';
import logo from '@/assets/img/logo.svg';
import { useEffect, useState } from 'react';
import { userLinks } from '@/utils/navLinksConfig';

import './HeaderStyles.scss';

export default function Header() {
  const session = useAuthStore((s) => s.session);
  const loading = useAuthStore((s) => s.loading);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerClass = isScrolled ? 'header scrolled' : 'header';

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={headerClass}>
      <nav className="navbar">
        <Link to="/rest-client" className="navbar__link">
          <img className="app-logo" src={logo} alt="Rest client app logo" />
        </Link>

        {!loading && (
          <div className="navbar__actions">
            {session ? (
              <>
                <div className="navbar__actions--expanded-group">
                  {userLinks.map((link) => (
                    <Link key={link.text} to={link.to} className="navbar__link">
                      {link.text}
                    </Link>
                  ))}
                  <Link to="/" className="navbar__link">
                    Home
                  </Link>
                </div>
                <div className="navbar__actions--basic-group">
                  <button className="button secondary" onClick={() => supabase.auth.signOut()}>
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="navbar__actions--basic-group">
                <Link to="/login" className="button secondary">
                  Sign In
                </Link>
                <Link to="/signup" className="button secondary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
