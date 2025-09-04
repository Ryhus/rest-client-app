import type { ChangeEventHandler } from 'react';
import './SelectorStyles.scss';

interface SelectorProps {
  id: string;
  name?: string;
  labelTxt?: string;
  value: string;
  onChange: ChangeEventHandler<HTMLSelectElement>;
  data: string[];
}

export default function Selector({
  id,
  name,
  value,
  labelTxt,
  onChange,
  data,
}: SelectorProps) {
  return (
    <div className="selector">
      <label htmlFor={id}>{labelTxt}</label>
      <select id={id} name={name} value={value} onChange={onChange}>
        {data.map((item) => (
          <option key={item} value={item} className="option">
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}
