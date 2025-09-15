import './RestClient.scss';
import {
  useNavigate,
  useSearchParams,
  Navigate,
  useRouteLoaderData,
  useFetcher,
  type ActionFunctionArgs,
} from 'react-router-dom';
import HeadersSection from '@/pages/RestClient/HeadersSection/HeadersSection.tsx';
import RequestBar from '@/pages/RestClient/RequestBar/RequestBar.tsx';
import { restClientPageStore } from '@/stores/restClientPageStore/restClientPageStore.ts';
import { type ChangeEvent, useEffect, useState } from 'react';
import type { Params, UIMatch } from 'react-router';
import Spinner from '@/components/Spinner/Spinner.tsx';
import { RequestDataEditorOrViewer } from '@/pages/RestClient/RequestDataEditorOrViewer/RequestDataEditorOrViewer.tsx';
import { apiRequest } from '@/services/rest/restService.ts';
import axios from 'axios';
import { type User } from '@supabase/supabase-js';

interface Props {
  params: Params<string>;
  matches: UIMatch[];
}

export default function RestClient({ params }: Props) {
  const { method, encodedUrl, encodedBody } = params;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [urlError, setUrlError] = useState<string>('');
  const [methodError, setMethodError] = useState<string>('');
  const user = useRouteLoaderData<User>('root');
  const fetcher = useFetcher<ActionData>();
  let viewerData;

  if (fetcher.data && 'errorMessage' in fetcher.data) {
    viewerData = {
      status: fetcher.data.status,
      errorMessage: JSON.stringify(fetcher.data.errorMessage),
    };
  } else {
    viewerData = {
      status: fetcher.data?.status,
      data: JSON.stringify(fetcher.data, null, 2),
    };
  }

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

    await fetcher.submit(
      {
        method: requestMethod,
        url: requestUrl,
        body: requestBody,
        headers: JSON.stringify(headers),
      },
      { method: 'POST', action: '/rest-client' }
    );
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

  if (!user) return <Navigate to="/" replace />;

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
      <RequestDataEditorOrViewer mode="viewer" viewerData={viewerData} />
      {fetcher.state === 'submitting' && (
        <div className="bg-overlay">
          <Spinner />
        </div>
      )}
    </div>
  );
}

type ActionData =
  | {
      data?: unknown;
      status: number;
      headers: Record<string, string>;
    }
  | {
      errorMessage: string;
      status?: number;
    };

export async function action({ request }: ActionFunctionArgs): Promise<ActionData> {
  const data = await request.formData();

  const method = data.get('method') as string;
  const url = data.get('url') as string;
  const body = data.get('body') as string | null;
  const headersJson = data.get('headers') as string;
  const headers = headersJson ? JSON.parse(headersJson) : {};

  try {
    return await apiRequest({
      method,
      url,
      data: body,
      config: { headers },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        status: error.response?.status,
        errorMessage: error.response?.data || error.message,
      };
    }

    return {
      errorMessage: error instanceof Error ? error.message : String(error),
    };
  }
}
