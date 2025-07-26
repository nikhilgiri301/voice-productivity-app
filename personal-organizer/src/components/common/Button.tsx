import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button',
  'aria-label': ariaLabel,
  ...props
}) => {
  const baseClasses = [
    'touch-target',
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'rounded-button',
    'transition-all',
    'duration-200',
    'focus-ring',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'disabled:pointer-events-none',
  ];

  const variantClasses = {
    primary: [
      'bg-accent',
      'text-white',
      'hover:bg-opacity-90',
      'active:bg-opacity-80',
      'shadow-button',
      'hover:shadow-lg',
    ],
    secondary: [
      'bg-transparent',
      'text-accent',
      'border',
      'border-accent',
      'hover:bg-accent',
      'hover:text-white',
      'active:bg-opacity-90',
    ],
    ghost: [
      'bg-transparent',
      'text-text-primary',
      'hover:bg-bg-card',
      'active:bg-opacity-80',
    ],
  };

  const sizeClasses = {
    sm: ['px-3', 'py-2', 'text-secondary', 'min-h-[36px]'],
    md: ['px-4', 'py-3', 'text-body', 'min-h-[44px]'],
    lg: ['px-6', 'py-4', 'text-card-title', 'min-h-[52px]'],
  };

  const classes = [
    ...baseClasses,
    ...variantClasses[variant],
    ...sizeClasses[size],
    className,
  ].join(' ');

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      type={type}
      className={classes}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className='animate-spin -ml-1 mr-2 h-4 w-4'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
        >
          <circle
            className='opacity-25'
            cx='12'
            cy='12'
            r='10'
            stroke='currentColor'
            strokeWidth='4'
          />
          <path
            className='opacity-75'
            fill='currentColor'
            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
