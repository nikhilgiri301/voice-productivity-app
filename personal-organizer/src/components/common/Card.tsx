import React from 'react';

export type CardVariant = 'glass' | 'solid' | 'outlined';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  hoverable?: boolean;
  'aria-label'?: string;
  role?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'glass',
  padding = 'md',
  className = '',
  onClick,
  hoverable = false,
  'aria-label': ariaLabel,
  role,
  ...props
}) => {
  const baseClasses = ['rounded-card', 'transition-all', 'duration-200'];

  const variantClasses = {
    glass: ['glass-card', 'backdrop-blur-glass'],
    solid: ['bg-bg-card', 'shadow-card'],
    outlined: ['bg-transparent', 'border', 'border-border-default'],
  };

  const paddingClasses = {
    none: [],
    sm: ['p-3'],
    md: ['p-card-padding'],
    lg: ['p-6'],
  };

  const interactiveClasses =
    onClick || hoverable
      ? [
          'cursor-pointer',
          'hover:shadow-lg',
          'hover:scale-[1.02]',
          'active:scale-[0.98]',
          'focus-ring',
        ]
      : [];

  const classes = [
    ...baseClasses,
    ...variantClasses[variant],
    ...paddingClasses[padding],
    ...interactiveClasses,
    className,
  ].join(' ');

  const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    onClick?.(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick(event as unknown as React.MouseEvent<HTMLDivElement>);
    }
  };

  return (
    <div
      className={classes}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={role || (onClick ? 'button' : undefined)}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
