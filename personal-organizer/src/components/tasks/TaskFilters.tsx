import React from 'react';
import { Chip } from '@/components/common';

export type TaskFilterType = 'view' | 'all' | 'critical' | 'useful' | 'custom';

export interface TaskFiltersProps {
  activeFilter: TaskFilterType;
  onFilterChange: (filter: TaskFilterType) => void;
  taskCounts?: {
    all: number;
    critical: number;
    useful: number;
  };
  className?: string;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  activeFilter,
  onFilterChange,
  taskCounts,
  className = '',
}) => {
  const filters: Array<{
    id: TaskFilterType;
    label: string;
    description: string;
    icon?: React.ReactNode;
  }> = [
    {
      id: 'view',
      label: 'View',
      description: 'View options',
      icon: (
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
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ),
    },
    {
      id: 'all',
      label: 'All',
      description: 'Show all tasks',
    },
    {
      id: 'critical',
      label: 'Critical',
      description: 'Show critical priority tasks',
    },
    {
      id: 'useful',
      label: 'Important',
      description: 'Show important priority tasks',
    },
    {
      id: 'custom',
      label: 'Custom',
      description: 'Custom filter options',
      icon: (
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
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
      ),
    },
  ];

  const handleFilterClick = (filterId: TaskFilterType): void => {
    onFilterChange(filterId);
  };

  const getFilterLabel = (filter: typeof filters[0]): string => {
    if (!taskCounts || filter.id === 'view' || filter.id === 'custom') {
      // For custom filter, return empty string to show only icon
      return filter.id === 'custom' ? '' : filter.label;
    }

    const count = taskCounts[filter.id as keyof typeof taskCounts];
    return count > 0 ? `${filter.label} (${count})` : filter.label;
  };

  const containerClasses = [
    'flex',
    'justify-between',
    'items-center',
    'overflow-x-auto',
    'pb-2',
    'mb-4',
    'scrollbar-hide',
    className,
  ].join(' ');

  const getFilterButtonClasses = (filter: typeof filters[0], isActive: boolean): string => {
    const baseClasses = [
      'px-3',
      'py-1',
      'text-secondary',
      'font-medium',
      'rounded-chip',
      'transition-all',
      'duration-200',
      'focus-ring',
      'flex',
      'items-center',
      'gap-2',
      'h-7', // Exactly halfway between h-5 (20px) and h-9 (36px) = 28px
    ];

    if (isActive) {
      baseClasses.push('font-bold'); // Preserve bold text for active states
      if (filter.id === 'critical') {
        baseClasses.push('bg-red-500', 'text-white');
      } else if (filter.id === 'useful') {
        baseClasses.push('bg-yellow-500', 'text-white');
      } else {
        // All and Custom use neutral gray
        baseClasses.push('bg-gray-500', 'text-white');
      }
    } else {
      // All inactive buttons use identical styling (same as Custom)
      baseClasses.push('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200');
    }

    return baseClasses.join(' ');
  };

  // Separate filters into left and right groups
  const leftFilters = filters.filter(f => f.id !== 'custom');
  const rightFilters = filters.filter(f => f.id === 'custom');

  return (
    <div className={containerClasses}>
      {/* Left-aligned filters: View, All, Critical, Useful */}
      <div className="flex gap-2">
        {leftFilters.map((filter) => {
          const isActive = activeFilter === filter.id;

          return (
            <button
              key={filter.id}
              className={getFilterButtonClasses(filter, isActive)}
              onClick={() => handleFilterClick(filter.id)}
              aria-label={filter.description}
            >
              {filter.icon && filter.icon}
              {getFilterLabel(filter) && <span>{getFilterLabel(filter)}</span>}
            </button>
          );
        })}
      </div>

      {/* Right-aligned filter: Custom */}
      <div className="flex gap-2">
        {rightFilters.map((filter) => {
          const isActive = activeFilter === filter.id;

          return (
            <button
              key={filter.id}
              className={getFilterButtonClasses(filter, isActive)}
              onClick={() => handleFilterClick(filter.id)}
              aria-label={filter.description}
            >
              {filter.icon && filter.icon}
              {getFilterLabel(filter) && <span>{getFilterLabel(filter)}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TaskFilters;
