import React from 'react';

interface AppTitleProps {
  title?: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  gradient?: 'primary' | 'blue' | 'green' | 'purple' | 'orange' | 'custom';
  customGradient?: string;
  animated?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const AppTitle: React.FC<AppTitleProps> = ({
  title = 'Personal Organizer',
  subtitle,
  size = 'lg',
  gradient = 'primary',
  customGradient,
  animated = true,
  className = '',
  style = {},
  onClick,
}) => {
  // Get gradient based on type
  const getGradient = (): string => {
    if (customGradient) return customGradient;
    
    switch (gradient) {
      case 'blue':
        return 'var(--gradient-blue)';
      case 'green':
        return 'var(--gradient-green)';
      case 'purple':
        return 'var(--gradient-purple)';
      case 'orange':
        return 'var(--gradient-orange)';
      default:
        return 'var(--gradient-primary)';
    }
  };

  // Get font size based on size prop
  const getFontSize = (): string => {
    switch (size) {
      case 'sm':
        return 'var(--font-size-xl)'; // 20px
      case 'md':
        return 'var(--font-size-2xl)'; // 24px
      case 'lg':
        return 'var(--font-size-3xl)'; // 28px
      case 'xl':
        return 'var(--font-size-4xl)'; // 32px
      default:
        return 'var(--font-size-3xl)';
    }
  };

  // Get subtitle font size
  const getSubtitleFontSize = (): string => {
    switch (size) {
      case 'sm':
        return 'var(--font-size-sm)'; // 14px
      case 'md':
        return 'var(--font-size-base)'; // 16px
      case 'lg':
        return 'var(--font-size-lg)'; // 18px
      case 'xl':
        return 'var(--font-size-xl)'; // 20px
      default:
        return 'var(--font-size-base)';
    }
  };

  // Title styles with gradient text
  const titleStyles: React.CSSProperties = {
    fontSize: getFontSize(),
    fontWeight: 'var(--font-weight-bold)',
    lineHeight: 'var(--line-height-tight)',
    margin: 0,
    background: getGradient(),
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    backgroundSize: '200% 200%',
    fontFamily: 'var(--font-family-primary)',
    letterSpacing: '-0.02em',
    cursor: onClick ? 'pointer' : 'default',
    transition: animated ? 'all var(--transition-fast)' : 'none',
    ...(animated && {
      animation: 'gradientShift 6s ease-in-out infinite',
    }),
    ...style,
  };

  // Subtitle styles
  const subtitleStyles: React.CSSProperties = {
    fontSize: getSubtitleFontSize(),
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--text-secondary)',
    margin: '4px 0 0 0',
    lineHeight: 'var(--line-height-normal)',
    fontFamily: 'var(--font-family-primary)',
  };

  // Container styles
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  };

  return (
    <div 
      className={`app-title ${className}`}
      style={containerStyles}
      onClick={onClick}
    >
      <h1 
        className="app-title__main"
        style={titleStyles}
        onMouseEnter={(e) => {
          if (onClick && animated) {
            e.currentTarget.style.transform = 'scale(1.02)';
          }
        }}
        onMouseLeave={(e) => {
          if (onClick && animated) {
            e.currentTarget.style.transform = 'scale(1)';
          }
        }}
      >
        {title}
      </h1>
      
      {subtitle && (
        <p 
          className="app-title__subtitle"
          style={subtitleStyles}
        >
          {subtitle}
        </p>
      )}

      {/* CSS-in-JS styles for animations and responsive design */}
      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .app-title__main {
          /* Fallback for browsers that don't support background-clip */
          color: var(--text-primary);
        }
        
        /* Ensure gradient text works across browsers */
        @supports (-webkit-background-clip: text) {
          .app-title__main {
            color: transparent;
          }
        }
        
        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .app-title__main {
            background: none !important;
            color: var(--text-primary) !important;
            -webkit-text-fill-color: var(--text-primary) !important;
          }
        }
        
        /* Responsive font sizing */
        @media (max-width: 768px) {
          .app-title__main {
            font-size: ${size === 'xl' ? 'var(--font-size-3xl)' : 
                        size === 'lg' ? 'var(--font-size-2xl)' : 
                        size === 'md' ? 'var(--font-size-xl)' : 
                        'var(--font-size-lg)'};
          }
          
          .app-title__subtitle {
            font-size: ${size === 'xl' ? 'var(--font-size-lg)' : 
                        size === 'lg' ? 'var(--font-size-base)' : 
                        size === 'md' ? 'var(--font-size-sm)' : 
                        'var(--font-size-xs)'};
          }
        }
        
        @media (max-width: 480px) {
          .app-title__main {
            font-size: ${size === 'xl' ? 'var(--font-size-2xl)' : 
                        size === 'lg' ? 'var(--font-size-xl)' : 
                        size === 'md' ? 'var(--font-size-lg)' : 
                        'var(--font-size-base)'};
          }
          
          .app-title__subtitle {
            font-size: ${size === 'xl' ? 'var(--font-size-base)' : 
                        size === 'lg' ? 'var(--font-size-sm)' : 
                        'var(--font-size-xs)'};
          }
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .app-title__main {
            animation: none !important;
          }
        }
        
        /* Print styles */
        @media print {
          .app-title__main {
            background: none !important;
            color: #000 !important;
            -webkit-text-fill-color: #000 !important;
            animation: none !important;
          }
          
          .app-title__subtitle {
            color: #666 !important;
          }
        }
        
        /* Focus styles for accessibility */
        .app-title:focus-within .app-title__main {
          outline: 2px solid var(--accent-blue);
          outline-offset: 2px;
          border-radius: var(--radius-sm);
        }
      `}</style>
    </div>
  );
};

export default AppTitle;
