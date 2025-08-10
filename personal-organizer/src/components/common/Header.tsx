import React, { useState, useEffect } from 'react';
import { IconButton, Chip } from '@/components/common';

export type ContextMode = 'work' | 'personal' | 'both';

export interface HeaderProps {
  currentContext?: ContextMode;
  onContextChange?: ((context: ContextMode) => void) | undefined;
  userName?: string;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  currentContext = 'both',
  onContextChange,
  userName = 'User',
  className = '',
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [greeting, setGreeting] = useState('');

  // Update date every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Generate greeting based on time of day
  useEffect(() => {
    const hour = currentDate.getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 17) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, [currentDate]);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleContextToggle = (context: ContextMode): void => {
    onContextChange?.(context);
  };

  // 3-Stage Toggle Switch
  const ThreeStageToggle: React.FC = () => {
    const handleToggleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;

      // Three zones: left (0-33%), middle (33-67%), right (67-100%)
      if (percentage < 0.33) {
        handleContextToggle('work');
      } else if (percentage > 0.67) {
        handleContextToggle('personal');
      } else {
        handleContextToggle('both');
      }
    };

    const getHandlePosition = () => {
      switch (currentContext) {
        case 'work': return '4px';
        case 'both': return 'calc(50% - 12px)'; // Center the 24px handle
        case 'personal': return 'calc(100% - 28px)'; // Right side with margin
        default: return '4px';
      }
    };

    const getHandleColor = () => {
      switch (currentContext) {
        case 'work': return '#2563eb';
        case 'both': return '#6b7280';
        case 'personal': return '#52c41a';
        default: return '#6b7280';
      }
    };

    const getTrackColor = () => {
      switch (currentContext) {
        case 'work': return 'rgba(37, 99, 235, 0.2)';
        case 'both': return 'rgba(107, 114, 128, 0.2)';
        case 'personal': return 'rgba(82, 196, 26, 0.2)';
        default: return 'rgba(107, 114, 128, 0.2)';
      }
    };

    const handleLabelClick = (context: 'work' | 'personal') => {
      if (currentContext === context) {
        // If already selected, go to center (both)
        handleContextToggle('both');
      } else {
        // If not selected, select this context
        handleContextToggle(context);
      }
    };

    const getLabelStyle = (context: 'work' | 'personal') => {
      const isSelected = currentContext === context;
      return {
        fontSize: '16px', // Same as task card titles
        fontWeight: isSelected ? '600' : '400', // Bold when selected, normal when not
        color: '#ffffff', // White text like task titles
        transition: 'font-weight 0.2s ease',
      };
    };

    const buttonStyle = {
      width: '60px', // Equal width for both buttons
      height: '32px', // Same height as toggle
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent', // Invisible button
      border: 'none', // No border
      cursor: 'pointer',
      padding: '0',
    };

    return (
      <div className="flex items-center justify-center">
        <button
          style={buttonStyle}
          onClick={() => handleLabelClick('work')}
        >
          <span style={getLabelStyle('work')}>Work</span>
        </button>

        <div className="relative mx-3">
          <div
            className="w-20 h-8 rounded-full cursor-pointer transition-all duration-200 border-2"
            style={{
              backgroundColor: getTrackColor(),
              borderColor: '#6b7280'
            }}
            onClick={handleToggleClick}
          >
            {/* Toggle Handle */}
            <div
              className="absolute top-1 w-6 h-6 rounded-full transition-all duration-300 shadow-sm"
              style={{
                left: getHandlePosition(),
                backgroundColor: getHandleColor(),
              }}
            />
          </div>
        </div>

        <button
          style={buttonStyle}
          onClick={() => handleLabelClick('personal')}
        >
          <span style={getLabelStyle('personal')}>Personal</span>
        </button>
      </div>
    );
  };

  const headerClasses = [
    'fixed',
    'top-0',
    'left-0',
    'right-0',
    'z-fixed',
    'bg-bg-primary',
    'bg-opacity-95',
    'backdrop-blur-glass',
    'border-b',
    'border-border-default',
    'px-screen-margin',
    'py-4',
    'safe-area-top',
    className,
  ].join(' ');

  return (
    <header className={headerClasses}>
      <div className='max-w-md mx-auto space-y-4'>
        {/* Top Row: Greeting and Settings */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-app-title text-text-primary'>
              {greeting}, {userName}
            </h1>
            <p className='text-secondary text-text-secondary'>
              {formatDate(currentDate)}
            </p>
          </div>

          <div className='flex items-center gap-2'>
            <p className='text-micro text-text-secondary'>
              {formatTime(currentDate)}
            </p>
            <IconButton
              variant='ghost'
              size='md'
              aria-label='Settings'
              onClick={() => {
                // Settings functionality will be added in later phases
                console.log('Settings clicked');
              }}
            >
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                />
              </svg>
            </IconButton>
          </div>
        </div>

        {/* Context 3-Stage Toggle */}
        <div className='flex items-center justify-center'>
          <ThreeStageToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
