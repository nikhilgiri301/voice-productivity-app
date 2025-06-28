import React, { ReactNode, forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface BaseGlassInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  blur?: 'none' | 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

interface GlassInputProps extends BaseGlassInputProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  multiline?: false;
}

interface GlassTextareaProps extends BaseGlassInputProps, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  multiline: true;
  rows?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

type GlassInputComponentProps = GlassInputProps | GlassTextareaProps;

export const GlassInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, GlassInputComponentProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  size = 'md',
  variant = 'default',
  blur = 'md',
  fullWidth = false,
  className = '',
  style = {},
  disabled,
  ...props
}, ref) => {
  const isMultiline = 'multiline' in props && props.multiline;
  const { multiline, rows = 4, resize = 'vertical', ...inputProps } = props as GlassTextareaProps;

  const getVariantStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      background: 'var(--bg-secondary)',
      border: '2px solid var(--border-primary)',
      borderRadius: 'var(--radius-md)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-family-primary)',
      transition: 'all var(--transition-fast)',
      backdropFilter: getBlurValue(),
      WebkitBackdropFilter: getBlurValue(),
      outline: 'none',
    };

    switch (variant) {
      case 'filled':
        return {
          ...baseStyles,
          background: 'rgba(255, 255, 255, 0.05)',
          border: '2px solid transparent',
        };
      
      case 'outlined':
        return {
          ...baseStyles,
          background: 'transparent',
          border: '2px solid var(--border-accent)',
        };
      
      default:
        return baseStyles;
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return {
          padding: leftIcon || rightIcon ? '8px 12px 8px 40px' : '8px 12px',
          fontSize: 'var(--font-size-sm)',
          minHeight: '36px',
        };
      
      case 'lg':
        return {
          padding: leftIcon || rightIcon ? '16px 20px 16px 52px' : '16px 20px',
          fontSize: 'var(--font-size-lg)',
          minHeight: '52px',
        };
      
      default:
        return {
          padding: leftIcon || rightIcon ? '12px 16px 12px 44px' : '12px 16px',
          fontSize: 'var(--font-size-base)',
          minHeight: '44px',
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

  const getIconSize = (): string => {
    switch (size) {
      case 'sm':
        return '16px';
      case 'lg':
        return '20px';
      default:
        return '18px';
    }
  };

  const getIconPosition = (): string => {
    switch (size) {
      case 'sm':
        return '12px';
      case 'lg':
        return '16px';
      default:
        return '14px';
    }
  };

  const inputStyle: React.CSSProperties = {
    ...getVariantStyles(),
    ...getSizeStyles(),
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'text',
    ...(isMultiline && {
      resize,
      minHeight: 'auto',
      height: 'auto',
      paddingTop: '12px',
      paddingBottom: '12px',
    }),
    ...style,
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    width: fullWidth ? '100%' : 'auto',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: 'var(--spacing-2)',
    color: error ? 'var(--color-error)' : 'var(--text-primary)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)',
  };

  const helperTextStyle: React.CSSProperties = {
    marginTop: 'var(--spacing-1)',
    fontSize: 'var(--font-size-xs)',
    color: error ? 'var(--color-error)' : 'var(--text-secondary)',
  };

  const iconStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: getIconSize(),
    color: 'var(--text-tertiary)',
    pointerEvents: 'none',
    zIndex: 1,
  };

  const leftIconStyle: React.CSSProperties = {
    ...iconStyle,
    left: getIconPosition(),
  };

  const rightIconStyle: React.CSSProperties = {
    ...iconStyle,
    right: getIconPosition(),
  };

  const InputComponent = isMultiline ? 'textarea' : 'input';

  return (
    <div className={`glass-input-container ${className}`} style={containerStyle}>
      {label && (
        <label style={labelStyle}>
          {label}
        </label>
      )}
      
      <div style={{ position: 'relative' }}>
        {leftIcon && (
          <div style={leftIconStyle}>
            {leftIcon}
          </div>
        )}
        
        <InputComponent
          ref={ref as any}
          className={`glass-input glass-input--${variant} glass-input--${size} ${error ? 'glass-input--error' : ''}`}
          style={inputStyle}
          disabled={disabled}
          {...(isMultiline ? { rows } : {})}
          {...(inputProps as any)}
        />
        
        {rightIcon && (
          <div style={rightIconStyle}>
            {rightIcon}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <div style={helperTextStyle}>
          {error || helperText}
        </div>
      )}
      
      {/* CSS-in-JS styles */}
      <style jsx>{`
        .glass-input:focus {
          border-color: var(--border-focus) !important;
          box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1) !important;
        }
        
        .glass-input--error {
          border-color: var(--color-error) !important;
        }
        
        .glass-input--error:focus {
          border-color: var(--color-error) !important;
          box-shadow: 0 0 0 3px rgba(255, 69, 58, 0.1) !important;
        }
        
        .glass-input::placeholder {
          color: var(--text-muted);
          opacity: 1;
        }
        
        .glass-input:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
        
        .glass-input--filled:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.08);
        }
        
        .glass-input--outlined:hover:not(:disabled) {
          border-color: var(--border-accent);
        }
        
        .glass-input:hover:not(:disabled):not(:focus) {
          border-color: var(--border-accent);
        }
      `}</style>
    </div>
  );
});

GlassInput.displayName = 'GlassInput';

export default GlassInput;
