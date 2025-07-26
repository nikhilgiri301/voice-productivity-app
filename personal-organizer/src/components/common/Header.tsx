import React, { useState, useEffect } from 'react';
import { IconButton, Chip } from '@/components/common';

export type ContextMode = 'work' | 'personal';

export interface HeaderProps {
  currentContext?: ContextMode;
  onContextChange?: ((context: ContextMode) => void) | undefined;
  userName?: string;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  currentContext = 'work',
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

        {/* Context Toggle */}
        <div className='flex items-center justify-between'>
          <div className='flex gap-2'>
            <Chip
              variant='context'
              color='work'
              size='md'
              active={currentContext === 'work'}
              onClick={() => handleContextToggle('work')}
            >
              Work
            </Chip>
            <Chip
              variant='context'
              color='personal'
              size='md'
              active={currentContext === 'personal'}
              onClick={() => handleContextToggle('personal')}
            >
              Personal
            </Chip>
          </div>

          {/* Voice Input Placeholder */}
          <IconButton
            variant='primary'
            size='md'
            aria-label='Voice input'
            onClick={() => {
              // Voice input functionality will be added in Phase 5
              console.log('Voice input clicked');
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
                d='M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z'
              />
            </svg>
          </IconButton>
        </div>
      </div>
    </header>
  );
};

export default Header;
