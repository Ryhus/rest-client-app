import './FormInputStyles.scss';

interface InputProps {
  id: string;
  type?: string;
  name?: string;
  value?: string;
  checked?: boolean;
  labelText?: string;
  className?: string;
  list?: string;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormInput({
  name,
  value,
  checked,
  id,
  type = 'text',
  labelText,
  list,
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
          checked={checked}
          list={list}
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
