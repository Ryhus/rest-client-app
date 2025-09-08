import './RestClient.scss';
import { useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import HeadersSection from '@/pages/RestClient/HeadersSection/HeadersSection.tsx';
import RequestBar from '@/pages/RestClient/RequestBar/RequestBar.tsx';
import { restClientPageStore } from '@/stores/restClientPageStore/restClientPageStore.ts';
import { type ChangeEvent, useEffect, useState } from 'react';
import type { Params, UIMatch } from 'react-router';
import { useAuthStore } from '@/stores/authStore/authStore';
import Spinner from '@/components/Spinner/Spinner.tsx';

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

  const {
    requestMethod,
    requestUrl,
    requestHeaders,
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

  const navigateAfterSendingRequest = () => {
    const segments = [
      '/rest-client',
      requestMethod || undefined,
      requestUrl ? btoa(requestUrl) : undefined,
    ].filter((s) => s !== undefined);

    const newUrlSearchParams = new URLSearchParams(
      requestHeaders.filter((h) => h.name || h.value).map((r) => [r.name, r.value])
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
        initMethod={requestMethod}
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
