import React, { ReactNode, useEffect, useState } from 'react';

interface HeaderContainerProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  sticky?: boolean;
  blur?: boolean;
  dynamicHeight?: boolean;
  safeAreaAware?: boolean;
  transparent?: boolean;
  onHeightChange?: (height: number) => void;
}

export const HeaderContainer: React.FC<HeaderContainerProps> = ({
  children,
  className = '',
  style = {},
  sticky = true,
  blur = true,
  dynamicHeight = true,
  safeAreaAware = true,
  transparent = false,
  onHeightChange,
}) => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = React.useRef<HTMLDivElement>(null);

  // Track scroll position for dynamic styling
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Measure header height for dynamic height feature
  useEffect(() => {
    if (!dynamicHeight || !headerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.contentRect.height;
        setHeaderHeight(height);
        onHeightChange?.(height);
      }
    });

    resizeObserver.observe(headerRef.current);
    return () => resizeObserver.disconnect();
  }, [dynamicHeight, onHeightChange]);

  // Get safe area styles for notched devices
  const getSafeAreaStyles = (): React.CSSProperties => {
    if (!safeAreaAware) return {};

    return {
      paddingTop: 'env(safe-area-inset-top, 0px)',
      paddingLeft: 'env(safe-area-inset-left, 0px)',
      paddingRight: 'env(safe-area-inset-right, 0px)',
    };
  };

  // Get backdrop blur styles
  const getBlurStyles = (): React.CSSProperties => {
    if (!blur) return {};

    return {
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)', // Safari support
    };
  };

  // Get dynamic background based on scroll state
  const getBackgroundStyles = (): React.CSSProperties => {
    if (transparent) {
      return {
        background: isScrolled 
          ? 'rgba(30, 30, 35, 0.95)' 
          : 'transparent',
      };
    }

    return {
      background: isScrolled 
        ? 'rgba(30, 30, 35, 0.95)' 
        : 'rgba(30, 30, 35, 0.8)',
    };
  };

  // Get border styles
  const getBorderStyles = (): React.CSSProperties => {
    return {
      borderBottom: isScrolled 
        ? '1px solid var(--border-primary)' 
        : '1px solid transparent',
    };
  };

  // Combine all styles
  const headerStyles: React.CSSProperties = {
    position: sticky ? 'sticky' : 'relative',
    top: sticky ? 0 : 'auto',
    left: 0,
    right: 0,
    zIndex: 'var(--z-sticky)',
    transition: 'all var(--transition-fast)',
    willChange: 'background-color, border-color, backdrop-filter',
    ...getSafeAreaStyles(),
    ...getBlurStyles(),
    ...getBackgroundStyles(),
    ...getBorderStyles(),
    ...style,
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`header-container ${isScrolled ? 'header-container--scrolled' : ''} ${className}`}
        style={headerStyles}
      >
        {/* Content wrapper for proper spacing */}
        <div
          style={{
            padding: '16px 24px',
            maxWidth: '100%',
            margin: '0 auto',
          }}
        >
          {children}
        </div>

        {/* Gradient overlay for enhanced visual separation */}
        {isScrolled && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
              pointerEvents: 'none',
            }}
          />
        )}
      </header>

      {/* Spacer for sticky headers to prevent content jump */}
      {sticky && dynamicHeight && headerHeight > 0 && (
        <div
          style={{
            height: `${headerHeight}px`,
            visibility: 'hidden',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />
      )}

      {/* CSS-in-JS styles for enhanced effects */}
      <style jsx>{`
        .header-container {
          transform: translate3d(0, 0, 0); /* Hardware acceleration */
        }
        
        .header-container--scrolled {
          box-shadow: var(--shadow-md);
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .header-container > div {
            padding: 12px 20px;
          }
        }
        
        @media (max-width: 480px) {
          .header-container > div {
            padding: 10px 16px;
          }
        }
        
        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .header-container {
            border-bottom: 2px solid var(--text-primary) !important;
          }
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .header-container {
            transition: none !important;
          }
        }
        
        /* Print styles */
        @media print {
          .header-container {
            position: static !important;
            background: white !important;
            backdrop-filter: none !important;
            box-shadow: none !important;
            border-bottom: 1px solid #000 !important;
          }
        }
      `}</style>
    </>
  );
};

export default HeaderContainer;
