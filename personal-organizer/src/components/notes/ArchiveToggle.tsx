import React from 'react';

export type ViewMode = 'active' | 'archived';

export interface ArchiveToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  activeCounts?: {
    active: number;
    archived: number;
  };
  className?: string;
}

const ArchiveToggle: React.FC<ArchiveToggleProps> = ({
  currentView,
  onViewChange,
  activeCounts,
  className = '',
}) => {
  const handleViewChange = (view: ViewMode): void => {
    onViewChange(view);
  };

  const containerClasses = [
    'flex',
    'bg-bg-card',
    'rounded-button',
    'border',
    'border-border-default',
    'p-1',
    'relative',
    'overflow-hidden',
    className,
  ].join(' ');

  const buttonClasses = (_view: ViewMode, isActive: boolean) => [
    'flex-1',
    'flex',
    'items-center',
    'justify-center',
    'gap-2',
    'px-4',
    'py-2',
    'rounded-button',
    'text-secondary',
    'font-medium',
    'transition-all',
    'duration-200',
    'relative',
    'z-10',
    'touch-target',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-accent',
    'focus:ring-opacity-50',
    isActive
      ? 'text-white'
      : 'text-text-secondary hover:text-text-primary',
  ].join(' ');

  const getViewIcon = (view: ViewMode): React.ReactNode => {
    if (view === 'active') {
      return (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      );
    }

    return (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 8l6 6m0 0l6-6m-6 6V3"
        />
      </svg>
    );
  };

  const getViewLabel = (view: ViewMode): string => {
    const count = activeCounts?.[view];
    const baseLabel = view === 'active' ? 'Active' : 'Archived';
    
    if (count !== undefined && count > 0) {
      return `${baseLabel} (${count})`;
    }
    
    return baseLabel;
  };

  const sliderClasses = [
    'absolute',
    'top-1',
    'bottom-1',
    'w-1/2',
    'bg-accent',
    'rounded-button',
    'transition-transform',
    'duration-200',
    'ease-out',
    'z-0',
    currentView === 'archived' ? 'translate-x-full' : 'translate-x-0',
  ].join(' ');

  return (
    <div className={containerClasses} role="tablist">
      {/* Sliding Background */}
      <div className={sliderClasses} />

      {/* Active View Button */}
      <button
        className={buttonClasses('active', currentView === 'active')}
        onClick={() => handleViewChange('active')}
        role="tab"
        aria-selected={currentView === 'active'}
        aria-controls="notes-content"
        aria-label="View active notes"
      >
        {getViewIcon('active')}
        <span>{getViewLabel('active')}</span>
      </button>

      {/* Archived View Button */}
      <button
        className={buttonClasses('archived', currentView === 'archived')}
        onClick={() => handleViewChange('archived')}
        role="tab"
        aria-selected={currentView === 'archived'}
        aria-controls="notes-content"
        aria-label="View archived notes"
      >
        {getViewIcon('archived')}
        <span>{getViewLabel('archived')}</span>
      </button>
    </div>
  );
};

export default ArchiveToggle;
