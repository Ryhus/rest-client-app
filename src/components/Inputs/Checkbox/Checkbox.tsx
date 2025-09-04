import type { ChangeEventHandler } from 'react';
import './CheckboxStyles.scss';

interface CheckboxProps {
  name?: string;
  labelTxt?: string;
  isChecked?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

export default function Checkbox({
  name,
  labelTxt,
  isChecked,
  onChange,
}: CheckboxProps) {
  return (
    <div className="checkbox">
      <label className="checkboxLabel">
        {labelTxt}
        <input
          type="checkbox"
          name={name}
          checked={isChecked}
          onChange={onChange}
        />
        <span className="checkmark" />
      </label>
    </div>
  );
}
