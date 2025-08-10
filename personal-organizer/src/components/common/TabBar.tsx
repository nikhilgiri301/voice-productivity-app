import React from 'react';

export type TabId = 'schedule' | 'tasks' | 'voice' | 'notes' | 'tasks-beta';

export interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export interface TabBarProps {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
  className?: string;
}

const TabBar: React.FC<TabBarProps> = ({
  activeTab,
  onTabChange,
  className = '',
}) => {
  const enableBeta = import.meta.env.VITE_ENABLE_TASKS_BETA === 'true';

  const tabs: Tab[] = [
    {
      id: 'tasks',
      label: 'Agenda',
      icon: (
        <svg
          className='w-6 h-6'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 6v6l4 2m6-4a10 10 0 11-20 0 10 10 0 0120 0z'
          />
        </svg>
      ),
      badge: 3, // Example badge count
    },
    {
      id: 'schedule',
      label: 'Schedule',
      icon: (
        <svg
          className='w-6 h-6'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
          />
        </svg>
      ),
    },
    {
      id: 'voice',
      label: 'Voice',
      icon: (
        <svg
          className='w-6 h-6'
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
      ),
    },
    ...(enableBeta
      ? [
          {
            id: 'tasks-beta' as const,
            label: 'Tasks',
            icon: (
              <svg
                className='w-6 h-6'
                fill='currentColor'
                viewBox='0 0 28 28'
              >
                <path d="M4 5.25C4 3.45508 5.45507 2 7.25 2H20.75C22.5449 2 24 3.45507 24 5.25V17.3787C23.8796 17.4592 23.7653 17.5527 23.659 17.659L22.5 18.818V5.25C22.5 4.2835 21.7165 3.5 20.75 3.5H7.25C6.2835 3.5 5.5 4.2835 5.5 5.25V22.7497C5.5 23.7162 6.2835 24.4997 7.25 24.4997H15.3177L16.8177 25.9997H7.25C5.45507 25.9997 4 24.5446 4 22.7497V5.25Z"/>
                <path d="M10.5 8.75C10.5 9.44036 9.94036 10 9.25 10C8.55964 10 8 9.44036 8 8.75C8 8.05964 8.55964 7.5 9.25 7.5C9.94036 7.5 10.5 8.05964 10.5 8.75Z"/>
                <path d="M9.25 15.2498C9.94036 15.2498 10.5 14.6902 10.5 13.9998C10.5 13.3095 9.94036 12.7498 9.25 12.7498C8.55964 12.7498 8 13.3095 8 13.9998C8 14.6902 8.55964 15.2498 9.25 15.2498Z"/>
                <path d="M9.25 20.5C9.94036 20.5 10.5 19.9404 10.5 19.25C10.5 18.5596 9.94036 18 9.25 18C8.55964 18 8 18.5596 8 19.25C8 19.9404 8.55964 20.5 9.25 20.5Z"/>
                <path d="M12.75 8C12.3358 8 12 8.33579 12 8.75C12 9.16421 12.3358 9.5 12.75 9.5H19.25C19.6642 9.5 20 9.16421 20 8.75C20 8.33579 19.6642 8 19.25 8H12.75Z"/>
                <path d="M12 13.9998C12 13.5856 12.3358 13.2498 12.75 13.2498H19.25C19.6642 13.2498 20 13.5856 20 13.9998C20 14.414 19.6642 14.7498 19.25 14.7498H12.75C12.3358 14.7498 12 14.414 12 13.9998Z"/>
                <path d="M12.75 18.5C12.3358 18.5 12 18.8358 12 19.25C12 19.6642 12.3358 20 12.75 20H19.25C19.6642 20 20 19.6642 20 19.25C20 18.8358 19.6642 18.5 19.25 18.5H12.75Z"/>
                <path d="M25.7803 19.7803L19.7803 25.7803C19.6397 25.921 19.4489 26 19.25 26C19.0511 26 18.8603 25.921 18.7197 25.7803L15.7216 22.7823C15.4287 22.4894 15.4287 22.0145 15.7216 21.7216C16.0145 21.4287 16.4894 21.4287 16.7823 21.7216L19.25 24.1893L24.7197 18.7197C25.0126 18.4268 25.4874 18.4268 25.7803 18.7197C26.0732 19.0126 26.0732 19.4874 25.7803 19.7803Z"/>
              </svg>
            ),
          } as Tab,
        ]
      : []),
    {
      id: 'notes',
      label: 'Notes',
      icon: (
        <svg
          className='w-6 h-6'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
          />
        </svg>
      ),
    },
  ];

  const tabBarClasses = [
    'fixed',
    'bottom-0',
    'left-0',
    'right-0',
    'z-fixed',
    'bg-bg-primary',
    'bg-opacity-95',
    'backdrop-blur-glass',
    'border-t',
    'border-border-default',
    'px-screen-margin',
    'py-2',
    'safe-area-bottom',
    className,
  ].join(' ');

  const handleTabClick = (tabId: TabId): void => {
    onTabChange(tabId);
  };

  return (
    <nav className={tabBarClasses} role='tablist'>
      <div className='max-w-md mx-auto'>
        <div className='grid grid-cols-5 w-full'>
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;

            const tabClasses = [
              'w-full',
              'h-full',
              'flex',
              'flex-col',
              'items-center',
              'justify-center',
              'gap-1',
              'py-2',
              'transition-all',
              'duration-200',
              'focus-ring',
              'relative',
              'rounded-lg',
              isActive
                ? 'bg-text-secondary text-bg-primary'
                : 'text-text-secondary hover:text-text-primary',
            ].join(' ');

            return (
              <button
                key={tab.id}
                className={tabClasses}
                onClick={() => handleTabClick(tab.id)}
                role='tab'
                aria-selected={isActive}
                aria-controls={`${tab.id}-panel`}
                aria-label={`${tab.label} tab`}
              >
                {/* Icon with badge */}
                <div className='relative'>
                  <div
                    className={
                      isActive
                        ? 'scale-110'
                        : 'scale-100 transition-transform duration-200'
                    }
                  >
                    {tab.icon}
                  </div>
                  {tab.badge && tab.badge > 0 && (
                    <span className='absolute -top-2 -right-2 w-5 h-5 bg-accent text-white text-micro font-medium rounded-full flex items-center justify-center'>
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span className='text-micro font-medium'>{tab.label}</span>

                {/* Active indicator */}
                {isActive && (
                  <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-accent rounded-full animate-scale-in' />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default TabBar;
