import './InputStyles.scss';
import clsx from 'clsx';

export interface InputError {
  id: number;
  message: string;
}

interface InputProps {
  id: string;
  type?: string;
  name?: string;
  value?: string;
  labelText?: string;
  inputClassName?: string;
  inputContainerClassName?: string;
  errors?: InputError[];
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
  defaultValue?: string;
  placeholder?: string;
}

function Input({
  name,
  value,
  id,
  type = 'text',
  labelText,
  inputClassName = '',
  inputContainerClassName = '',
  errors,
  rightIcon,
  onChange,
  isDisabled,
  defaultValue,
  placeholder,
}: InputProps) {
  const inputFieldClass = clsx(
    'input-field',
    `${inputClassName}`,
    `${rightIcon ? 'input-field--right-icon' : ''}`
  );

  return (
    <div className={`input-container ${inputContainerClassName}`}>
      <label className="input-label" htmlFor={id}>
        {labelText}
      </label>
      <div className="input-wrapper">
        <input
          name={name}
          id={id}
          type={type}
          value={value}
          className={inputFieldClass}
          onChange={onChange}
          disabled={isDisabled}
          defaultValue={defaultValue}
          placeholder={placeholder}
        ></input>
        {rightIcon && <div className="input-right-icon">{rightIcon}</div>}
        <div className="input-field--error">
          {errors?.map((error) => (
            <div key={error.id}>{error.message}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Input;
