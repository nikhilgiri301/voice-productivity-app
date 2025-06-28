import React from 'react';
import { useTabNavigation, TabType } from '../contexts/TabNavigationContext';

// Tab configuration with icons and labels
const TAB_CONFIG = {
  schedule: {
    label: 'Schedule',
    icon: '📅',
    activeColor: 'var(--accent-blue)',
    gradient: 'var(--gradient-blue)',
  },
  tasks: {
    label: 'Tasks',
    icon: '✅',
    activeColor: 'var(--accent-green)',
    gradient: 'var(--gradient-green)',
  },
  notes: {
    label: 'Notes',
    icon: '📝',
    activeColor: 'var(--accent-purple)',
    gradient: 'var(--gradient-purple)',
  },
} as const;

interface TabBarProps {
  className?: string;
  style?: React.CSSProperties;
  showLabels?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
}

export const TabBar: React.FC<TabBarProps> = ({
  className = '',
  style = {},
  showLabels = true,
  variant = 'default',
}) => {
  const { activeTab, switchToTab, isTabActive } = useTabNavigation();

  const handleTabClick = (tab: TabType) => {
    // Add haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    switchToTab(tab);
  };

  const getTabStyle = (tab: TabType, isActive: boolean) => {
    const config = TAB_CONFIG[tab];
    
    const baseStyle: React.CSSProperties = {
      flex: 1,
      display: 'flex',
      flexDirection: variant === 'compact' ? 'row' : 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: variant === 'compact' ? '8px' : '4px',
      padding: variant === 'minimal' ? '8px 12px' : '12px 16px',
      minHeight: '44px', // Touch-friendly minimum
      background: isActive 
        ? `linear-gradient(135deg, ${config.activeColor}15 0%, ${config.activeColor}08 100%)`
        : 'transparent',
      border: isActive 
        ? `2px solid ${config.activeColor}40`
        : '2px solid transparent',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      transition: 'all var(--transition-fast)',
      position: 'relative',
      overflow: 'hidden',
    };

    return baseStyle;
  };

  const getIconStyle = (tab: TabType, isActive: boolean) => {
    const config = TAB_CONFIG[tab];
    
    return {
      fontSize: variant === 'minimal' ? '16px' : '20px',
      filter: isActive ? 'none' : 'grayscale(0.3) opacity(0.7)',
      transition: 'all var(--transition-fast)',
      transform: isActive ? 'scale(1.1)' : 'scale(1)',
    };
  };

  const getLabelStyle = (tab: TabType, isActive: boolean) => {
    const config = TAB_CONFIG[tab];
    
    return {
      fontSize: variant === 'compact' ? '14px' : '12px',
      fontWeight: isActive ? '600' : '500',
      color: isActive ? config.activeColor : 'var(--text-secondary)',
      transition: 'all var(--transition-fast)',
      textAlign: 'center' as const,
      whiteSpace: 'nowrap' as const,
    };
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-lg)',
    padding: '8px',
    gap: '4px',
    boxShadow: 'var(--shadow-md)',
    border: '1px solid var(--border-primary)',
    backdropFilter: 'blur(20px)',
    position: 'sticky',
    bottom: '24px',
    zIndex: 100,
    ...style,
  };

  return (
    <div 
      className={`tab-bar ${className}`}
      style={containerStyle}
    >
      {(Object.keys(TAB_CONFIG) as TabType[]).map((tab) => {
        const config = TAB_CONFIG[tab];
        const isActive = isTabActive(tab);
        
        return (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            style={getTabStyle(tab, isActive)}
            className="tab-button"
            aria-label={`Switch to ${config.label} tab`}
            aria-pressed={isActive}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = `${config.activeColor}10`;
                e.currentTarget.style.borderColor = `${config.activeColor}20`;
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'transparent';
              }
            }}
            onTouchStart={(e) => {
              // Add touch feedback
              e.currentTarget.style.transform = 'scale(0.95)';
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {/* Active indicator */}
            {isActive && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: config.gradient,
                  borderRadius: '2px 2px 0 0',
                  animation: 'slideIn 0.3s ease-out',
                }}
              />
            )}
            
            {/* Icon */}
            <span style={getIconStyle(tab, isActive)}>
              {config.icon}
            </span>
            
            {/* Label */}
            {showLabels && (
              <span style={getLabelStyle(tab, isActive)}>
                {config.label}
              </span>
            )}
            
            {/* Ripple effect container */}
            <div
              className="ripple-container"
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
          </button>
        );
      })}
      
      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: scaleX(0);
            opacity: 0;
          }
          to {
            transform: scaleX(1);
            opacity: 1;
          }
        }
        
        .tab-button:active {
          transform: scale(0.95);
        }
        
        .tab-button:focus {
          outline: 2px solid var(--accent-blue);
          outline-offset: 2px;
        }
        
        .tab-button:focus:not(:focus-visible) {
          outline: none;
        }
        
        /* Responsive design */
        @media (max-width: 480px) {
          .tab-bar {
            padding: 6px;
            gap: 2px;
          }
          
          .tab-button {
            padding: 8px 12px;
            min-height: 40px;
          }
        }
        
        @media (max-width: 320px) {
          .tab-button span:last-child {
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default TabBar;
