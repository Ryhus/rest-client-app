import { Link, useRouteLoaderData, Form } from 'react-router-dom';
import logo from '@/assets/img/logo.svg';
import { useEffect, useState } from 'react';
import { userLinks } from '@/utils/navLinksConfig';
import { type User } from '@supabase/supabase-js';
import './HeaderStyles.scss';

export default function Header() {
  const user = useRouteLoaderData<User>('root');
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

        <div className="navbar__actions">
          {user ? (
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
                <Form method="post" action="/logout">
                  <button className="button secondary">Sign Out</button>
                </Form>
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
      </nav>
    </header>
  );
}
