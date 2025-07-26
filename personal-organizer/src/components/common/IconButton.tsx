import React from 'react';

export type IconButtonVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps {
  children: React.ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  'aria-label': string; // Required for accessibility
  title?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  children,
  variant = 'default',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button',
  'aria-label': ariaLabel,
  title,
  ...props
}) => {
  const baseClasses = [
    'touch-target',
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-button',
    'transition-all',
    'duration-200',
    'focus-ring',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'disabled:pointer-events-none',
    'relative',
    'overflow-hidden',
  ];

  const variantClasses = {
    default: [
      'bg-transparent',
      'text-text-secondary',
      'hover:bg-bg-card',
      'hover:text-text-primary',
      'active:bg-opacity-80',
    ],
    primary: [
      'bg-accent',
      'text-white',
      'hover:bg-opacity-90',
      'active:bg-opacity-80',
      'shadow-button',
    ],
    secondary: [
      'bg-bg-card',
      'text-text-primary',
      'hover:bg-opacity-80',
      'active:bg-opacity-60',
      'shadow-sm',
    ],
    ghost: [
      'bg-transparent',
      'text-text-primary',
      'hover:bg-white',
      'hover:bg-opacity-10',
      'active:bg-opacity-20',
    ],
    danger: [
      'bg-transparent',
      'text-priority-urgent',
      'hover:bg-priority-urgent',
      'hover:bg-opacity-10',
      'hover:text-priority-urgent',
      'active:bg-opacity-20',
    ],
  };

  const sizeClasses = {
    sm: ['w-9', 'h-9', 'text-sm'],
    md: ['w-11', 'h-11', 'text-base'],
    lg: ['w-12', 'h-12', 'text-lg'],
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
      title={title || ariaLabel}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg
          className='animate-spin w-5 h-5'
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
      ) : (
        children
      )}

      {/* Ripple effect overlay */}
      <span className='absolute inset-0 rounded-button overflow-hidden'>
        <span className='absolute inset-0 rounded-button bg-white opacity-0 hover:opacity-10 transition-opacity duration-200' />
      </span>
    </button>
  );
};

export default IconButton;
