import type { ChangeEventHandler } from 'react';
import './DatalistStyles.scss';

interface DatalistProps {
  id: string;
  name?: string;
  labelTxt?: string;
  value?: string;
  listName: string;
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  data: string[];
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
}: DatalistProps) {
  return (
    <div className="datalist">
      <label htmlFor={id}>{labelTxt}</label>
      <input
        id={id}
        list={listName}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
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
