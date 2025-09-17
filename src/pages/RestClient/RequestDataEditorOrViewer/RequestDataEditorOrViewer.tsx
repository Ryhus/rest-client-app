import './RequestDataEditorOrViewer.scss';
import { Selector } from '@/components';
import { restClientPageStore } from '@/stores/restClientPageStore/restClientPageStore.ts';
import { type ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

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

    return (
      <>
        <div className="title-container">
          <p className="title">{t('body')}</p>
          <Selector
            id="editor-mode"
            data={['text', 'json']}
            onChange={handleRequestBodyTypeChange}
          />
        </div>
        <div className="content-container">
          <textarea
            id={`data-editor-${mode}`}
            className="textarea"
            onChange={handleRequestBodyOnChange}
            defaultValue={requestBody}
            spellCheck={bodyType === 'text'}
          />
        </div>
        <p className="not-valid-format">{!isValidBodyFormat && t('formatError')}</p>
      </>
    );
  };

  const renderViewer = () => {
    const { data, errorMessage, status } = viewerData || {};
    const statusClassName = getStatusClassName(status);

    return (
      <>
        <div className="title-container">
          <p className="title">{t('response')}</p>
        </div>
        <div className="content-container">
          <div className="viewer">
            {status && <div className={`status-code ${statusClassName}`}>{status}</div>}
            {data && (
              <div className="body">
                <pre>{data}</pre>
              </div>
            )}
            {errorMessage && <p className="error">{errorMessage}</p>}
          </div>
        </div>
      </>
    );
  };

  return <div className="data-container">{isEditorMode ? renderEditor() : renderViewer()}</div>;
}
