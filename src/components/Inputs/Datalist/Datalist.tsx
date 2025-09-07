import type { ChangeEventHandler } from 'react';
import './DatalistStyles.scss';
import type { InputError } from '@/components/Inputs/Input/Input.tsx';

interface DatalistProps {
  id: string;
  name?: string;
  labelTxt?: string;
  value?: string;
  listName: string;
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  data: string[];
  defaultValue?: string;
  errors?: InputError[];
  spaceForErrorMessage?: boolean;
}

export default function Datalist({
  id,
  name,
  labelTxt,
  value,
  listName,
  placeholder,
  onChange,
  data,
  defaultValue,
  errors,
  spaceForErrorMessage = false,
}: DatalistProps) {
  const renderError = () => {
    if (spaceForErrorMessage || errors) {
      return (
        <div className="input-field--error">
          {errors?.map((error) => (
            <div key={error.id}>{error.message}</div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="datalist-container">
      <label htmlFor={id} className="datalist-label">
        {labelTxt}
      </label>
      <input
        id={id}
        list={listName}
        name={name}
        className="datalist-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        defaultValue={defaultValue}
      />
      {renderError()}
      <datalist id={listName}>
        {data.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </datalist>
    </div>
  );
}
