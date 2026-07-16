import './RequestDataEditorOrViewer.scss';
import { Button, Selector } from '@/components';
import { restClientPageStore } from '@/stores/restClientPageStore/restClientPageStore.ts';
import { type ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonStyle } from '@/components/Button/types.ts';
import BodyEditor from './BodyEditor';
import SyntaxHighlighter, { isJson } from './SyntaxHighlighter';

interface PropsEditor {
  mode: 'editor';
}

interface PropsViewer {
  mode: 'viewer';
  viewerData?: {
    data?: string;
    status?: number;
    errorMessage?: string;
  };
}

type BodyType = 'text' | 'json';

function isValidRequestBodyFormat(params: { bodyType: BodyType; body: string }): boolean {
  const { bodyType, body } = params;

  if (bodyType === 'text') {
    return true;
  } else if (bodyType === 'json') {
    try {
      JSON.parse(body);
      return true;
    } catch {
      return false;
    }
  }

  return false;
}

function getStatusClassName(status?: number): string {
  if (!status) {
    return '';
  }

  switch (true) {
    case status > 199 && status < 300:
      return 'success';
    case status > 399:
      return 'error';
    default:
      return 'info';
  }
}

export function RequestDataEditorOrViewer(props: PropsEditor | PropsViewer) {
  const { mode } = props;
  const { viewerData } = mode === 'viewer' ? props : {};
  const [bodyType, setBodyType] = useState<BodyType>('text');
  const [isValidBodyFormat, setIsValidBodyFormat] = useState(true);
  const isEditorMode = mode === 'editor';
  const { requestBody, setRequestBody } = restClientPageStore();
  const { t } = useTranslation('rest-client');

  const renderEditor = () => {
    const handleRequestBodyOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      const body = e.target.value;
      setIsValidBodyFormat(isValidRequestBodyFormat({ bodyType, body }));
      setRequestBody(body);
    };

    const handleRequestBodyTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
      const type = e.target.value as BodyType;
      setBodyType(type);
      setIsValidBodyFormat(isValidRequestBodyFormat({ bodyType: type, body: requestBody }));
    };

    const beautifyJson = () => {
      try {
        setRequestBody(JSON.stringify(JSON.parse(requestBody), null, 2));
      } catch {
        return;
      }
    };

    return (
      <>
        <div className="title-container" data-testid="editor-section">
          <h2 className="title" id="request-body-title" data-testid="title">
            {t('body')}:
          </h2>
          <Selector
            id="editor-mode"
            data={['text', 'json']}
            onChange={handleRequestBodyTypeChange}
            ariaLabel={t('bodyFormat')}
          />
          {bodyType === 'json' && (
            <Button
              customClass="beautify"
              style={ButtonStyle.Secondary}
              onClick={beautifyJson}
              isDisabled={!isValidBodyFormat}
            >
              {t('beautifyBtn')}
            </Button>
          )}
        </div>
        <div className="content-container">
          <BodyEditor
            language={bodyType}
            onChange={handleRequestBodyOnChange}
            value={requestBody}
            ariaLabel={t('requestBodyEditor')}
            errorId="request-body-format-error"
            isInvalid={!isValidBodyFormat}
          />
        </div>
        <p
          className="not-valid-format"
          id="request-body-format-error"
          role={!isValidBodyFormat ? 'alert' : undefined}
          aria-live="polite"
          data-testid="not-valid-format"
        >
          {!isValidBodyFormat && t('formatError')}
        </p>
      </>
    );
  };

  const renderViewer = () => {
    const { data, errorMessage, status } = viewerData || {};
    const statusClassName = getStatusClassName(status);

    return (
      <>
        <div className="title-container" data-testid="viewer-section">
          <h2 className="title" id="response-details-title" data-testid="title">
            {t('response')}:
          </h2>
        </div>
        <div
          className="content-container"
          role="region"
          aria-labelledby="response-details-title"
          aria-live="polite"
        >
          <div className="viewer">
            {status && (
              <div
                className={`status-code ${statusClassName}`}
                aria-label={t('responseStatus', { status })}
              >
                {status}
              </div>
            )}
            {data && (
              <div className="body">
                <pre
                  className="response-syntax"
                  aria-label={t('responseBody')}
                  tabIndex={0}
                  data-testid="pre-data"
                >
                  <SyntaxHighlighter value={data} language={isJson(data) ? 'json' : 'text'} />
                </pre>
              </div>
            )}
            {errorMessage && (
              <p className="error" role="alert" data-testid="viewer-error">
                {errorMessage}
              </p>
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <section
      className="data-container"
      aria-labelledby={isEditorMode ? 'request-body-title' : 'response-details-title'}
    >
      {isEditorMode ? renderEditor() : renderViewer()}
    </section>
  );
}
