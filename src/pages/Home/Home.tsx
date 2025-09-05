import { Link } from 'react-router-dom';

import { useAuthStore } from '@/stores/authStore/authStore';
import { type UserMetaData } from '@/services/supabase';
import { userLinks, guestLinks } from '@/utils/navLinksConfig';

import './HomeStyles.scss';

export default function Home() {
  const session = useAuthStore((s) => s.session);
  const userData = session?.user.user_metadata as UserMetaData | null;

  const links = session ? userLinks : guestLinks;

  return (
    <main className="home">
      <h1 className="home__tittle">
        {session
          ? `Welcome back, ${userData?.name ?? 'Dear User'}!`
          : 'Welcome!'}
      </h1>

      <nav className="home__nav">
        {links.map((link) => (
          <Link key={link.text} to={link.to} className="home__link">
            {link.text}
          </Link>
        ))}
      </nav>
    </main>
  );
}
