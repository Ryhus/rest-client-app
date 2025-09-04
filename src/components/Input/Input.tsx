import './InputStyles.scss';

export interface InputProps {
  id: string;
  type?: 'text' | 'password' | 'email' | 'number';
  name?: string;
  value?: string;
  labelText?: string;
  className?: string;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  name,
  value,
  id,
  type = 'text',
  labelText,
  className = '',
  errorMessage,
  rightIcon,
  onChange,
}: InputProps) {
  const inputContainerClass =
    `input-container input-container__${type}  ${className}`.trim();

  const inputFieldClass = `input-field input-field__${type} ${
    errorMessage ? 'input-field--error' : ''
  } ${rightIcon ? 'input-field--right-icon' : ''}`.trim();

  return (
    <div className={inputContainerClass}>
      <label htmlFor={id}>{labelText}</label>
      <div className="input-wrapper">
        <input
          name={name}
          id={id}
          type={type}
          value={value}
          className={inputFieldClass}
          onChange={onChange}
        ></input>
        {rightIcon && (
          <div className="input-icon input-right-icon">{rightIcon}</div>
        )}
      </div>
    </div>
  );
}
