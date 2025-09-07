import './RestClient.scss';
import { useNavigate, useSearchParams } from 'react-router-dom';
import HeadersSection from '@/pages/RestClient/HeadersSection/HeadersSection.tsx';
import RequestBar from '@/pages/RestClient/RequestBar/RequestBar.tsx';
import { restClientPageStore } from '@/stores/restClientPageStore/restClientPageStore.ts';
import { type ChangeEvent, useEffect, useState } from 'react';
import type { Params, UIMatch } from 'react-router';

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

  const {
    requestMethod,
    requestUrl,
    requestBody,
    requestHeaders,
    setRequestMethod,
    setRequestUrl,
    setRequestBody,
    addRequestHeader,
    clearRequestHeaders,
  } = restClientPageStore();

  useEffect(() => {
    if (method) setRequestMethod(method);
    if (encodedUrl) setRequestUrl(atob(encodedUrl));
    if (encodedBody) setRequestBody(atob(encodedBody));

    clearRequestHeaders();

    searchParams.forEach((value, key) => {
      addRequestHeader({ name: decodeURIComponent(key), value: decodeURIComponent(value) });
    });
  }, []);

  useEffect(() => {
    const lastHeader = requestHeaders.at(-1);

    if (!lastHeader || lastHeader?.name || lastHeader?.value) {
      addRequestHeader({ name: '', value: '' });
    }
  }, [requestHeaders]);

  const navigateAfterSendingRequest = () => {
    const segments = [
      '/rest-client',
      requestMethod || undefined,
      requestUrl ? btoa(requestUrl) : undefined,
      requestBody ? btoa(requestBody) : undefined,
    ].filter((s) => s !== undefined);

    const newUrlSearchParams = new URLSearchParams(
      requestHeaders
        .filter((h) => h.name || h.value)
        .map((r) => [encodeURIComponent(r.name), encodeURIComponent(r.value)])
    );

    navigate({
      pathname: segments.join('/'),
      search: newUrlSearchParams.toString() ? `?${newUrlSearchParams}` : undefined,
    });
  };

  const handleSendingRequest = () => {
    if (!requestUrl) {
      setUrlError('required field');
    }

    if (!requestMethod) {
      setMethodError('required field');
      return;
    }

    navigateAfterSendingRequest();
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
        initMethod={requestMethod || 'GET'}
        handleMethodOnChange={handleMethodChange}
        initSearchValue={requestUrl}
        handleSearchOnChange={handleSearchChange}
        handleButtonClick={handleSendingRequest}
        urlError={urlError}
        methodError={methodError}
      />
      <HeadersSection />
    </div>
  );
}
