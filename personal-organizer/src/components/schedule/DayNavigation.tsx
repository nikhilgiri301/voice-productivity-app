import React from 'react';
import { IconButton } from '@/components/common';

export interface DayNavigationProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  className?: string;
}

const DayNavigation: React.FC<DayNavigationProps> = ({
  currentDate,
  onDateChange,
  className = '',
}) => {
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatShortDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const navigateDay = (direction: 'prev' | 'next'): void => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    onDateChange(newDate);
  };

  const goToToday = (): void => {
    onDateChange(new Date());
  };

  const containerClasses = [
    'flex',
    'items-center',
    'justify-between',
    'p-4',
    'bg-bg-card',
    'rounded-card',
    'mb-4',
    className,
  ].join(' ');

  const dateDisplayClasses = [
    'flex',
    'flex-col',
    'items-center',
    'flex-1',
    'mx-4',
  ].join(' ');

  const mainDateClasses = [
    'text-card-title',
    'text-text-primary',
    'font-semibold',
    'text-center',
    'mb-1',
  ].join(' ');

  const shortDateClasses = [
    'text-micro',
    'text-text-secondary',
    isToday(currentDate) ? 'text-accent' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const todayButtonClasses = [
    'text-micro',
    'text-accent',
    'hover:text-accent',
    'hover:opacity-80',
    'transition-opacity',
    'duration-200',
    'cursor-pointer',
    'mt-1',
    isToday(currentDate) ? 'opacity-50 cursor-default' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      {/* Previous Day Button */}
      <IconButton
        variant="ghost"
        size="md"
        onClick={() => navigateDay('prev')}
        aria-label="Previous day"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </IconButton>

      {/* Date Display */}
      <div className={dateDisplayClasses}>
        <div className={mainDateClasses}>{formatDate(currentDate)}</div>
        <div className={shortDateClasses}>{formatShortDate(currentDate)}</div>
        {!isToday(currentDate) && (
          <button
            className={todayButtonClasses}
            onClick={goToToday}
            aria-label="Go to today"
          >
            Today
          </button>
        )}
      </div>

      {/* Next Day Button */}
      <IconButton
        variant="ghost"
        size="md"
        onClick={() => navigateDay('next')}
        aria-label="Next day"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </IconButton>
    </div>
  );
};

export default DayNavigation;
