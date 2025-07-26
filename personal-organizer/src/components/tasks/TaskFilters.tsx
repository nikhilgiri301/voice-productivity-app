import React from 'react';
import { Chip } from '@/components/common';

export type TaskFilterType = 'all' | 'urgent' | 'important' | 'optional';

export interface TaskFiltersProps {
  activeFilter: TaskFilterType;
  onFilterChange: (filter: TaskFilterType) => void;
  taskCounts?: {
    all: number;
    urgent: number;
    important: number;
    optional: number;
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
    color?: 'urgent' | 'important' | 'optional';
  }> = [
    {
      id: 'all',
      label: 'All',
      description: 'Show all tasks',
    },
    {
      id: 'urgent',
      label: 'Urgent',
      description: 'Show urgent priority tasks',
      color: 'urgent',
    },
    {
      id: 'important',
      label: 'Important',
      description: 'Show important priority tasks',
      color: 'important',
    },
    {
      id: 'optional',
      label: 'Optional',
      description: 'Show optional priority tasks',
      color: 'optional',
    },
  ];

  const handleFilterClick = (filterId: TaskFilterType): void => {
    onFilterChange(filterId);
  };

  const getFilterLabel = (filter: typeof filters[0]): string => {
    if (!taskCounts) return filter.label;
    
    const count = taskCounts[filter.id];
    return count > 0 ? `${filter.label} (${count})` : filter.label;
  };

  const containerClasses = [
    'flex',
    'gap-2',
    'overflow-x-auto',
    'pb-2',
    'mb-4',
    'scrollbar-hide',
    className,
  ].join(' ');

  return (
    <div className={containerClasses}>
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        const hasCount = taskCounts && taskCounts[filter.id] > 0;
        
        return (
          <div key={filter.id} className="flex-shrink-0 relative">
            <Chip
              variant={filter.color ? 'priority' : 'filter'}
              {...(filter.color && { color: filter.color })}
              size="md"
              active={isActive}
              onClick={() => handleFilterClick(filter.id)}
              aria-label={filter.description}
              className={[
                'transition-all duration-200',
                isActive ? 'scale-105' : 'hover:scale-102',
                !isActive && filter.color ? 'opacity-80 hover:opacity-100' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {getFilterLabel(filter)}
            </Chip>
            
            {/* Priority indicator dot for non-active priority filters */}
            {!isActive && filter.color && hasCount && (
              <div
                className={[
                  'absolute',
                  '-top-1',
                  '-right-1',
                  'w-3',
                  'h-3',
                  'rounded-full',
                  'border-2',
                  'border-bg-primary',
                  filter.color === 'urgent' ? 'bg-priority-urgent' : '',
                  filter.color === 'important' ? 'bg-priority-important' : '',
                  filter.color === 'optional' ? 'bg-priority-optional' : '',
                ].join(' ')}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TaskFilters;
