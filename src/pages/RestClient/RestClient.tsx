import './RestClient.scss';
import { useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import HeadersSection from '@/pages/RestClient/HeadersSection/HeadersSection.tsx';
import RequestBar from '@/pages/RestClient/RequestBar/RequestBar.tsx';
import { restClientPageStore } from '@/stores/restClientPageStore/restClientPageStore.ts';
import { type ChangeEvent, useEffect, useState } from 'react';
import type { Params, UIMatch } from 'react-router';
import { useAuthStore } from '@/stores/authStore/authStore';
import Spinner from '@/components/Spinner/Spinner.tsx';
import {
  RequestDataEditorOrViewer,
  type ResponseForViewer,
} from '@/pages/RestClient/RequestDataEditorOrViewer/RequestDataEditorOrViewer.tsx';
import { apiRequest } from '@/services/rest/restService.ts';

interface Props {
  loaderData?: unknown;
  actionData?: unknown;
  params: Params<string>;
  matches: UIMatch[];
}

export default function RestClient({ params }: Props) {
  const { method, encodedUrl, encodedBody } = params;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [urlError, setUrlError] = useState<string>('');
  const [methodError, setMethodError] = useState<string>('');
  const { session, loading } = useAuthStore();
  const [response, setResponse] = useState<ResponseForViewer | null>(null);
  const [responseErrorMessage, setResponseErrorMessage] = useState('');

  const {
    requestMethod,
    requestUrl,
    requestHeaders,
    requestBody,
    setRequestMethod,
    setRequestUrl,
    setRequestBody,
    addRequestHeader,
    clearRequestHeaders,
  } = restClientPageStore();

  useEffect(() => {
    if (method) {
      setRequestMethod(method);
    }

    if (encodedUrl) {
      setRequestUrl(atob(encodedUrl));
    }

    if (encodedBody) {
      setRequestBody(atob(encodedBody));
    }

    clearRequestHeaders();

    searchParams.forEach((value, key) => {
      addRequestHeader({ name: key, value: value });
    });
  }, []);

  useEffect(() => {
    const lastHeader = requestHeaders.at(-1);

    if (!lastHeader || lastHeader?.name || lastHeader?.value) {
      addRequestHeader({ name: '', value: '' });
    }
  }, [requestHeaders]);

  if (loading) {
    return <Spinner />;
  }

  if (!session) {
    return <Navigate to="/" replace />;
  }

  const navigateAfterSendingRequest = (params: { headers: Record<string, string> }) => {
    const { headers } = params;
    const segments = [
      '/rest-client',
      requestMethod,
      btoa(requestUrl),
      requestBody ? btoa(requestBody) : undefined,
    ].filter((s) => s !== undefined);

    const newUrlSearchParams = new URLSearchParams(headers);

    navigate({
      pathname: segments.join('/'),
      search: newUrlSearchParams.toString() ? `?${newUrlSearchParams}` : undefined,
    });
  };

  const handleSendingRequest = async () => {
    let hasError = false;

    if (!requestUrl) {
      setUrlError('required field');
      hasError = true;
    }

    if (!requestMethod) {
      setMethodError('required field');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const headers = Object.fromEntries(
      requestHeaders.filter((h) => h.name && h.value).map((r) => [r.name, r.value])
    );

    navigateAfterSendingRequest({ headers });

    try {
      const response = await apiRequest({
        method: requestMethod,
        url: requestUrl,
        data: requestBody,
        config: { headers },
      });

      setResponse({
        status: response.status,
        statusText: response.statusText,
        body: JSON.stringify(response.data, null, 2),
      });
      setResponseErrorMessage('');
    } catch {
      setResponse(null);
      setResponseErrorMessage('Failed to fetch');
    }
  };

  const handleMethodChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (methodError) {
      setMethodError('');
    }

    setRequestMethod(e.target.value);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (urlError) {
      setUrlError('');
    }

    setRequestUrl(e.target.value);
  };

  return (
    <div className="rest-client-page">
      <RequestBar
        initMethod={requestMethod}
        handleMethodOnChange={handleMethodChange}
        initSearchValue={requestUrl}
        handleSearchOnChange={handleSearchChange}
        handleButtonClick={handleSendingRequest}
        urlError={urlError}
        methodError={methodError}
      />
      <HeadersSection />
      <RequestDataEditorOrViewer mode="editor" />
      <RequestDataEditorOrViewer
        mode="viewer"
        response={response}
        responseErrorMessage={responseErrorMessage}
      />
    </div>
  );
}
