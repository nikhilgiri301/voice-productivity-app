import React, { useState, useEffect, useRef, useCallback } from 'react';
import EventCard from './EventCard';
import { GlassCard } from '../glass';

interface EventListProps {
  events: ScheduleEvent[];
  onEventEdit?: (event: ScheduleEvent) => void;
  onEventDelete?: (eventId: string) => void;
  onEventStatusChange?: (eventId: string, status: EventStatus) => void;
  onLoadMore?: () => Promise<void>;
  loading?: boolean;
  hasMore?: boolean;
  enablePullToRefresh?: boolean;
  onRefresh?: () => Promise<void>;
  className?: string;
  style?: React.CSSProperties;
  compact?: boolean;
  groupByTime?: boolean;
}

interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  location?: string;
  type: 'meeting' | 'personal' | 'travel' | 'work';
  priority: 'high' | 'medium' | 'low';
  status: EventStatus;
  linkedItems?: LinkedItem[];
  attendees?: string[];
  isRecurring?: boolean;
  reminderMinutes?: number;
  date: string; // ISO date string
}

interface LinkedItem {
  id: string;
  type: 'task' | 'note';
  title: string;
  status?: 'completed' | 'pending';
}

type EventStatus = 'upcoming' | 'current' | 'completed' | 'cancelled';

interface TimeGroup {
  label: string;
  events: ScheduleEvent[];
}

export const EventList: React.FC<EventListProps> = ({
  events,
  onEventEdit,
  onEventDelete,
  onEventStatusChange,
  onLoadMore,
  loading = false,
  hasMore = false,
  enablePullToRefresh = true,
  onRefresh,
  className = '',
  style = {},
  compact = false,
  groupByTime = true,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [touchStart, setTouchStart] = useState<{ y: number; time: number } | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Set up infinite scroll
  useEffect(() => {
    if (!onLoadMore || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [onLoadMore, hasMore, loading]);

  // Pull to refresh handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!enablePullToRefresh || !listRef.current) return;
    
    const scrollTop = listRef.current.scrollTop;
    if (scrollTop > 0) return; // Only allow pull to refresh at top
    
    setTouchStart({
      y: e.touches[0].clientY,
      time: Date.now(),
    });
  }, [enablePullToRefresh]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart || !enablePullToRefresh) return;
    
    const currentY = e.touches[0].clientY;
    const distance = currentY - touchStart.y;
    
    if (distance > 0 && distance < 100) {
      setPullDistance(distance);
      e.preventDefault(); // Prevent default scroll
    }
  }, [touchStart, enablePullToRefresh]);

  const handleTouchEnd = useCallback(async () => {
    if (!touchStart || !enablePullToRefresh) return;
    
    if (pullDistance > 60 && onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setTouchStart(null);
    setPullDistance(0);
  }, [touchStart, pullDistance, enablePullToRefresh, onRefresh]);

  // Group events by time periods
  const groupEventsByTime = (events: ScheduleEvent[]): TimeGroup[] => {
    if (!groupByTime) {
      return [{ label: 'All Events', events }];
    }

    const now = new Date();
    const groups: { [key: string]: ScheduleEvent[] } = {
      'Current': [],
      'Upcoming Today': [],
      'Tomorrow': [],
      'This Week': [],
      'Later': [],
      'Past': [],
    };

    events.forEach(event => {
      const eventDate = new Date(event.date);
      const eventTime = new Date(`${event.date} ${event.startTime}`);
      
      if (event.status === 'current') {
        groups['Current'].push(event);
      } else if (event.status === 'completed' || event.status === 'cancelled') {
        groups['Past'].push(event);
      } else if (eventDate.toDateString() === now.toDateString()) {
        if (eventTime > now) {
          groups['Upcoming Today'].push(event);
        } else {
          groups['Past'].push(event);
        }
      } else if (eventDate.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString()) {
        groups['Tomorrow'].push(event);
      } else if (eventDate <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)) {
        groups['This Week'].push(event);
      } else if (eventDate > now) {
        groups['Later'].push(event);
      } else {
        groups['Past'].push(event);
      }
    });

    // Convert to array and filter empty groups
    return Object.entries(groups)
      .filter(([_, events]) => events.length > 0)
      .map(([label, events]) => ({
        label,
        events: events.sort((a, b) => {
          const timeA = new Date(`${a.date} ${a.startTime}`);
          const timeB = new Date(`${b.date} ${b.startTime}`);
          return timeA.getTime() - timeB.getTime();
        }),
      }));
  };

  // Sort events chronologically
  const sortedEvents = [...events].sort((a, b) => {
    const timeA = new Date(`${a.date} ${a.startTime}`);
    const timeB = new Date(`${b.date} ${b.startTime}`);
    return timeA.getTime() - timeB.getTime();
  });

  const eventGroups = groupEventsByTime(sortedEvents);

  // Empty state
  if (events.length === 0 && !loading) {
    return (
      <div className={`event-list event-list--empty ${className}`} style={style}>
        <GlassCard variant="subtle" padding="xl" style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '16px',
            opacity: 0.5,
          }}>
            📅
          </div>
          <h3 style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--text-primary)',
            margin: '0 0 8px 0',
          }}>
            No events scheduled
          </h3>
          <p style={{
            fontSize: 'var(--font-size-base)',
            color: 'var(--text-secondary)',
            margin: 0,
          }}>
            Your schedule is clear for this day. Use voice commands or the add button to create new events.
          </p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div
      ref={listRef}
      className={`event-list ${className}`}
      style={{
        height: '100%',
        overflowY: 'auto',
        position: 'relative',
        ...style,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to refresh indicator */}
      {enablePullToRefresh && (pullDistance > 0 || isRefreshing) && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-card)',
          borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
          transform: `translateY(${Math.min(pullDistance, 60) - 60}px)`,
          transition: isRefreshing ? 'transform 0.3s ease-out' : 'none',
          zIndex: 10,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-secondary)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-medium)',
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              border: '2px solid var(--accent-blue)',
              borderTopColor: 'transparent',
              animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
            }} />
            {isRefreshing ? 'Refreshing...' : pullDistance > 60 ? 'Release to refresh' : 'Pull to refresh'}
          </div>
        </div>
      )}

      {/* Event groups */}
      <div style={{
        padding: '16px',
        paddingTop: enablePullToRefresh ? '76px' : '16px',
      }}>
        {eventGroups.map((group, groupIndex) => (
          <div key={group.label} style={{ marginBottom: '32px' }}>
            {/* Group header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
              paddingBottom: '8px',
              borderBottom: '1px solid var(--border-secondary)',
            }}>
              <h3 style={{
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--text-primary)',
                margin: 0,
              }}>
                {group.label}
              </h3>
              <div style={{
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-tertiary)',
                color: 'var(--text-tertiary)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-medium)',
              }}>
                {group.events.length}
              </div>
            </div>

            {/* Events in group */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              {group.events.map((event, eventIndex) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEdit={onEventEdit}
                  onDelete={onEventDelete}
                  onStatusChange={onEventStatusChange}
                  compact={compact}
                  style={{
                    animationDelay: `${(groupIndex * 0.1) + (eventIndex * 0.05)}s`,
                    animation: 'slideInUp 0.3s ease-out both',
                  }}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '20px',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '3px solid var(--border-secondary)',
              borderTopColor: 'var(--accent-blue)',
              animation: 'spin 1s linear infinite',
            }} />
          </div>
        )}

        {/* Load more trigger */}
        {hasMore && !loading && (
          <div ref={loadMoreRef} style={{ height: '20px' }} />
        )}
      </div>

      {/* CSS-in-JS styles */}
      <style jsx>{`
        .event-list {
          scroll-behavior: smooth;
        }
        
        .event-list::-webkit-scrollbar {
          width: 6px;
        }
        
        .event-list::-webkit-scrollbar-track {
          background: var(--bg-secondary);
          border-radius: 3px;
        }
        
        .event-list::-webkit-scrollbar-thumb {
          background: var(--border-accent);
          border-radius: 3px;
        }
        
        .event-list::-webkit-scrollbar-thumb:hover {
          background: var(--text-tertiary);
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .event-list > div {
            padding: 12px;
          }
        }
        
        @media (max-width: 480px) {
          .event-list > div {
            padding: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default EventList;
