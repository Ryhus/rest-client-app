import './InputStyles.scss';

interface InputError {
  id: number;
  message: string;
}

interface InputProps {
  id: string;
  type?: string;
  name?: string;
  value?: string;
  labelText?: string;
  className?: string;
  errors?: InputError[];
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
}

function Input({
  name,
  value,
  id,
  type = 'text',
  labelText,
  className = '',
  errors,
  rightIcon,
  onChange,
  isDisabled,
}: InputProps) {
  const inputContainerClass =
    `input-container input-container__${type}  ${className}`.trim();

  const inputFieldClass =
    `input-field input-field__${type} ${rightIcon ? 'input-field--right-icon' : ''}`.trim();

  return (
    <div className={inputContainerClass}>
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
        ></input>
        {rightIcon && (
          <div className="input-icon input-right-icon">{rightIcon}</div>
        )}
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
