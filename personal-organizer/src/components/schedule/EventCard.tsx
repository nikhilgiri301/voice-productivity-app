import React from 'react';
import { Card, Chip } from '@/components/common';

export interface EventData {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  context: 'work' | 'personal';
  linkedItems?: Array<{
    id: string;
    title: string;
    type: 'task' | 'note';
  }>;
}

export interface EventCardProps {
  event: EventData;
  onClick?: (event: EventData) => void;
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onClick,
  className = '',
}) => {
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDuration = (start: Date, end: Date): string => {
    const durationMs = end.getTime() - start.getTime();
    const durationMinutes = Math.floor(durationMs / (1000 * 60));
    
    if (durationMinutes < 60) {
      return `${durationMinutes}m`;
    }
    
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    if (minutes === 0) {
      return `${hours}h`;
    }
    
    return `${hours}h ${minutes}m`;
  };

  const getContextBorderColor = (context: 'work' | 'personal'): string => {
    return context === 'work' ? 'border-l-context-work' : 'border-l-context-personal';
  };

  const handleClick = (): void => {
    onClick?.(event);
  };

  const cardClasses = [
    'border-l-4',
    getContextBorderColor(event.context),
    className,
  ].join(' ');

  const timeBlockClasses = [
    'flex',
    'items-center',
    'gap-2',
    'mb-2',
    'text-secondary',
    'text-text-secondary',
  ].join(' ');

  const timeClasses = [
    'font-medium',
    'text-text-primary',
  ].join(' ');

  const durationClasses = [
    'px-2',
    'py-1',
    'bg-bg-tertiary',
    'rounded-chip',
    'text-micro',
    'text-text-secondary',
  ].join(' ');

  const titleClasses = [
    'text-card-title',
    'text-text-primary',
    'font-semibold',
    'mb-1',
    'line-clamp-2',
  ].join(' ');

  const descriptionClasses = [
    'text-body',
    'text-text-secondary',
    'mb-3',
    'line-clamp-2',
  ].join(' ');

  const locationClasses = [
    'flex',
    'items-center',
    'gap-1',
    'text-secondary',
    'text-text-secondary',
    'mb-3',
  ].join(' ');

  const linkedItemsClasses = [
    'flex',
    'flex-wrap',
    'gap-1',
    'mt-2',
  ].join(' ');

  return (
    <Card
      variant="glass"
      padding="md"
      className={cardClasses}
      onClick={handleClick}
      hoverable={!!onClick}
      {...(onClick && {
        role: 'button',
        'aria-label': `View event: ${event.title}`
      })}
    >
      {/* Time Block */}
      <div className={timeBlockClasses}>
        <span className={timeClasses}>
          {formatTime(event.startTime)} - {formatTime(event.endTime)}
        </span>
        <span className={durationClasses}>
          {formatDuration(event.startTime, event.endTime)}
        </span>
      </div>

      {/* Event Title */}
      <h3 className={titleClasses}>{event.title}</h3>

      {/* Event Description */}
      {event.description && (
        <p className={descriptionClasses}>{event.description}</p>
      )}

      {/* Location */}
      {event.location && (
        <div className={locationClasses}>
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="truncate">{event.location}</span>
        </div>
      )}

      {/* Context Indicator */}
      <div className="flex items-center justify-between">
        <Chip
          variant="context"
          color={event.context}
          size="sm"
          className="capitalize"
        >
          {event.context}
        </Chip>

        {/* Linked Items Count */}
        {event.linkedItems && event.linkedItems.length > 0 && (
          <div className="flex items-center gap-1 text-micro text-text-secondary">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            <span>{event.linkedItems.length}</span>
          </div>
        )}
      </div>

      {/* Linked Items Preview */}
      {event.linkedItems && event.linkedItems.length > 0 && (
        <div className={linkedItemsClasses}>
          {event.linkedItems.slice(0, 3).map((item) => (
            <Chip
              key={item.id}
              variant="tag"
              size="sm"
              className="text-micro"
            >
              {item.type === 'task' ? '✓' : '📝'} {item.title}
            </Chip>
          ))}
          {event.linkedItems.length > 3 && (
            <Chip variant="tag" size="sm" className="text-micro">
              +{event.linkedItems.length - 3} more
            </Chip>
          )}
        </div>
      )}
    </Card>
  );
};

export default EventCard;
