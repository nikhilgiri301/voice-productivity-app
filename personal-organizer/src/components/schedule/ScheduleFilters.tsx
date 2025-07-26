import React from 'react';
import { Chip } from '@/components/common';

export type ScheduleFilterType = 'all' | 'today' | 'this-week' | 'next-week';

export interface ScheduleFiltersProps {
  activeFilter: ScheduleFilterType;
  onFilterChange: (filter: ScheduleFilterType) => void;
  className?: string;
}

const ScheduleFilters: React.FC<ScheduleFiltersProps> = ({
  activeFilter,
  onFilterChange,
  className = '',
}) => {
  const filters: Array<{
    id: ScheduleFilterType;
    label: string;
    description: string;
  }> = [
    {
      id: 'all',
      label: 'All',
      description: 'Show all upcoming events',
    },
    {
      id: 'today',
      label: 'Today',
      description: 'Show today\'s events only',
    },
    {
      id: 'this-week',
      label: 'This Week',
      description: 'Show events for current week',
    },
    {
      id: 'next-week',
      label: 'Next Week',
      description: 'Show events for next week',
    },
  ];

  const handleFilterClick = (filterId: ScheduleFilterType): void => {
    onFilterChange(filterId);
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
      {filters.map((filter) => (
        <Chip
          key={filter.id}
          variant="filter"
          size="md"
          active={activeFilter === filter.id}
          onClick={() => handleFilterClick(filter.id)}
          aria-label={filter.description}
          className="flex-shrink-0"
        >
          {filter.label}
        </Chip>
      ))}
    </div>
  );
};

export default ScheduleFilters;
