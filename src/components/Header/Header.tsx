import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore/authStore';
import { supabase } from '@/services/supabase';
import logo from '@/assets/img/logo.svg';
import { useEffect, useRef, useState } from 'react';

import './HeaderStyles.scss';

export default function Header() {
  const session = useAuthStore((s) => s.session);
  const loading = useAuthStore((s) => s.loading);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerClass = isScrolled ? 'header scrolled' : 'header';
  const headerRef = useRef<HTMLElement>(null);

  const handleScroll = () => {
    if (headerRef.current && window.scrollY > headerRef.current.offsetHeight) {
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
    <header className={headerClass} ref={headerRef}>
      <Link to="/rest-client" className="header__link">
        <img className="header__logo" src={logo} alt="Rest client app logo" />
      </Link>

      {!loading && (
        <div className="header__actions">
          {session ? (
            <>
              <Link to="/" className="header__link button secondary">
                Home
              </Link>
              <button className="button primary" onClick={() => supabase.auth.signOut()}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="header__link button secondary">
                Sign In
              </Link>
              <Link to="/signup" className="header__link button secondary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
