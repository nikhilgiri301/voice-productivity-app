import React, { useState, useRef, useEffect } from 'react';
import { GlassCard } from '../glass';

interface TaskCardProps {
  task: Task;
  onToggleComplete?: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onPriorityChange?: (taskId: string, priority: TaskPriority) => void;
  className?: string;
  style?: React.CSSProperties;
  compact?: boolean;
  showLinkedItems?: boolean;
  enableSwipeActions?: boolean;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: TaskPriority;
  dueDate?: string;
  dueTime?: string;
  category?: string;
  tags?: string[];
  linkedItems?: LinkedItem[];
  subtasks?: Subtask[];
  estimatedMinutes?: number;
  createdAt: string;
  completedAt?: string;
}

interface LinkedItem {
  id: string;
  type: 'event' | 'note';
  title: string;
  status?: string;
}

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

type TaskPriority = 'high' | 'medium' | 'low';

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  onPriorityChange,
  className = '',
  style = {},
  compact = false,
  showLinkedItems = true,
  enableSwipeActions = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number>(0);
  const startY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  // Get priority configuration
  const getPriorityConfig = (priority: TaskPriority) => {
    const configs = {
      high: { color: 'var(--accent-red)', label: 'High', icon: '🔴', bg: 'rgba(255, 69, 58, 0.1)' },
      medium: { color: 'var(--accent-orange)', label: 'Medium', icon: '🟡', bg: 'rgba(255, 159, 10, 0.1)' },
      low: { color: 'var(--accent-green)', label: 'Low', icon: '🟢', bg: 'rgba(48, 209, 88, 0.1)' },
    };
    return configs[priority];
  };

  // Format due date
  const formatDueDate = (dueDate?: string, dueTime?: string): string => {
    if (!dueDate) return '';
    
    const date = new Date(dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    let dateStr = '';
    if (date.toDateString() === today.toDateString()) {
      dateStr = 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      dateStr = 'Tomorrow';
    } else {
      dateStr = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
    
    if (dueTime) {
      dateStr += ` at ${dueTime}`;
    }
    
    return dateStr;
  };

  // Check if task is overdue
  const isOverdue = (): boolean => {
    if (!task.dueDate || task.completed) return false;
    
    const dueDateTime = new Date(task.dueDate + (task.dueTime ? ` ${task.dueTime}` : ''));
    return dueDateTime < new Date();
  };

  // Get completion percentage for subtasks
  const getCompletionPercentage = (): number => {
    if (!task.subtasks || task.subtasks.length === 0) return 0;
    const completed = task.subtasks.filter(st => st.completed).length;
    return Math.round((completed / task.subtasks.length) * 100);
  };

  // Swipe gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enableSwipeActions) return;
    
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    isDragging.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!enableSwipeActions) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - startX.current;
    const deltaY = currentY - startY.current;
    
    // Only start swiping if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      isDragging.current = true;
      setIsSwipeActive(true);
      
      // Limit swipe distance
      const maxSwipe = 120;
      const clampedOffset = Math.max(-maxSwipe, Math.min(maxSwipe, deltaX));
      setSwipeOffset(clampedOffset);
      
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (!enableSwipeActions || !isDragging.current) return;
    
    const threshold = 60;
    
    if (swipeOffset > threshold) {
      // Right swipe - mark complete
      onToggleComplete?.(task.id);
    } else if (swipeOffset < -threshold) {
      // Left swipe - delete
      onDelete?.(task.id);
    }
    
    // Reset swipe state
    setSwipeOffset(0);
    setIsSwipeActive(false);
    isDragging.current = false;
  };

  // Handle checkbox toggle with animation
  const handleToggleComplete = () => {
    onToggleComplete?.(task.id);
    
    // Add haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const priorityConfig = getPriorityConfig(task.priority);
  const dueDisplay = formatDueDate(task.dueDate, task.dueTime);
  const overdue = isOverdue();
  const completionPercentage = getCompletionPercentage();

  return (
    <GlassCard
      ref={cardRef}
      variant="default"
      padding={compact ? "sm" : "md"}
      interactive={true}
      className={`task-card ${task.completed ? 'task-card--completed' : ''} ${overdue ? 'task-card--overdue' : ''} ${className}`}
      style={{
        transform: `translateX(${swipeOffset}px)`,
        transition: isSwipeActive ? 'none' : 'all var(--transition-fast)',
        opacity: task.completed ? 0.7 : 1,
        borderLeft: `4px solid ${priorityConfig.color}`,
        position: 'relative',
        ...style,
      }}
      onClick={() => !compact && setIsExpanded(!isExpanded)}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Swipe action backgrounds */}
      {enableSwipeActions && (
        <>
          {/* Complete action (right swipe) */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '60px',
              background: 'var(--accent-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: swipeOffset > 30 ? 1 : 0,
              transition: 'opacity 0.2s ease',
            }}
          >
            <span style={{ color: 'white', fontSize: '20px' }}>✓</span>
          </div>
          
          {/* Delete action (left swipe) */}
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '60px',
              background: 'var(--accent-red)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: swipeOffset < -30 ? 1 : 0,
              transition: 'opacity 0.2s ease',
            }}
          >
            <span style={{ color: 'white', fontSize: '20px' }}>🗑️</span>
          </div>
        </>
      )}

      {/* Main content */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
      }}>
        {/* Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleComplete();
          }}
          style={{
            width: '24px',
            height: '24px',
            borderRadius: 'var(--radius-sm)',
            border: `2px solid ${task.completed ? 'var(--accent-green)' : priorityConfig.color}`,
            background: task.completed ? 'var(--accent-green)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            flexShrink: 0,
            marginTop: '2px',
          }}
          onMouseEnter={(e) => {
            if (!task.completed) {
              e.currentTarget.style.background = `${priorityConfig.color}20`;
            }
          }}
          onMouseLeave={(e) => {
            if (!task.completed) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          {task.completed && (
            <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>✓</span>
          )}
        </button>

        {/* Task content */}
        <div style={{ flex: 1, minWidth: 0 }}>
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
              textDecoration: task.completed ? 'line-through' : 'none',
              wordBreak: 'break-word',
            }}>
              {task.title}
            </h3>

            {/* Priority badge */}
            <div style={{
              padding: '2px 6px',
              borderRadius: 'var(--radius-sm)',
              background: priorityConfig.bg,
              color: priorityConfig.color,
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-medium)',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              flexShrink: 0,
              marginLeft: '8px',
            }}>
              {priorityConfig.icon}
              {!compact && priorityConfig.label}
            </div>
          </div>

          {/* Description */}
          {task.description && !compact && (
            <p style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--text-secondary)',
              margin: '0 0 8px 0',
              lineHeight: 'var(--line-height-normal)',
            }}>
              {task.description}
            </p>
          )}

          {/* Due date */}
          {dueDisplay && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: 'var(--font-size-sm)',
              color: overdue ? 'var(--accent-red)' : 'var(--text-secondary)',
              marginBottom: '8px',
              fontWeight: overdue ? 'var(--font-weight-semibold)' : 'normal',
            }}>
              <span>{overdue ? '⚠️' : '📅'}</span>
              <span>{dueDisplay}</span>
              {overdue && <span style={{ fontSize: 'var(--font-size-xs)' }}>(Overdue)</span>}
            </div>
          )}

          {/* Subtasks progress */}
          {task.subtasks && task.subtasks.length > 0 && !compact && (
            <div style={{
              marginBottom: '8px',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '4px',
              }}>
                <span style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--text-tertiary)',
                  fontWeight: 'var(--font-weight-medium)',
                }}>
                  Subtasks
                </span>
                <span style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--text-secondary)',
                  fontWeight: 'var(--font-weight-medium)',
                }}>
                  {completionPercentage}%
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '4px',
                background: 'var(--bg-tertiary)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${completionPercentage}%`,
                  height: '100%',
                  background: 'var(--accent-green)',
                  transition: 'width var(--transition-normal)',
                }} />
              </div>
            </div>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && !compact && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '4px',
              marginBottom: '8px',
            }}>
              {task.tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--accent-purple)20',
                    color: 'var(--accent-purple)',
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 'var(--font-weight-medium)',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Linked items */}
          {showLinkedItems && task.linkedItems && task.linkedItems.length > 0 && !compact && (
            <div style={{
              marginTop: '8px',
              padding: '6px',
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
                {task.linkedItems.map((item) => (
                  <span
                    key={item.id}
                    style={{
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-sm)',
                      background: item.type === 'event' ? 'var(--accent-blue)20' : 'var(--accent-purple)20',
                      color: item.type === 'event' ? 'var(--accent-blue)' : 'var(--accent-purple)',
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}
                  >
                    {item.type === 'event' ? '📅' : '📝'} {item.title}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons (shown on hover) */}
      {showActions && !compact && !isSwipeActive && (
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(task);
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
            title="Edit task"
          >
            ✏️
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(task.id);
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
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      )}

      {/* CSS-in-JS styles */}
      <style jsx>{`
        .task-card {
          position: relative;
          overflow: hidden;
        }
        
        .task-card:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }
        
        .task-card--completed {
          background: linear-gradient(135deg, rgba(48, 209, 88, 0.05) 0%, rgba(48, 209, 88, 0.02) 100%);
        }
        
        .task-card--overdue {
          background: linear-gradient(135deg, rgba(255, 69, 58, 0.1) 0%, rgba(255, 69, 58, 0.05) 100%);
          border-color: var(--accent-red);
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .task-card h3 {
            font-size: var(--font-size-base);
          }
        }
        
        @media (max-width: 480px) {
          .task-card {
            padding: var(--spacing-3);
          }
        }
      `}</style>
    </GlassCard>
  );
};

export default TaskCard;
