import React from 'react';

export type ChipVariant = 'filter' | 'tag' | 'priority' | 'context';
export type ChipSize = 'sm' | 'md';

export interface ChipProps {
  children: React.ReactNode;
  variant?: ChipVariant;
  size?: ChipSize;
  active?: boolean;
  disabled?: boolean;
  removable?: boolean;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onRemove?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  'aria-label'?: string;
  color?: 'critical' | 'useful' | 'work' | 'personal' | 'accent';
}

const Chip: React.FC<ChipProps> = ({
  children,
  variant = 'filter',
  size = 'md',
  active = false,
  disabled = false,
  removable = false,
  className = '',
  onClick,
  onRemove,
  'aria-label': ariaLabel,
  color,
  ...props
}) => {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-chip',
    'transition-all',
    'duration-200',
    'focus-ring',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
  ];

  const sizeClasses = {
    sm: ['px-2', 'py-1', 'text-micro', 'gap-1', 'font-normal'], // 10px, 400 weight
    md: ['px-3', 'py-2', 'text-secondary', 'gap-2', 'font-normal'], // 400 weight
  };

  // Color-specific classes for priority and context variants
  const colorClasses = {
    critical: ['bg-red-500', 'text-white'],
    useful: ['bg-yellow-500', 'text-white'],
    work: ['bg-context-work', 'text-white'],
    personal: ['bg-context-personal', 'text-white'],
    accent: ['bg-accent', 'text-white'],
  };

  const getVariantClasses = (): string[] => {
    switch (variant) {
      case 'filter':
        return active
          ? ['bg-accent', 'text-white', 'hover:bg-opacity-90']
          : [
              'bg-bg-card',
              'text-text-secondary',
              'hover:bg-opacity-80',
              'hover:text-text-primary',
            ];
      case 'tag':
        return ['bg-bg-card', 'text-text-secondary', 'hover:bg-opacity-80'];
      case 'priority':
      case 'context':
        return color && colorClasses[color]
          ? colorClasses[color]
          : ['bg-bg-card', 'text-text-secondary'];
      default:
        return ['bg-bg-card', 'text-text-secondary'];
    }
  };

  const variantClasses = getVariantClasses();

  const interactiveClasses =
    onClick && !disabled
      ? ['cursor-pointer', 'hover:scale-105', 'active:scale-95']
      : [];

  const classes = [
    ...baseClasses,
    ...sizeClasses[size],
    ...variantClasses,
    ...interactiveClasses,
    className,
  ].join(' ');

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  const handleRemove = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    if (disabled) {
      event.preventDefault();
      return;
    }
    onRemove?.(event);
  };

  const chipContent = (
    <>
      <span className='truncate'>{children}</span>
      {removable && (
        <button
          onClick={handleRemove}
          disabled={disabled}
          className='ml-1 hover:bg-black hover:bg-opacity-20 rounded-full p-0.5 transition-colors'
          aria-label='Remove'
        >
          <svg
            className='w-3 h-3'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>
      )}
    </>
  );

  if (onClick) {
    return (
      <button
        className={classes}
        onClick={handleClick}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-pressed={variant === 'filter' ? active : undefined}
        {...props}
      >
        {chipContent}
      </button>
    );
  }

  return (
    <span className={classes} aria-label={ariaLabel} {...props}>
      {chipContent}
    </span>
  );
};

export default Chip;
