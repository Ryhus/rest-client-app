import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('history');
  const requestsId = useId();
  const dateLabelId = useId();
  const analyticsTitleId = useId();

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
    <li className="closed-list-container">
      <button
        type="button"
        className="button-reset date-list-tittle"
        onClick={() => setIsOpened((prev) => !prev)}
        aria-expanded={isOpened}
        aria-controls={requestsId}
        id={dateLabelId}
      >
        <img
          src={chevronRight}
          alt=""
          aria-hidden="true"
          className={isOpened ? `list-icon--opened-list` : `list-icon--closed-list`}
        />
        <span>{date}</span>
      </button>
      {isOpened && (
        <ul className="opened-list-container" id={requestsId} aria-labelledby={dateLabelId}>
          {rows.map((historyRow) => (
            <li className="request-row" key={historyRow.id}>
              <span className={`method method--${historyRow.request_method}`}>
                {historyRow.request_method}
              </span>
              <Link
                className="url-link"
                to={restoreUrl(historyRow)}
                aria-label={t('openRequest', {
                  method: historyRow.request_method,
                  endpoint: historyRow.endpoint,
                })}
              >
                {historyRow.endpoint}
              </Link>
              <RowActions aria-label={t('rowActions', { endpoint: historyRow.endpoint })}>
                <button
                  type="button"
                  data-testid="open request info"
                  className="button-reset icon-container"
                  onClick={() => {
                    setOpenRowId(historyRow.id);
                  }}
                  title={t('openAnalytics')}
                  aria-label={t('openAnalyticsFor', { endpoint: historyRow.endpoint })}
                >
                  <IconThreeDots aria-hidden="true" focusable="false" />
                </button>
                <button
                  type="button"
                  data-testid="delete request info"
                  className="button-reset icon-container"
                  onClick={() => {
                    setOpenRowId(historyRow.id);
                  }}
                  title={t('deleteRequest')}
                  aria-label={t('deleteRequestFrom', { endpoint: historyRow.endpoint })}
                >
                  <IconTrash aria-hidden="true" focusable="false" />
                </button>
              </RowActions>

              {openRowId === historyRow.id && (
                <Modal closeModal={handleCloseModal} ariaLabelledBy={analyticsTitleId}>
                  <AnalyticsCard
                    closeModal={handleCloseModal}
                    row={historyRow}
                    titleId={analyticsTitleId}
                  />
                </Modal>
              )}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
