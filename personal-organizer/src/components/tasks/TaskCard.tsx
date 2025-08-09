import React from 'react';
import { Card, Chip } from '@/components/common';

export type TaskState = 'not-started' | 'in-progress' | 'blocked' | 'deferred' | 'cancelled' | 'completed';
export type TaskPriority = 'critical' | 'useful';
export type TaskContext = 'work' | 'personal';

export interface TaskData {
  id: string;
  title: string;
  description?: string;
  state: TaskState;
  priority: TaskPriority;
  context: TaskContext;
  dueDate?: Date;
  createdAt: Date;
  completedAt?: Date;
  tags?: string[];
}

export interface TaskCardProps {
  task: TaskData;
  onStateChange?: (taskId: string, newState: TaskState) => void;
  onClick?: (task: TaskData) => void;
  className?: string;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStateChange: _onStateChange,
  onClick,
  className = '',
}) => {
  const getStateIcon = (state: TaskState): React.ReactNode => {
    switch (state) {
      case 'not-started':
        return (
          <div className="w-5 h-5 border-2 border-text-secondary rounded" />
        );
      case 'in-progress':
        return (
          <div className="w-5 h-5 border-2 border-accent rounded flex items-center justify-center">
            <div className="w-2 h-2 bg-accent rounded-full" />
          </div>
        );
      case 'blocked':
        return (
          <div className="w-5 h-5 bg-priority-urgent rounded flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM10 18a8 8 0 100-16 8 8 0 000 16z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'deferred':
        return (
          <div className="w-5 h-5 bg-priority-useful rounded flex items-center justify-center">
            <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'cancelled':
        return (
          <div className="w-5 h-5 bg-text-secondary rounded flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'completed':
        return (
          <div className="w-5 h-5 bg-accent rounded flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getStateLabel = (state: TaskState): string => {
    switch (state) {
      case 'not-started': return 'Not Started';
      case 'in-progress': return 'In Progress';
      case 'blocked': return 'Blocked';
      case 'deferred': return 'Deferred';
      case 'cancelled': return 'Cancelled';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  const formatDueDate = (date: Date): string => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays === -1) return 'Due yesterday';
    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`;
    if (diffDays <= 7) return `Due in ${diffDays} days`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = (date: Date): boolean => {
    return date.getTime() < new Date().getTime() && task.state !== 'completed';
  };

  const handleStateClick = (event: React.MouseEvent): void => {
    event.stopPropagation();
    // State change functionality will be implemented in Phase 3
    console.log('State change clicked for task:', task.id);
  };

  const handleCardClick = (): void => {
    onClick?.(task);
  };

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick();
    }
  };

  // Outer card (accent color) classes - NO padding, NO margin
  const outerCardClasses = [
    'relative',
    task.context === 'work' ? 'bg-context-work' : 'bg-context-personal',
    task.state === 'completed' ? 'opacity-75' : '',
  ].join(' ');

  // Inner card (main content) classes - solid dark background, fixed width with 1px right border
  const innerCardClasses = [
    'relative', // This will be our positioning reference for the state button
    'ml-2', // 8px left margin to create accent gap
    'bg-bg-card', // Solid dark background, not translucent
    className,
  ].join(' ');

  // Custom style for precise 1px right margin to match top/bottom border effect
  const innerCardStyle = {
    width: 'calc(100% - 9px)', // 8px left margin + 1px right margin
  };



  const titleClasses = [
    'text-base', // 16px
    'text-text-primary',
    'font-semibold', // 600 weight
    'mb-0.5',
    'line-clamp-2',
    task.state === 'completed' ? 'line-through opacity-60' : '',
  ].join(' ');

  const descriptionClasses = [
    'text-xs', // 12px
    'text-text-secondary',
    'font-normal', // 400 weight
    'mb-1',
    'line-clamp-1',
    task.state === 'completed' ? 'opacity-60' : '',
  ].join(' ');

  const dueDateClasses = [
    'text-xs', // 12px
    'font-normal', // 400 weight
    task.dueDate && isOverdue(task.dueDate) ? 'text-priority-urgent' : 'text-text-secondary',
  ].join(' ');

  return (
    <div
      className={`relative bg-bg-card w-full ${task.state === 'completed' ? 'opacity-75' : ''} ${className}`}
      onClick={handleCardClick}
      {...(onClick && {
        role: 'button',
        'aria-label': `View task: ${task.title}`,
        tabIndex: 0,
        onKeyDown: handleKeyDown,
      })}
    >
      {/* Debug: Blue line at card start */}
      <div className="absolute top-0 bottom-0 w-1 bg-blue-500" style={{ left: '0px', zIndex: 200 }}></div>
      
      {/* Accent bar - absolute positioned */}
      <div 
        className={`absolute left-0 top-0 bottom-0 w-2 ${task.context === 'work' ? 'bg-context-work' : 'bg-context-personal'}`}
      />
      
      {/* Content container */}
      <div style={{ position: 'relative', padding: '12px' }}>
        {/* Fixed width spacer for state button */}
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <div style={{ width: '48px', flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
            <button
              className="touch-target"
              onClick={handleStateClick}
              aria-label={`Change task state from ${getStateLabel(task.state)}`}
            >
              {getStateIcon(task.state)}
            </button>
          </div>
          
          {/* Debug: Red line at content start */}
          <div style={{ position: 'absolute', left: '60px', top: 0, bottom: 0, width: '2px', backgroundColor: 'red' }}></div>
          
          {/* Content Area */}
          <div style={{ flex: 1, marginLeft: '8px' }}>
            {/* Row 1: Title and Priority Chip */}
            <div className="flex items-start gap-3">
              <h3 className={`${titleClasses} flex-1 min-w-0`}>{task.title}</h3>
              <div className="flex-shrink-0">
                <Chip
                  variant="priority"
                  color={task.priority}
                  size="sm"
                  className="rounded-card"
                >
                  {task.priority === 'useful' ? 'Important' : task.priority.charAt(0).toUpperCase() + task.priority.slice(1).toLowerCase()}
                </Chip>
              </div>
            </div>

            {/* Row 2: Description */}
            <div className="h-4 overflow-hidden">
              <p className={descriptionClasses} style={{ lineHeight: '16px' }}>
                {task.description || '\u00A0'}
              </p>
            </div>

            {/* Row 3: Due Date and Tags */}
            <div className="flex items-center justify-between gap-2">
              {/* Due Date Section - Left aligned */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {task.dueDate && (
                  <>
                    <span className={dueDateClasses}>
                      {formatDueDate(task.dueDate)}
                    </span>
                    {isOverdue(task.dueDate) && (
                      <svg
                        className="w-4 h-4 text-priority-urgent"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    )}
                  </>
                )}
              </div>

              {/* Tags Section - Right aligned */}
              {task.tags && task.tags.length > 0 && (
                <div className="flex items-center gap-1 justify-end">
                  {task.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-gray-100 text-micro text-gray-700 rounded-chip font-normal whitespace-nowrap"
                    >
                      {tag.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                    </span>
                  ))}
                  {task.tags.length > 2 && (
                    <span className="text-micro text-text-secondary">
                      +{task.tags.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
