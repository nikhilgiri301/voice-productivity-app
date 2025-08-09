import React from 'react';

export type TabId = 'schedule' | 'tasks' | 'notes' | 'tasks-beta';

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
      id: 'tasks',
      label: 'Tasks',
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
            d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
          />
        </svg>
      ),
      badge: 3, // Example badge count
    },
    ...(enableBeta
      ? [
          {
            id: 'tasks-beta' as const,
            label: 'Tasks (Beta)',
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
        <div className='flex justify-around'>
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;

            const tabClasses = [
              'touch-target',
              'flex',
              'flex-col',
              'items-center',
              'justify-center',
              'gap-1',
              'px-3',
              'py-2',
              'rounded-button',
              'transition-all',
              'duration-200',
              'focus-ring',
              'relative',
              isActive
                ? 'text-accent'
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
