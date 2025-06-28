import React, { ReactNode, forwardRef, ButtonHTMLAttributes } from 'react';

interface GlassButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  blur?: 'none' | 'sm' | 'md' | 'lg';
}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  blur = 'md',
  disabled,
  style = {},
  ...props
}, ref) => {
  const getVariantStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      border: 'none',
      borderRadius: 'var(--radius-md)',
      fontWeight: 'var(--font-weight-semibold)',
      transition: 'all var(--transition-fast)',
      backdropFilter: getBlurValue(),
      WebkitBackdropFilter: getBlurValue(),
      position: 'relative',
      overflow: 'hidden',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          background: 'var(--gradient-blue)',
          color: 'white',
          boxShadow: 'var(--shadow-md)',
        };
      
      case 'secondary':
        return {
          ...baseStyles,
          background: 'rgba(255, 255, 255, 0.1)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-accent)',
          boxShadow: 'var(--shadow-sm)',
        };
      
      case 'ghost':
        return {
          ...baseStyles,
          background: 'transparent',
          color: 'var(--text-secondary)',
          border: '1px solid transparent',
        };
      
      case 'danger':
        return {
          ...baseStyles,
          background: 'var(--gradient-red)',
          color: 'white',
          boxShadow: 'var(--shadow-md)',
        };
      
      case 'success':
        return {
          ...baseStyles,
          background: 'var(--gradient-green)',
          color: 'white',
          boxShadow: 'var(--shadow-md)',
        };
      
      default:
        return baseStyles;
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return {
          padding: '8px 16px',
          fontSize: 'var(--font-size-sm)',
          minHeight: '32px',
        };
      
      case 'lg':
        return {
          padding: '16px 24px',
          fontSize: 'var(--font-size-lg)',
          minHeight: '48px',
        };
      
      default:
        return {
          padding: '12px 20px',
          fontSize: 'var(--font-size-base)',
          minHeight: '40px',
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

  const buttonStyle: React.CSSProperties = {
    ...getVariantStyles(),
    ...getSizeStyles(),
    width: fullWidth ? '100%' : 'auto',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'var(--font-family-primary)',
    ...style,
  };

  const getHoverStyles = (variant: string): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          background: 'var(--accent-blue-hover)',
          transform: 'translateY(-2px)',
          boxShadow: 'var(--shadow-lg)',
        };
      
      case 'secondary':
        return {
          background: 'rgba(255, 255, 255, 0.15)',
          borderColor: 'var(--border-focus)',
          transform: 'translateY(-1px)',
        };
      
      case 'ghost':
        return {
          background: 'rgba(255, 255, 255, 0.05)',
          color: 'var(--text-primary)',
        };
      
      case 'danger':
        return {
          background: 'var(--accent-red-hover)',
          transform: 'translateY(-2px)',
          boxShadow: 'var(--shadow-lg)',
        };
      
      case 'success':
        return {
          background: 'var(--accent-green-hover)',
          transform: 'translateY(-2px)',
          boxShadow: 'var(--shadow-lg)',
        };
      
      default:
        return {};
    }
  };

  return (
    <button
      ref={ref}
      className={`glass-button glass-button--${variant} glass-button--${size} ${fullWidth ? 'glass-button--full-width' : ''} ${loading ? 'glass-button--loading' : ''} ${className}`}
      style={buttonStyle}
      disabled={disabled || loading}
      {...props}
    >
      {/* Loading spinner */}
      {loading && (
        <div
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid currentColor',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      )}
      
      {/* Left icon */}
      {leftIcon && !loading && (
        <span className="glass-button__icon glass-button__icon--left">
          {leftIcon}
        </span>
      )}
      
      {/* Button content */}
      <span className="glass-button__content">
        {children}
      </span>
      
      {/* Right icon */}
      {rightIcon && !loading && (
        <span className="glass-button__icon glass-button__icon--right">
          {rightIcon}
        </span>
      )}
      
      {/* Ripple effect overlay */}
      <div
        className="glass-button__ripple"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 'inherit',
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      />
      
      {/* CSS-in-JS styles */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .glass-button:hover:not(:disabled):not(.glass-button--loading) {
          ${Object.entries(getHoverStyles(variant))
            .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
            .join('\n          ')}
        }
        
        .glass-button:active:not(:disabled):not(.glass-button--loading) {
          transform: translateY(0) !important;
          box-shadow: var(--shadow-sm) !important;
        }
        
        .glass-button:focus:not(:disabled) {
          outline: 2px solid var(--accent-blue);
          outline-offset: 2px;
        }
        
        .glass-button:focus:not(:focus-visible) {
          outline: none;
        }
        
        .glass-button__icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .glass-button__content {
          white-space: nowrap;
        }
        
        .glass-button--full-width {
          width: 100%;
        }
      `}</style>
    </button>
  );
});

GlassButton.displayName = 'GlassButton';

export default GlassButton;
