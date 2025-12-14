import { useState } from 'react';
import { Link } from 'react-router-dom';
import { type HistoryRow } from '@/types/types';
import { Modal, AnalyticsCard, RowActions } from '@/components';
import IconThreeDots from '@/assets/icons/three-dots.svg?react';
import IconTrash from '@/assets/icons/trash.svg?react';
import { toBase64 } from '@/utils/encoding';
import chevronRight from '@/assets/icons/chevron-right.svg';

import './HistoryDateStyles.scss';

interface HistoryDateProps {
  date: string;
  rows: HistoryRow[];
}

export default function HistoryDate({ date, rows }: HistoryDateProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [openRowId, setOpenRowId] = useState<number | null>(null);

  const handleCloseModal = () => {
    setOpenRowId(null);
  };

  function restoreUrl(historyRow: HistoryRow) {
    const { request_method, endpoint, headers, payload } = historyRow;

    if (!request_method || !endpoint) return '/rest-client';

    let url = `/rest-client/${request_method}/${toBase64(endpoint)}`;
    if (payload) url = url.concat('/', toBase64(payload));

    if (headers) {
      const requestHeaders = JSON.parse(headers) as string[][];
      const headersParams = new URLSearchParams(requestHeaders);
      url = url.concat(`?${headersParams}`);
    }

    return url;
  }

  return (
    <>
      <li className="closed-list-container" key={date.toString()}>
        <button
          className="button-reset date-list-tittle"
          onClick={() => setIsOpened((prev) => !prev)}
          aria-expanded={isOpened}
          aria-controls={`dailyRequests-${date}`}
        >
          <img
            src={chevronRight}
            alt="chevron right"
            className={isOpened ? `list-icon--opened-list` : `list-icon--closed-list`}
          />
          <span>{date}</span>
        </button>
        {isOpened && (
          <ul className="opened-list-container" id={`dailyRequests-${date}`}>
            {rows.map((historyRow) => (
              <li className="request-row" key={historyRow.id}>
                <span className={`method method--${historyRow.request_method}`}>
                  {historyRow.request_method}
                </span>
                <Link className="url-link" to={restoreUrl(historyRow)}>
                  {historyRow.endpoint}
                </Link>
                <RowActions>
                  <button
                    data-testid="open request info"
                    className="button-reset icon-container"
                    onClick={() => {
                      setOpenRowId(historyRow.id);
                    }}
                    title="Open analytics"
                    aria-label="Open request analitycs modal window"
                  >
                    <IconThreeDots />
                  </button>
                  <button
                    data-testid="delete request info"
                    className="button-reset icon-container"
                    onClick={() => {
                      setOpenRowId(historyRow.id);
                    }}
                    title="Delete request"
                    aria-label="Delete request from the history"
                  >
                    <IconTrash />
                  </button>
                </RowActions>

                {openRowId === historyRow.id && (
                  <Modal closeModal={handleCloseModal}>
                    <AnalyticsCard closeModal={handleCloseModal} row={historyRow} />
                  </Modal>
                )}
              </li>
            ))}
          </ul>
        )}
      </li>
    </>
  );
}
