import './RequestDataEditorOrViewer.scss';
import { Selector } from '@/components';
import { restClientPageStore } from '@/stores/restClientPageStore/restClientPageStore.ts';
import { type ChangeEvent, useState } from 'react';

export interface ResponseForViewer {
  status: number;
  statusText: string;
  body: string;
}

interface Props {
  mode: 'editor' | 'viewer';
  response?: ResponseForViewer | null;
  responseErrorMessage?: string;
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

export function RequestDataEditorOrViewer(props: Props) {
  const { mode, response, responseErrorMessage } = props;
  const [bodyType, setBodyType] = useState<BodyType>('text');
  const [isValidBodyFormat, setIsValidBodyFormat] = useState(true);
  const isEditorMode = mode === 'editor';
  const { requestBody, setRequestBody } = restClientPageStore();

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
          <p className="title">Body:</p>
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
          />
        </div>
        <p className="not-valid-format">{!isValidBodyFormat && 'not valid format'}</p>
      </>
    );
  };

  const renderViewer = () => {
    let statusCodeClassName = 'info';

    if (response?.status) {
      statusCodeClassName =
        response.status > 199 && response.status < 300 ? 'success' : statusCodeClassName;
      statusCodeClassName = response.status > 399 ? 'error' : statusCodeClassName;
    }

    return (
      <>
        <div className="title-container">
          <p className="title">Response details:</p>
        </div>
        <div className="content-container">
          <div className="viewer">
            {response ? (
              <>
                <div
                  className={`status-code ${statusCodeClassName}`}
                >{`${response.status} ${response.statusText}`}</div>
                <div className="body">{response.body && <pre>{response.body}</pre>}</div>
              </>
            ) : (
              <p className="error">{responseErrorMessage}</p>
            )}
          </div>
        </div>
      </>
    );
  };

  return <div className="data-container">{isEditorMode ? renderEditor() : renderViewer()}</div>;
}
