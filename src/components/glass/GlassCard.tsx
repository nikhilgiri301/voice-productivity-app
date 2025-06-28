import React, { ReactNode, forwardRef } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'default' | 'elevated' | 'subtle' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  blur?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  interactive?: boolean;
  disabled?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(({
  children,
  className = '',
  style = {},
  variant = 'default',
  padding = 'md',
  blur = 'md',
  onClick,
  onMouseEnter,
  onMouseLeave,
  interactive = false,
  disabled = false,
}, ref) => {
  const getVariantStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      background: 'var(--bg-card)',
      border: '1px solid var(--border-primary)',
      borderRadius: 'var(--radius-lg)',
      backdropFilter: getBlurValue(),
      WebkitBackdropFilter: getBlurValue(), // Safari support
      transition: 'all var(--transition-fast)',
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyles,
          background: 'rgba(30, 30, 35, 0.9)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        };
      
      case 'subtle':
        return {
          ...baseStyles,
          background: 'rgba(30, 30, 35, 0.6)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        };
      
      case 'bordered':
        return {
          ...baseStyles,
          background: 'rgba(30, 30, 35, 0.8)',
          boxShadow: 'var(--shadow-md)',
          border: '2px solid var(--border-accent)',
        };
      
      default:
        return {
          ...baseStyles,
          boxShadow: 'var(--shadow-md)',
        };
    }
  };

  const getBlurValue = (): string => {
    switch (blur) {
      case 'none':
        return 'none';
      case 'sm':
        return 'blur(8px)';
      case 'lg':
        return 'blur(32px)';
      default:
        return 'blur(20px)';
    }
  };

  const getPaddingValue = (): string => {
    switch (padding) {
      case 'none':
        return '0';
      case 'sm':
        return 'var(--spacing-4)';
      case 'lg':
        return 'var(--spacing-8)';
      case 'xl':
        return 'var(--spacing-12)';
      default:
        return 'var(--spacing-6)';
    }
  };

  const getInteractiveStyles = (): React.CSSProperties => {
    if (!interactive || disabled) return {};

    return {
      cursor: 'pointer',
      transform: 'translateY(0)',
    };
  };

  const handleMouseEnter = () => {
    if (disabled) return;
    onMouseEnter?.();
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    onMouseLeave?.();
  };

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
  };

  const cardStyle: React.CSSProperties = {
    ...getVariantStyles(),
    ...getInteractiveStyles(),
    padding: getPaddingValue(),
    opacity: disabled ? 0.6 : 1,
    pointerEvents: disabled ? 'none' : 'auto',
    ...style,
  };

  return (
    <div
      ref={ref}
      className={`glass-card ${interactive ? 'glass-card--interactive' : ''} ${disabled ? 'glass-card--disabled' : ''} ${className}`}
      style={cardStyle}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive && !disabled ? 0 : undefined}
      onKeyDown={(e) => {
        if (interactive && !disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {children}
      
      {/* Add CSS-in-JS styles for hover effects */}
      <style jsx>{`
        .glass-card--interactive:hover:not(.glass-card--disabled) {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          border-color: var(--border-focus);
        }
        
        .glass-card--interactive:active:not(.glass-card--disabled) {
          transform: translateY(0);
          box-shadow: var(--shadow-md);
        }
        
        .glass-card--interactive:focus:not(.glass-card--disabled) {
          outline: 2px solid var(--accent-blue);
          outline-offset: 2px;
        }
        
        .glass-card--interactive:focus:not(:focus-visible) {
          outline: none;
        }
      `}</style>
    </div>
  );
});

GlassCard.displayName = 'GlassCard';

export default GlassCard;
