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
  } = props;

  const { t } = useTranslation('rest-client');

  return (
    <div className="request-bar" data-testid="request-bar">
      <MethodSelector
        onChange={handleMethodOnChange}
        value={initMethod}
        placeholder={t('method')}
        optionsLabel={t('methodOptions')}
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
      />
      <Button style={ButtonStyle.Primary} onClick={handleButtonClick}>
        {t('send')}
      </Button>
    </div>
  );
}
