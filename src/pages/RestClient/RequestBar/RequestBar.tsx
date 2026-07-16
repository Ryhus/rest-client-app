import './RequestBar.scss';
import { Button, Input } from '@/components';
import { ButtonStyle } from '@/components/Button/types.ts';
import type { ChangeEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import MethodSelector from './MethodSelector';

export interface RequestBarProps {
  handleMethodOnChange: (method: string) => void;
  handleEndpointOnChange: ChangeEventHandler<HTMLInputElement>;
  handleButtonClick: () => void;
  initMethod?: string;
  initSearchValue?: string;
  urlError?: string;
  methodError?: string;
  isSending?: boolean;
}

export default function RequestBar(props: RequestBarProps) {
  const {
    initMethod,
    handleMethodOnChange,
    handleEndpointOnChange,
    handleButtonClick,
    initSearchValue = '',
    urlError = '',
    methodError = '',
    isSending = false,
  } = props;

  const { t } = useTranslation('rest-client');

  return (
    <section
      className="request-bar"
      data-testid="request-bar"
      aria-label={t('requestConfiguration')}
    >
      <MethodSelector
        onChange={handleMethodOnChange}
        value={initMethod}
        placeholder={t('method')}
        optionsLabel={t('methodOptions')}
        closeOptionsLabel={t('closeMethodOptions')}
        error={methodError}
      />
      <Input
        id="input-search"
        name="search"
        inputContainerClassName="input-container-search"
        inputClassName="input-search"
        value={initSearchValue}
        onChange={handleEndpointOnChange}
        errors={[{ id: 0, message: urlError }]}
        placeholder={t('endpoint')}
        ariaLabel={t('endpoint')}
        ariaRequired
      />
      <Button
        style={ButtonStyle.Primary}
        onClick={handleButtonClick}
        isDisabled={isSending}
        ariaLabel={t('sendRequest')}
      >
        {t('send')}
      </Button>
    </section>
  );
}
