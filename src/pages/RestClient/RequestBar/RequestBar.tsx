import './RequestBar.scss';
import Datalist from '../../../components/Inputs/Datalist/Datalist.tsx';
import { Button, Input } from '@/components';
import { ButtonStyle } from '@/components/Button/types.ts';
import type { ChangeEventHandler } from 'react';

const initRequestMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

interface Props {
  initMethod: string;
  handleMethodOnChange: ChangeEventHandler<HTMLInputElement>;
  handleSearchOnChange: ChangeEventHandler<HTMLInputElement>;
  handleButtonClick: () => void;
  initSearchValue?: string;
  urlError?: string;
  methodError?: string;
}

export default function RequestBar(props: Props) {
  const {
    handleMethodOnChange,
    initMethod,
    handleSearchOnChange,
    handleButtonClick,
    initSearchValue = '',
    urlError = '',
    methodError = '',
  } = props;

  return (
    <div className="request-bar">
      <Datalist
        id={'id-method-options'}
        listName="method-options"
        onChange={handleMethodOnChange}
        defaultValue={initMethod}
        data={initRequestMethods}
        spaceForErrorMessage={true}
        errors={[{ id: 1, message: methodError }]}
      />
      <Input
        id="input-search"
        name="search"
        inputContainerClassName="input-container-search"
        inputClassName="input-search"
        defaultValue={initSearchValue}
        onChange={handleSearchOnChange}
        errors={[{ id: 0, message: urlError }]}
      />
      <Button style={ButtonStyle.Primary} onClick={handleButtonClick}>
        send
      </Button>
    </div>
  );
}
