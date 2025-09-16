import { useLoaderData, redirect, type LoaderFunctionArgs } from 'react-router-dom';
import { createClient } from '@/services/supabase/supabaseServer';
import { formatDate } from '@/utils/datesUtils';
import { type HistoryRow } from '@/types/types';
import HistoryDate from '@/components/HistoryDate/HistoryDate';

import './HistoryStyles.scss';

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase } = createClient(request);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) return redirect('/');

  const { data } = await supabase
    .from('history')
    .select('*')
    .eq('user_id', user.id)
    .order('request_timestamp', { ascending: false });

  return data;
}

export default function HistoryPage() {
  const data = useLoaderData<HistoryRow[]>();

  const rowsByDate = data.reduce((acc: Record<string, HistoryRow[]>, row) => {
    const date = formatDate(row.request_timestamp);
    if (!date) return acc;

    if (!acc[date]) acc[date] = [];
    acc[date].push(row);
    return acc;
  }, {});

  return (
    <ul className="history-list">
      {Object.entries(rowsByDate).map(([date, rows]) => (
        <HistoryDate key={date} date={date} rows={rows} />
      ))}
    </ul>
  );
}
