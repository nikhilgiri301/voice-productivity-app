import React, { useState, useId } from 'react';

export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'tel'
  | 'url'
  | 'search';
export type InputVariant = 'default' | 'error' | 'success';

export interface InputProps {
  label: string;
  type?: InputType;
  variant?: InputVariant;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  error?: string;
  helperText?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  'aria-describedby'?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  variant = 'default',
  value,
  defaultValue,
  placeholder,
  disabled = false,
  required = false,
  className = '',
  error,
  helperText,
  onChange,
  onFocus,
  onBlur,
  'aria-describedby': ariaDescribedBy,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(Boolean(value || defaultValue));

  const inputId = useId();
  const errorId = useId();
  const helperTextId = useId();

  const isFloating = isFocused || hasValue || placeholder;

  const containerClasses = ['relative', 'w-full', className].join(' ');

  const inputClasses = [
    'w-full',
    'px-4',
    'pt-6',
    'pb-2',
    'bg-bg-card',
    'border',
    'rounded-button',
    'text-body',
    'text-text-primary',
    'placeholder-transparent',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-accent',
    'focus:ring-opacity-50',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'peer',
  ];

  const variantClasses = {
    default: ['border-border-default', 'focus:border-accent'],
    error: [
      'border-priority-urgent',
      'focus:border-priority-urgent',
      'focus:ring-priority-urgent',
    ],
    success: [
      'border-context-personal',
      'focus:border-context-personal',
      'focus:ring-context-personal',
    ],
  };

  const labelClasses = [
    'absolute',
    'left-4',
    'text-text-secondary',
    'transition-all',
    'duration-200',
    'pointer-events-none',
    'peer-focus:text-accent',
    'peer-disabled:opacity-50',
  ];

  const floatingLabelClasses = isFloating
    ? ['top-2', 'text-micro', 'text-accent']
    : ['top-4', 'text-body'];

  const finalInputClasses = [...inputClasses, ...variantClasses[variant]].join(
    ' '
  );

  const finalLabelClasses = [...labelClasses, ...floatingLabelClasses].join(
    ' '
  );

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>): void => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
    setIsFocused(false);
    onBlur?.(event);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setHasValue(Boolean(event.target.value));
    onChange?.(event);
  };

  const describedBy =
    [
      error ? errorId : undefined,
      helperText ? helperTextId : undefined,
      ariaDescribedBy,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <div className={containerClasses}>
      <input
        id={inputId}
        type={type}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={finalInputClasses}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-describedby={describedBy}
        aria-invalid={variant === 'error'}
        {...props}
      />
      <label htmlFor={inputId} className={finalLabelClasses}>
        {label}
        {required && <span className='text-priority-urgent ml-1'>*</span>}
      </label>

      {error && (
        <p
          id={errorId}
          className='mt-1 text-micro text-priority-urgent'
          role='alert'
        >
          {error}
        </p>
      )}

      {helperText && !error && (
        <p id={helperTextId} className='mt-1 text-micro text-text-secondary'>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
