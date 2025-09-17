import { useState } from 'react';
import { Link } from 'react-router-dom';
import { type HistoryRow } from '@/types/types';
import { Modal, AnalyticsCard } from '@/components/Modal';

import './HistoryDateStyles.scss';

import chevronRight from '@/assets/icons/chevron-right.svg';
import threeDots from '@/assets/icons/three-dots.svg';

interface HistoryDateProps {
  date: string;
  rows: HistoryRow[];
}

export default function HistoryDate({ date, rows }: HistoryDateProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [isOpenedModal, setIsOpenedModal] = useState(false);

  const handleCloseModal = () => {
    setIsOpenedModal(false);
  };

  return (
    <>
      <li key={date.toString()} onClick={() => setIsOpened((prev) => !prev)}>
        <div className="closed-list-container">
          <img
            src={chevronRight}
            alt="chevron right"
            className={isOpened ? `list-icon--opened-list` : `list-icon--closed-list`}
          />
          {date}
        </div>
      </li>
      {isOpened && (
        <ul className="opened-list-container">
          {rows.map((historyRow) => (
            <li className="request-row" key={historyRow.id}>
              <span className={`method method--${historyRow.request_method}`}>
                {historyRow.request_method}
              </span>
              <Link className="url-link" to="/rest-client">
                {historyRow.endpoint}
              </Link>
              <img
                src={threeDots}
                alt="open request info"
                onClick={() => {
                  setIsOpenedModal((prev) => !prev);
                }}
              />
            </li>
          ))}
        </ul>
      )}
      {isOpenedModal && (
        <Modal closeModal={handleCloseModal}>
          <AnalyticsCard closeModal={handleCloseModal} />
        </Modal>
      )}
    </>
  );
}
