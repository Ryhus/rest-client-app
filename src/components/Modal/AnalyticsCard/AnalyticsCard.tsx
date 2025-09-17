import { Button } from '@/components/Button';
import { ButtonStyle } from '@/components/Button/types';

import './AnalyticsCard.scss';

import CalendarIcon from '@/assets/icons/calendar.svg?react';
import DownloadIcon from '@/assets/icons/download.svg?react';
import UploadIcon from '@/assets/icons/upload.svg?react';
import ClockIcon from '@/assets/icons/clock.svg?react';
import ExclamationIcon from '@/assets/icons/exclamation.svg?react';

interface AnalyticsCardProps {
  closeModal: () => void;
}

export default function AnalyticsCard({ closeModal }: AnalyticsCardProps) {
  return (
    <div className="analytics-card">
      <Button style={ButtonStyle.IconBtn} customClass="close-modal-bttn" onClick={closeModal}>
        &times;
      </Button>
      <div className="request-date-container">
        <CalendarIcon className="icon" />
        <span>29.05.1992</span>
      </div>
      <div className="endpoint-container">
        <span className="endpoint-method">GET</span>
        <span className="endpoint">https//some-url.com/</span>
      </div>
      <div className="main-analytics-container">
        <div className="analytics-container request-analytics-container">
          <h4>Request</h4>
          <div className="analytics-border"></div>
          <div className="analytics-data">
            <div>
              <ClockIcon className="icon" />
              <span>{`duration ${`200ms`}`}</span>
            </div>
            <div>
              <UploadIcon className="icon" />
              <span>{`payload ${`5 000 000 bytes`}`}</span>
            </div>
          </div>
        </div>
        <div className="analytics-container request-analytics-container">
          <h4>Response</h4>
          <div className="analytics-border"></div>
          <div className="analytics-data">
            <div className="status-code-container">
              <span>200</span>
            </div>

            <div>
              <DownloadIcon className="icon" />
              <span>{`payload ${`5 000 000 bytes`}`}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="error-container">
        <ExclamationIcon className="icon exclamation-icon" />
        <span>Some Errors</span>
      </div>
    </div>
  );
}
