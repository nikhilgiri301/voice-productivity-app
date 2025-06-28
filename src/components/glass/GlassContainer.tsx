import React, { ReactNode, forwardRef } from 'react';

interface GlassContainerProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'default' | 'modal' | 'sidebar' | 'header' | 'footer';
  blur?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  opacity?: number;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  maxWidth?: string | number;
  centered?: boolean;
  fullHeight?: boolean;
  sticky?: boolean;
  zIndex?: number;
}

export const GlassContainer = forwardRef<HTMLDivElement, GlassContainerProps>(({
  children,
  className = '',
  style = {},
  variant = 'default',
  blur = 'md',
  opacity = 0.9,
  padding = 'md',
  maxWidth,
  centered = false,
  fullHeight = false,
  sticky = false,
  zIndex,
}, ref) => {
  const getVariantStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      background: `rgba(30, 30, 35, ${opacity})`,
      backdropFilter: getBlurValue(),
      WebkitBackdropFilter: getBlurValue(),
      border: '1px solid var(--border-primary)',
      borderRadius: 'var(--radius-lg)',
      transition: 'all var(--transition-fast)',
    };

    switch (variant) {
      case 'modal':
        return {
          ...baseStyles,
          background: `rgba(30, 30, 35, ${Math.min(opacity + 0.1, 1)})`,
          boxShadow: 'var(--shadow-2xl)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 'var(--radius-xl)',
        };
      
      case 'sidebar':
        return {
          ...baseStyles,
          background: `rgba(26, 26, 29, ${opacity})`,
          borderRadius: '0',
          borderLeft: 'none',
          borderTop: 'none',
          borderBottom: 'none',
          boxShadow: 'var(--shadow-lg)',
        };
      
      case 'header':
        return {
          ...baseStyles,
          background: `rgba(30, 30, 35, ${Math.min(opacity + 0.05, 1)})`,
          borderRadius: '0',
          borderLeft: 'none',
          borderRight: 'none',
          borderTop: 'none',
          boxShadow: 'var(--shadow-md)',
          position: sticky ? 'sticky' : 'relative',
          top: sticky ? '0' : 'auto',
          zIndex: sticky ? 'var(--z-sticky)' : 'auto',
        };
      
      case 'footer':
        return {
          ...baseStyles,
          background: `rgba(30, 30, 35, ${Math.min(opacity + 0.05, 1)})`,
          borderRadius: '0',
          borderLeft: 'none',
          borderRight: 'none',
          borderBottom: 'none',
          boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.4)',
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
      case 'xl':
        return 'blur(48px)';
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

  const getLayoutStyles = (): React.CSSProperties => {
    const layoutStyles: React.CSSProperties = {};

    if (maxWidth) {
      layoutStyles.maxWidth = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;
    }

    if (centered) {
      layoutStyles.margin = '0 auto';
    }

    if (fullHeight) {
      layoutStyles.minHeight = '100vh';
    }

    if (zIndex !== undefined) {
      layoutStyles.zIndex = zIndex;
    }

    return layoutStyles;
  };

  const containerStyle: React.CSSProperties = {
    ...getVariantStyles(),
    ...getLayoutStyles(),
    padding: getPaddingValue(),
    ...style,
  };

  return (
    <div
      ref={ref}
      className={`glass-container glass-container--${variant} ${centered ? 'glass-container--centered' : ''} ${fullHeight ? 'glass-container--full-height' : ''} ${className}`}
      style={containerStyle}
    >
      {children}
      
      {/* CSS-in-JS styles for additional effects */}
      <style jsx>{`
        .glass-container {
          position: relative;
          overflow: hidden;
        }
        
        .glass-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          pointer-events: none;
        }
        
        .glass-container--modal {
          position: relative;
          z-index: var(--z-modal);
        }
        
        .glass-container--sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          z-index: var(--z-sidebar, 1100);
        }
        
        .glass-container--header {
          position: ${sticky ? 'sticky' : 'relative'};
          top: ${sticky ? '0' : 'auto'};
          z-index: ${sticky ? 'var(--z-sticky)' : 'auto'};
        }
        
        .glass-container--footer {
          position: relative;
          z-index: var(--z-docked);
        }
        
        .glass-container--centered {
          margin-left: auto;
          margin-right: auto;
        }
        
        .glass-container--full-height {
          min-height: 100vh;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .glass-container {
            border-radius: var(--radius-md);
          }
          
          .glass-container--modal {
            margin: var(--spacing-4);
            max-width: calc(100vw - var(--spacing-8));
          }
        }
        
        @media (max-width: 480px) {
          .glass-container {
            border-radius: var(--radius-sm);
          }
        }
      `}</style>
    </div>
  );
});

GlassContainer.displayName = 'GlassContainer';

export default GlassContainer;
