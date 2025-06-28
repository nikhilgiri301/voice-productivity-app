import React, { useState, useEffect } from 'react';

interface DateDisplayProps {
  format?: 'full' | 'short' | 'minimal' | 'custom';
  customFormat?: Intl.DateTimeFormatOptions;
  timezone?: string;
  updateInterval?: number; // in milliseconds
  showTime?: boolean;
  showTimezone?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'tertiary' | 'custom';
  customColor?: string;
  animated?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (date: Date) => void;
}

export const DateDisplay: React.FC<DateDisplayProps> = ({
  format = 'full',
  customFormat,
  timezone,
  updateInterval = 60000, // Update every minute by default
  showTime = false,
  showTimezone = false,
  size = 'md',
  color = 'secondary',
  customColor,
  animated = true,
  className = '',
  style = {},
  onClick,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isVisible, setIsVisible] = useState(false);

  // Update date at specified interval
  useEffect(() => {
    const updateDate = () => setCurrentDate(new Date());
    
    // Update immediately
    updateDate();
    
    // Set up interval for updates
    const interval = setInterval(updateDate, updateInterval);
    
    return () => clearInterval(interval);
  }, [updateInterval]);

  // Fade in animation
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [animated]);

  // Get date format options
  const getFormatOptions = (): Intl.DateTimeFormatOptions => {
    if (customFormat) return customFormat;

    const baseOptions: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
    };

    switch (format) {
      case 'full':
        return {
          ...baseOptions,
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          ...(showTime && {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
      
      case 'short':
        return {
          ...baseOptions,
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          ...(showTime && {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
      
      case 'minimal':
        return {
          ...baseOptions,
          month: 'short',
          day: 'numeric',
          ...(showTime && {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
      
      default:
        return baseOptions;
    }
  };

  // Get timezone display
  const getTimezoneDisplay = (): string => {
    if (!showTimezone) return '';
    
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        timeZoneName: 'short',
      });
      
      const parts = formatter.formatToParts(currentDate);
      const timezonePart = parts.find(part => part.type === 'timeZoneName');
      
      return timezonePart ? ` ${timezonePart.value}` : '';
    } catch {
      return '';
    }
  };

  // Get text color
  const getTextColor = (): string => {
    if (customColor) return customColor;
    
    switch (color) {
      case 'primary':
        return 'var(--text-primary)';
      case 'tertiary':
        return 'var(--text-tertiary)';
      case 'custom':
        return customColor || 'var(--text-secondary)';
      default:
        return 'var(--text-secondary)';
    }
  };

  // Get font size
  const getFontSize = (): string => {
    switch (size) {
      case 'sm':
        return 'var(--font-size-sm)';
      case 'lg':
        return 'var(--font-size-lg)';
      default:
        return 'var(--font-size-base)';
    }
  };

  // Format the date
  const formatDate = (): string => {
    try {
      const options = getFormatOptions();
      const formattedDate = currentDate.toLocaleDateString('en-US', options);
      const timezoneDisplay = getTimezoneDisplay();
      
      return `${formattedDate}${timezoneDisplay}`;
    } catch (error) {
      console.warn('Date formatting error:', error);
      return currentDate.toLocaleDateString();
    }
  };

  // Component styles
  const dateStyles: React.CSSProperties = {
    fontSize: getFontSize(),
    fontWeight: 'var(--font-weight-medium)',
    color: getTextColor(),
    fontFamily: 'var(--font-family-primary)',
    lineHeight: 'var(--line-height-normal)',
    margin: 0,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
    transition: animated ? 'all var(--transition-normal)' : 'none',
    cursor: onClick ? 'pointer' : 'default',
    userSelect: 'none',
    ...style,
  };

  // Handle click
  const handleClick = () => {
    if (onClick) {
      onClick(currentDate);
    }
  };

  return (
    <time
      className={`date-display ${className}`}
      style={dateStyles}
      dateTime={currentDate.toISOString()}
      onClick={handleClick}
      onMouseEnter={(e) => {
        if (onClick && animated) {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.color = 'var(--text-primary)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick && animated) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.color = getTextColor();
        }
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {formatDate()}

      {/* CSS-in-JS styles for enhanced effects */}
      <style jsx>{`
        .date-display {
          position: relative;
        }
        
        /* Hover effect for clickable dates */
        .date-display:hover {
          ${onClick ? `
            color: var(--text-primary);
            transform: translateY(-1px);
          ` : ''}
        }
        
        /* Focus styles for accessibility */
        .date-display:focus {
          outline: 2px solid var(--accent-blue);
          outline-offset: 2px;
          border-radius: var(--radius-sm);
        }
        
        .date-display:focus:not(:focus-visible) {
          outline: none;
        }
        
        /* Active state */
        .date-display:active {
          ${onClick ? `
            transform: translateY(0);
            transition: transform var(--transition-fast);
          ` : ''}
        }
        
        /* Responsive font sizing */
        @media (max-width: 768px) {
          .date-display {
            font-size: ${size === 'lg' ? 'var(--font-size-base)' : 
                        size === 'md' ? 'var(--font-size-sm)' : 
                        'var(--font-size-xs)'};
          }
        }
        
        @media (max-width: 480px) {
          .date-display {
            font-size: ${size === 'lg' ? 'var(--font-size-sm)' : 
                        'var(--font-size-xs)'};
          }
        }
        
        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .date-display {
            color: var(--text-primary) !important;
            font-weight: var(--font-weight-semibold) !important;
          }
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .date-display {
            transition: none !important;
            transform: none !important;
          }
          
          .date-display:hover {
            transform: none !important;
          }
        }
        
        /* Print styles */
        @media print {
          .date-display {
            color: #000 !important;
            font-size: 12px !important;
          }
        }
      `}</style>
    </time>
  );
};

export default DateDisplay;
