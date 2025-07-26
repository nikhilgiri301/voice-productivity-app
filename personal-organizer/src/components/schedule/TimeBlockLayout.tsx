import React from 'react';
import EventCard, { type EventData } from './EventCard';

export interface TimeBlockLayoutProps {
  events: EventData[];
  onEventClick?: (event: EventData) => void;
  className?: string;
}

interface TimeSlot {
  hour: number;
  events: EventData[];
}

const TimeBlockLayout: React.FC<TimeBlockLayoutProps> = ({
  events,
  onEventClick,
  className = '',
}) => {
  // Group events by hour for time-based layout
  const groupEventsByHour = (eventList: EventData[]): TimeSlot[] => {
    const timeSlots: { [hour: number]: EventData[] } = {};
    
    // Initialize time slots from 6 AM to 11 PM
    for (let hour = 6; hour <= 23; hour++) {
      timeSlots[hour] = [];
    }
    
    // Group events by their start hour
    eventList.forEach((event) => {
      const startHour = event.startTime.getHours();
      if (timeSlots[startHour]) {
        timeSlots[startHour].push(event);
      }
    });
    
    // Convert to array and filter out empty slots
    return Object.entries(timeSlots)
      .map(([hour, slotEvents]) => ({
        hour: parseInt(hour),
        events: slotEvents,
      }))
      .filter((slot) => slot.events.length > 0);
  };

  const formatHour = (hour: number): string => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  const timeSlots = groupEventsByHour(events);

  const containerClasses = [
    'space-y-6',
    className,
  ].join(' ');

  const timeSlotClasses = [
    'relative',
  ].join(' ');

  const timeHeaderClasses = [
    'flex',
    'items-center',
    'mb-3',
    'text-secondary',
    'text-text-secondary',
    'font-medium',
  ].join(' ');

  const timeLineClasses = [
    'w-2',
    'h-2',
    'bg-accent',
    'rounded-full',
    'mr-3',
    'flex-shrink-0',
  ].join(' ');

  const eventsContainerClasses = [
    'space-y-3',
    'ml-5',
  ].join(' ');

  const noEventsClasses = [
    'text-center',
    'py-12',
    'text-text-secondary',
  ].join(' ');

  const noEventsIconClasses = [
    'w-16',
    'h-16',
    'mx-auto',
    'mb-4',
    'text-text-secondary',
    'opacity-50',
  ].join(' ');

  if (timeSlots.length === 0) {
    return (
      <div className={containerClasses}>
        <div className={noEventsClasses}>
          <svg
            className={noEventsIconClasses}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-card-title text-text-primary mb-2">
            No events scheduled
          </h3>
          <p className="text-body text-text-secondary">
            Your day is free! Add some events to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {timeSlots.map((slot) => (
        <div key={slot.hour} className={timeSlotClasses}>
          {/* Time Header */}
          <div className={timeHeaderClasses}>
            <div className={timeLineClasses}></div>
            <span>{formatHour(slot.hour)}</span>
          </div>
          
          {/* Events for this time slot */}
          <div className={eventsContainerClasses}>
            {slot.events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                {...(onEventClick && { onClick: onEventClick })}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimeBlockLayout;
