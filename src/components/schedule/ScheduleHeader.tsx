import React, { useState } from 'react';
import { GlassButton, GlassCard } from '../glass';

interface ScheduleHeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onFilterChange?: (filters: ScheduleFilters) => void;
  className?: string;
  style?: React.CSSProperties;
}

interface ScheduleFilters {
  showCompleted: boolean;
  eventTypes: string[];
  priorities: string[];
}

const EVENT_TYPES = [
  { id: 'meeting', label: 'Meetings', icon: '👥', color: 'var(--accent-blue)' },
  { id: 'personal', label: 'Personal', icon: '🏃', color: 'var(--accent-green)' },
  { id: 'travel', label: 'Travel', icon: '✈️', color: 'var(--accent-orange)' },
  { id: 'work', label: 'Work', icon: '💼', color: 'var(--accent-purple)' },
];

const PRIORITY_LEVELS = [
  { id: 'high', label: 'High', color: 'var(--accent-red)' },
  { id: 'medium', label: 'Medium', color: 'var(--accent-orange)' },
  { id: 'low', label: 'Low', color: 'var(--accent-green)' },
];

export const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({
  currentDate,
  onDateChange,
  onFilterChange,
  className = '',
  style = {},
}) => {
  const [filters, setFilters] = useState<ScheduleFilters>({
    showCompleted: true,
    eventTypes: EVENT_TYPES.map(type => type.id),
    priorities: PRIORITY_LEVELS.map(priority => priority.id),
  });
  const [showFilters, setShowFilters] = useState(false);

  // Navigation functions
  const goToPreviousDay = () => {
    const previousDay = new Date(currentDate);
    previousDay.setDate(previousDay.getDate() - 1);
    onDateChange(previousDay);
  };

  const goToNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    onDateChange(nextDay);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  // Date formatting
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
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
    return date.toDateString() === today.toDateString();
  };

  // Filter functions
  const toggleEventType = (typeId: string) => {
    const newEventTypes = filters.eventTypes.includes(typeId)
      ? filters.eventTypes.filter(id => id !== typeId)
      : [...filters.eventTypes, typeId];
    
    const newFilters = { ...filters, eventTypes: newEventTypes };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const togglePriority = (priorityId: string) => {
    const newPriorities = filters.priorities.includes(priorityId)
      ? filters.priorities.filter(id => id !== priorityId)
      : [...filters.priorities, priorityId];
    
    const newFilters = { ...filters, priorities: newPriorities };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const toggleShowCompleted = () => {
    const newFilters = { ...filters, showCompleted: !filters.showCompleted };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <div className={`schedule-header ${className}`} style={style}>
      {/* Main navigation bar */}
      <GlassCard variant="elevated" padding="md" style={{ marginBottom: '16px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
        }}>
          {/* Date navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={goToPreviousDay}
              leftIcon="←"
            >
              Previous
            </GlassButton>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: '200px',
            }}>
              <h2 style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--text-primary)',
                margin: 0,
                textAlign: 'center',
              }}>
                {formatShortDate(currentDate)}
              </h2>
              <p style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--text-secondary)',
                margin: 0,
                textAlign: 'center',
              }}>
                {formatDate(currentDate)}
              </p>
            </div>
            
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={goToNextDay}
              rightIcon="→"
            >
              Next
            </GlassButton>
          </div>

          {/* Action buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            {!isToday(currentDate) && (
              <GlassButton
                variant="secondary"
                size="sm"
                onClick={goToToday}
              >
                Today
              </GlassButton>
            )}
            
            <GlassButton
              variant={showFilters ? "primary" : "ghost"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              leftIcon="🔍"
            >
              Filters
            </GlassButton>
          </div>
        </div>
      </GlassCard>

      {/* Filter panel */}
      {showFilters && (
        <GlassCard 
          variant="subtle" 
          padding="md" 
          style={{ 
            marginBottom: '16px',
            animation: 'slideInDown 0.3s ease-out',
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            {/* Event types filter */}
            <div>
              <h4 style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--text-primary)',
                margin: '0 0 8px 0',
              }}>
                Event Types
              </h4>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
              }}>
                {EVENT_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => toggleEventType(type.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: 'none',
                      background: filters.eventTypes.includes(type.id)
                        ? `${type.color}20`
                        : 'var(--bg-tertiary)',
                      color: filters.eventTypes.includes(type.id)
                        ? type.color
                        : 'var(--text-secondary)',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                    onMouseEnter={(e) => {
                      if (!filters.eventTypes.includes(type.id)) {
                        e.currentTarget.style.background = `${type.color}10`;
                        e.currentTarget.style.color = type.color;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!filters.eventTypes.includes(type.id)) {
                        e.currentTarget.style.background = 'var(--bg-tertiary)';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }
                    }}
                  >
                    <span>{type.icon}</span>
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Priority filter */}
            <div>
              <h4 style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--text-primary)',
                margin: '0 0 8px 0',
              }}>
                Priority Levels
              </h4>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
              }}>
                {PRIORITY_LEVELS.map((priority) => (
                  <button
                    key={priority.id}
                    onClick={() => togglePriority(priority.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: 'none',
                      background: filters.priorities.includes(priority.id)
                        ? `${priority.color}20`
                        : 'var(--bg-tertiary)',
                      color: filters.priorities.includes(priority.id)
                        ? priority.color
                        : 'var(--text-secondary)',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => {
                      if (!filters.priorities.includes(priority.id)) {
                        e.currentTarget.style.background = `${priority.color}10`;
                        e.currentTarget.style.color = priority.color;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!filters.priorities.includes(priority.id)) {
                        e.currentTarget.style.background = 'var(--bg-tertiary)';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }
                    }}
                  >
                    {priority.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Show completed toggle */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <button
                onClick={toggleShowCompleted}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: filters.showCompleted
                    ? 'var(--accent-green)20'
                    : 'var(--bg-tertiary)',
                  color: filters.showCompleted
                    ? 'var(--accent-green)'
                    : 'var(--text-secondary)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {filters.showCompleted ? '✓' : '○'} Show Completed Events
              </button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* CSS-in-JS styles */}
      <style jsx>{`
        .schedule-header {
          position: sticky;
          top: 0;
          z-index: var(--z-sticky);
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .schedule-header h2 {
            font-size: var(--font-size-lg);
          }
          
          .schedule-header p {
            font-size: var(--font-size-xs);
          }
        }
        
        @media (max-width: 480px) {
          .schedule-header > div > div {
            flex-direction: column;
            gap: 12px;
          }
          
          .schedule-header button span:last-child {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default ScheduleHeader;
