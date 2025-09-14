import { useRouteLoaderData } from 'react-router-dom';
import { type User } from '@supabase/supabase-js';

import './HomeStyles.scss';

export default function Home() {
  const user = useRouteLoaderData<User>('root');

  return (
    <div className="home">
      <h1 className="home__tittle">
        {user ? `Welcome back, ${user.user_metadata?.name ?? 'Dear User'}!` : 'Welcome!'}
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
