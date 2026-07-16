import { useEffect, useId, useRef, useState } from 'react';
import clsx from 'clsx';
import chevronRight from '@/assets/icons/chevron-right.svg';

import './MethodSelector.scss';

export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'] as const;

interface MethodSelectorProps {
  value?: string;
  placeholder: string;
  optionsLabel: string;
  error?: string;
  onChange: (method: string) => void;
}

export default function MethodSelector({
  value = '',
  placeholder,
  optionsLabel,
  error = '',
  onChange,
}: MethodSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [hasActiveNavigation, setHasActiveNavigation] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => {
    const selectedIndex = HTTP_METHODS.indexOf(value as (typeof HTTP_METHODS)[number]);
    return selectedIndex >= 0 ? selectedIndex : 0;
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();
  const errorId = useId();

  useEffect(() => {
    setInputValue(value);
    const selectedIndex = HTTP_METHODS.indexOf(value as (typeof HTTP_METHODS)[number]);
    if (selectedIndex >= 0) setActiveIndex(selectedIndex);
  }, [value]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  const selectMethod = (method: string) => {
    setInputValue(method);
    onChange(method);
    setIsOpen(false);
    setHasActiveNavigation(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setIsOpen(true);
        setActiveIndex((index) => (index + 1) % HTTP_METHODS.length);
        setHasActiveNavigation(true);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setIsOpen(true);
        setActiveIndex((index) => (index - 1 + HTTP_METHODS.length) % HTTP_METHODS.length);
        setHasActiveNavigation(true);
        break;
      case 'Home':
        if (!isOpen) return;
        event.preventDefault();
        setActiveIndex(0);
        setHasActiveNavigation(true);
        break;
      case 'End':
        if (!isOpen) return;
        event.preventDefault();
        setActiveIndex(HTTP_METHODS.length - 1);
        setHasActiveNavigation(true);
        break;
      case 'Enter':
        if (!isOpen) return;
        event.preventDefault();
        if (hasActiveNavigation) selectMethod(HTTP_METHODS[activeIndex]);
        else setIsOpen(false);
        break;
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        setHasActiveNavigation(false);
        break;
    }
  };

  return (
    <div className="method-selector" ref={containerRef}>
      <div className={clsx('method-selector__control', error && 'method-selector__control--error')}>
        <input
          ref={inputRef}
          type="text"
          className={clsx(
            'method-selector__input',
            inputValue ? ['method', `method--${inputValue}`] : 'method-selector__placeholder'
          )}
          role="combobox"
          aria-label={placeholder}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={isOpen ? `${listboxId}-option-${activeIndex}` : undefined}
          aria-describedby={error ? errorId : undefined}
          placeholder={placeholder}
          value={inputValue}
          autoComplete="off"
          spellCheck="false"
          onClick={() => {
            setIsOpen(true);
            setHasActiveNavigation(false);
          }}
          onChange={(event) => {
            const method = event.target.value.toUpperCase();
            setInputValue(method);
            setIsOpen(true);
            setHasActiveNavigation(false);
            onChange(method);
          }}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className={clsx('method-selector__toggle', isOpen && 'method-selector__toggle--open')}
          aria-label={optionsLabel}
          aria-expanded={isOpen}
          aria-controls={listboxId}
          onClick={() => {
            setIsOpen((open) => !open);
            setHasActiveNavigation(false);
            inputRef.current?.focus();
          }}
        >
          <img src={chevronRight} alt="" aria-hidden="true" />
        </button>
      </div>

      {isOpen && (
        <ul className="method-selector__menu" id={listboxId} role="listbox">
          {HTTP_METHODS.map((method, index) => (
            <li
              id={`${listboxId}-option-${index}`}
              className={clsx(
                'method-selector__option',
                index === activeIndex && 'method-selector__option--active',
                method === inputValue && 'method-selector__option--selected'
              )}
              role="option"
              aria-selected={method === inputValue}
              key={method}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectMethod(method)}
            >
              <span className={`method method--${method}`}>{method}</span>
            </li>
          ))}
        </ul>
      )}

      <div
        className="input-field--error"
        id={errorId}
        aria-live="polite"
        data-testid="method-error"
      >
        {error}
      </div>
    </div>
  );
}
