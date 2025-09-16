import { useLoaderData, redirect, Link, type LoaderFunctionArgs } from 'react-router-dom';
import { useState } from 'react';
import { createClient } from '@/services/supabase/supabaseServer';
import { formatDate } from '@/utils/datesUtils';
import { type Database } from '@/types/database.types';

import './HistoryStyles.scss';

import chevronRight from '@/assets/icons/chevron-right.svg';
import threeDots from '@/assets/icons/three-dots.svg';

type HistoryRow = Database['public']['Tables']['history']['Row'];

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase } = createClient(request);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) return redirect('/');

  const { data } = await supabase.from('history').select('*').eq('user_id', user.id);

  return data;
}

export default function HistoryPage() {
  const data = useLoaderData<HistoryRow[]>();
  const [isOpenedList, setOpenList] = useState(false);

  const uniqueDates = [
    ...new Set(
      data.map((historyRow) => {
        return formatDate(historyRow.request_timestamp);
      })
    ),
  ];

  const dateList = uniqueDates.map((date) => {
    if (date) {
      return (
        <li key={date.toString()} onClick={() => setOpenList((prev) => !prev)}>
          <div className="closed-list-container">
            <img
              src={chevronRight}
              alt="chevron right"
              className={isOpenedList ? `list-icon--opened-list` : `list-icon--closed-list`}
            />
            {date}
          </div>

          {isOpenedList && (
            <ul className="opened-list-container">
              {data.map((historyRow) => {
                const formatedDate = formatDate(historyRow.request_timestamp);

                if (formatedDate === date)
                  return (
                    <li className="request-row" key={historyRow.id}>
                      <span className={`method method--${historyRow.request_method}`}>
                        {historyRow.request_method}
                      </span>
                      <Link className="url-link" to="/rest-client">
                        {historyRow.endpoint}
                      </Link>

                      <img src={threeDots} alt="open request info"></img>
                    </li>
                  );
              })}
            </ul>
          )}
        </li>
      );
    }
  });

  return <ul className="history-list">{dateList}</ul>;
}
