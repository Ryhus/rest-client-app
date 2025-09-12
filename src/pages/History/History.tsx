import { useRouteLoaderData, Navigate } from 'react-router-dom';
import { type User } from '@supabase/supabase-js';

import './HistoryStyles.scss';

export default function HistoryPage() {
  const user = useRouteLoaderData<User>('root');

  if (!user) return <Navigate to="/" replace />;

  return <div>History page</div>;
}
