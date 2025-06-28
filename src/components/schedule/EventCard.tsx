import React, { useState } from 'react';
import { GlassCard } from '../glass';

interface EventCardProps {
  event: ScheduleEvent;
  onEdit?: (event: ScheduleEvent) => void;
  onDelete?: (eventId: string) => void;
  onStatusChange?: (eventId: string, status: EventStatus) => void;
  className?: string;
  style?: React.CSSProperties;
  compact?: boolean;
  showLinkedItems?: boolean;
}

interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  duration?: number; // in minutes
  location?: string;
  type: 'meeting' | 'personal' | 'travel' | 'work';
  priority: 'high' | 'medium' | 'low';
  status: EventStatus;
  linkedItems?: LinkedItem[];
  attendees?: string[];
  isRecurring?: boolean;
  reminderMinutes?: number;
}

interface LinkedItem {
  id: string;
  type: 'task' | 'note';
  title: string;
  status?: 'completed' | 'pending';
}

type EventStatus = 'upcoming' | 'current' | 'completed' | 'cancelled';

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onEdit,
  onDelete,
  onStatusChange,
  className = '',
  style = {},
  compact = false,
  showLinkedItems = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);

  // Get event type configuration
  const getEventTypeConfig = (type: string) => {
    const configs = {
      meeting: { icon: '👥', color: 'var(--accent-blue)', label: 'Meeting' },
      personal: { icon: '🏃', color: 'var(--accent-green)', label: 'Personal' },
      travel: { icon: '✈️', color: 'var(--accent-orange)', label: 'Travel' },
      work: { icon: '💼', color: 'var(--accent-purple)', label: 'Work' },
    };
    return configs[type as keyof typeof configs] || configs.work;
  };

  // Get priority configuration
  const getPriorityConfig = (priority: string) => {
    const configs = {
      high: { color: 'var(--accent-red)', label: 'High', icon: '🔴' },
      medium: { color: 'var(--accent-orange)', label: 'Medium', icon: '🟡' },
      low: { color: 'var(--accent-green)', label: 'Low', icon: '🟢' },
    };
    return configs[priority as keyof typeof configs] || configs.medium;
  };

  // Get status configuration
  const getStatusConfig = (status: EventStatus) => {
    const configs = {
      upcoming: { color: 'var(--accent-blue)', label: 'Upcoming', icon: '⏰' },
      current: { color: 'var(--accent-green)', label: 'Current', icon: '▶️' },
      completed: { color: 'var(--text-tertiary)', label: 'Completed', icon: '✅' },
      cancelled: { color: 'var(--accent-red)', label: 'Cancelled', icon: '❌' },
    };
    return configs[status];
  };

  // Calculate duration display
  const getDurationDisplay = (): string => {
    if (event.duration) {
      const hours = Math.floor(event.duration / 60);
      const minutes = event.duration % 60;
      if (hours > 0) {
        return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
      }
      return `${minutes}m`;
    }
    return '';
  };

  // Format time range
  const getTimeRange = (): string => {
    if (event.endTime) {
      return `${event.startTime} - ${event.endTime}`;
    }
    const duration = getDurationDisplay();
    return duration ? `${event.startTime} (${duration})` : event.startTime;
  };

  // Handle status change
  const handleStatusChange = (newStatus: EventStatus) => {
    onStatusChange?.(event.id, newStatus);
    setShowActions(false);
  };

  const typeConfig = getEventTypeConfig(event.type);
  const priorityConfig = getPriorityConfig(event.priority);
  const statusConfig = getStatusConfig(event.status);

  return (
    <GlassCard
      variant="default"
      padding={compact ? "sm" : "md"}
      interactive={true}
      className={`event-card event-card--${event.status} ${className}`}
      style={{
        borderLeft: `4px solid ${typeConfig.color}`,
        opacity: event.status === 'completed' || event.status === 'cancelled' ? 0.7 : 1,
        ...style,
      }}
      onClick={() => !compact && setIsExpanded(!isExpanded)}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Main content */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '16px',
      }}>
        {/* Left side - Time and type */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          minWidth: '120px',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-sm)',
            background: `${typeConfig.color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            flexShrink: 0,
          }}>
            {typeConfig.icon}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-family-mono)',
            }}>
              {getTimeRange()}
            </div>
            {!compact && (
              <div style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--text-tertiary)',
              }}>
                {typeConfig.label}
              </div>
            )}
          </div>
        </div>

        {/* Right side - Event details */}
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '8px',
          }}>
            <h3 style={{
              fontSize: compact ? 'var(--font-size-base)' : 'var(--font-size-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--text-primary)',
              margin: 0,
              textDecoration: event.status === 'completed' ? 'line-through' : 'none',
            }}>
              {event.title}
            </h3>

            {/* Status and priority badges */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <div style={{
                padding: '2px 6px',
                borderRadius: 'var(--radius-sm)',
                background: `${priorityConfig.color}20`,
                color: priorityConfig.color,
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-medium)',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}>
                {priorityConfig.icon}
                {!compact && priorityConfig.label}
              </div>
              
              <div style={{
                padding: '2px 6px',
                borderRadius: 'var(--radius-sm)',
                background: `${statusConfig.color}20`,
                color: statusConfig.color,
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-medium)',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}>
                {statusConfig.icon}
                {!compact && statusConfig.label}
              </div>
            </div>
          </div>

          {/* Description */}
          {event.description && !compact && (
            <p style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--text-secondary)',
              margin: '0 0 8px 0',
              lineHeight: 'var(--line-height-normal)',
            }}>
              {event.description}
            </p>
          )}

          {/* Location */}
          {event.location && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--text-secondary)',
              marginBottom: '8px',
            }}>
              <span>📍</span>
              <span>{event.location}</span>
            </div>
          )}

          {/* Attendees */}
          {event.attendees && event.attendees.length > 0 && !compact && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--text-secondary)',
              marginBottom: '8px',
            }}>
              <span>👥</span>
              <span>{event.attendees.length} attendee{event.attendees.length !== 1 ? 's' : ''}</span>
            </div>
          )}

          {/* Linked items */}
          {showLinkedItems && event.linkedItems && event.linkedItems.length > 0 && !compact && (
            <div style={{
              marginTop: '12px',
              padding: '8px',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-sm)',
            }}>
              <div style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--text-tertiary)',
                marginBottom: '4px',
                fontWeight: 'var(--font-weight-medium)',
              }}>
                Linked Items
              </div>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px',
              }}>
                {event.linkedItems.map((item) => (
                  <span
                    key={item.id}
                    style={{
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-sm)',
                      background: item.type === 'task' ? 'var(--accent-green)20' : 'var(--accent-purple)20',
                      color: item.type === 'task' ? 'var(--accent-green)' : 'var(--accent-purple)',
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}
                  >
                    {item.type === 'task' ? '✓' : '📝'} {item.title}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons (shown on hover) */}
      {showActions && !compact && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          display: 'flex',
          gap: '4px',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-sm)',
          padding: '4px',
          boxShadow: 'var(--shadow-md)',
          animation: 'fadeIn 0.2s ease-out',
        }}>
          {event.status !== 'completed' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange('completed');
              }}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                color: 'var(--accent-green)',
                fontSize: '14px',
              }}
              title="Mark as completed"
            >
              ✅
            </button>
          )}
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(event);
            }}
            style={{
              background: 'none',
              border: 'none',
              padding: '4px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              color: 'var(--accent-blue)',
              fontSize: '14px',
            }}
            title="Edit event"
          >
            ✏️
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(event.id);
            }}
            style={{
              background: 'none',
              border: 'none',
              padding: '4px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              color: 'var(--accent-red)',
              fontSize: '14px',
            }}
            title="Delete event"
          >
            🗑️
          </button>
        </div>
      )}

      {/* CSS-in-JS styles */}
      <style jsx>{`
        .event-card {
          position: relative;
          transition: all var(--transition-fast);
        }
        
        .event-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }
        
        .event-card--current {
          background: linear-gradient(135deg, rgba(48, 209, 88, 0.1) 0%, rgba(48, 209, 88, 0.05) 100%);
          border-color: var(--accent-green);
        }
        
        .event-card--upcoming {
          background: linear-gradient(135deg, rgba(0, 122, 255, 0.1) 0%, rgba(0, 122, 255, 0.05) 100%);
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .event-card > div {
            flex-direction: column;
            gap: 12px;
          }
          
          .event-card h3 {
            font-size: var(--font-size-base);
          }
        }
        
        @media (max-width: 480px) {
          .event-card {
            padding: var(--spacing-3);
          }
        }
      `}</style>
    </GlassCard>
  );
};

export default EventCard;
