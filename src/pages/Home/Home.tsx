import { useRouteLoaderData } from 'react-router-dom';
import { type User } from '@supabase/supabase-js';
import { Card } from '@/components';
import { team } from '@/utils/team';

import './HomeStyles.scss';

export default function Home() {
  const user = useRouteLoaderData<User>('root');

  return (
    <div className="home">
      <h1 className="home__tittle">
        {user ? `Welcome back, ${user.user_metadata?.name ?? 'Dear User'}!` : 'Welcome!'}
      </h1>
      <section className="home__about">
        <p>
          Rest Client app is a modern API testing and collaboration tool designed to make working
          with REST APIs faster and easier. You can send requests, inspect responses and keep your
          history in one place. Whether you’re debugging, exploring, or documenting an API, our app
          helps you do it efficiently.
        </p>
        <p>
          Rest Client app is created as a final task of
          <a
            className="link"
            href="https://rs.school/courses/reactjs"
            target="_blank"
            rel="noopener noreferrer"
          >
            RS School React 2025 Q3 course.
          </a>
        </p>
      </section>
      <section className="home__team-info">
        {team.map((person) => (
          <Card key={person.id} {...person} />
        ))}
      </section>
    </div>
  );
}
