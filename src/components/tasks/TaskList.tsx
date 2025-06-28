import React, { useState, useRef, useCallback } from 'react';
import TaskCard from './TaskCard';
import SwipeGestureSystem from './SwipeGestureSystem';
import { GlassCard, GlassButton } from '../glass';

interface TaskListProps {
  tasks: Task[];
  onTaskToggle?: (taskId: string) => void;
  onTaskEdit?: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskReorder?: (fromIndex: number, toIndex: number) => void;
  onBulkAction?: (action: BulkAction, taskIds: string[]) => void;
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
  groupBy?: GroupOption;
  enableBulkSelection?: boolean;
  enableDragReorder?: boolean;
  enableSwipeActions?: boolean;
  compact?: boolean;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
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

type GroupOption = 'none' | 'priority' | 'due-date' | 'category' | 'status';
type BulkAction = 'complete' | 'delete' | 'change-priority' | 'add-tag';

interface TaskGroup {
  label: string;
  tasks: Task[];
  color?: string;
  icon?: string;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskToggle,
  onTaskEdit,
  onTaskDelete,
  onTaskReorder,
  onBulkAction,
  loading = false,
  className = '',
  style = {},
  groupBy = 'priority',
  enableBulkSelection = true,
  enableDragReorder = true,
  enableSwipeActions = true,
  compact = false,
}) => {
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [bulkSelectionMode, setBulkSelectionMode] = useState(false);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  
  const listRef = useRef<HTMLDivElement>(null);

  // Group tasks based on groupBy option
  const groupTasks = useCallback((tasks: Task[]): TaskGroup[] => {
    if (groupBy === 'none') {
      return [{ label: 'All Tasks', tasks }];
    }

    const groups: { [key: string]: Task[] } = {};

    tasks.forEach(task => {
      let groupKey = '';
      
      switch (groupBy) {
        case 'priority':
          groupKey = task.priority;
          break;
        case 'due-date':
          if (!task.dueDate) {
            groupKey = 'no-due-date';
          } else {
            const dueDate = new Date(task.dueDate);
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            if (dueDate < today && !task.completed) {
              groupKey = 'overdue';
            } else if (dueDate.toDateString() === today.toDateString()) {
              groupKey = 'today';
            } else if (dueDate.toDateString() === tomorrow.toDateString()) {
              groupKey = 'tomorrow';
            } else if (dueDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)) {
              groupKey = 'this-week';
            } else {
              groupKey = 'later';
            }
          }
          break;
        case 'category':
          groupKey = task.category || 'uncategorized';
          break;
        case 'status':
          if (task.completed) {
            groupKey = 'completed';
          } else if (task.dueDate && new Date(task.dueDate) < new Date()) {
            groupKey = 'overdue';
          } else {
            groupKey = 'pending';
          }
          break;
        default:
          groupKey = 'all';
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(task);
    });

    // Convert to array with proper labels and sorting
    return Object.entries(groups).map(([key, tasks]) => {
      let label = key;
      let color = 'var(--text-secondary)';
      let icon = '📋';

      switch (groupBy) {
        case 'priority':
          switch (key) {
            case 'high':
              label = 'High Priority';
              color = 'var(--accent-red)';
              icon = '🔴';
              break;
            case 'medium':
              label = 'Medium Priority';
              color = 'var(--accent-orange)';
              icon = '🟡';
              break;
            case 'low':
              label = 'Low Priority';
              color = 'var(--accent-green)';
              icon = '🟢';
              break;
          }
          break;
        case 'due-date':
          switch (key) {
            case 'overdue':
              label = 'Overdue';
              color = 'var(--accent-red)';
              icon = '⚠️';
              break;
            case 'today':
              label = 'Due Today';
              color = 'var(--accent-orange)';
              icon = '📅';
              break;
            case 'tomorrow':
              label = 'Due Tomorrow';
              color = 'var(--accent-blue)';
              icon = '📆';
              break;
            case 'this-week':
              label = 'This Week';
              color = 'var(--accent-purple)';
              icon = '🗓️';
              break;
            case 'later':
              label = 'Later';
              color = 'var(--text-tertiary)';
              icon = '📝';
              break;
            case 'no-due-date':
              label = 'No Due Date';
              color = 'var(--text-tertiary)';
              icon = '📝';
              break;
          }
          break;
        case 'status':
          switch (key) {
            case 'completed':
              label = 'Completed';
              color = 'var(--accent-green)';
              icon = '✅';
              break;
            case 'overdue':
              label = 'Overdue';
              color = 'var(--accent-red)';
              icon = '⚠️';
              break;
            case 'pending':
              label = 'Pending';
              color = 'var(--accent-blue)';
              icon = '⏳';
              break;
          }
          break;
      }

      return {
        label,
        tasks: tasks.sort((a, b) => {
          // Sort within groups
          if (groupBy === 'priority') {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
          }
          if (groupBy === 'due-date' && a.dueDate && b.dueDate) {
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          }
          return a.title.localeCompare(b.title);
        }),
        color,
        icon,
      };
    }).sort((a, b) => {
      // Sort groups
      if (groupBy === 'priority') {
        const order = ['High Priority', 'Medium Priority', 'Low Priority'];
        return order.indexOf(a.label) - order.indexOf(b.label);
      }
      if (groupBy === 'due-date') {
        const order = ['Overdue', 'Due Today', 'Due Tomorrow', 'This Week', 'Later', 'No Due Date'];
        return order.indexOf(a.label) - order.indexOf(b.label);
      }
      return a.label.localeCompare(b.label);
    });
  }, [groupBy]);

  // Handle task selection
  const toggleTaskSelection = (taskId: string) => {
    const newSelection = new Set(selectedTasks);
    if (newSelection.has(taskId)) {
      newSelection.delete(taskId);
    } else {
      newSelection.add(taskId);
    }
    setSelectedTasks(newSelection);
  };

  // Handle bulk actions
  const handleBulkAction = (action: BulkAction) => {
    if (selectedTasks.size === 0) return;
    
    onBulkAction?.(action, Array.from(selectedTasks));
    setSelectedTasks(new Set());
    setBulkSelectionMode(false);
  };

  // Handle drag and drop
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    if (!enableDragReorder) return;
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (!enableDragReorder) return;
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    if (!enableDragReorder || !draggedTask) return;
    e.preventDefault();
    
    const dragIndex = tasks.findIndex(task => task.id === draggedTask);
    if (dragIndex !== -1 && dragIndex !== dropIndex) {
      onTaskReorder?.(dragIndex, dropIndex);
    }
    
    setDraggedTask(null);
    setDragOverIndex(null);
  };

  const taskGroups = groupTasks(tasks);

  // Empty state
  if (tasks.length === 0 && !loading) {
    return (
      <div className={`task-list task-list--empty ${className}`} style={style}>
        <GlassCard variant="subtle" padding="xl" style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '16px',
            opacity: 0.5,
          }}>
            ✅
          </div>
          <h3 style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--text-primary)',
            margin: '0 0 8px 0',
          }}>
            No tasks found
          </h3>
          <p style={{
            fontSize: 'var(--font-size-base)',
            color: 'var(--text-secondary)',
            margin: 0,
          }}>
            Create your first task to get started with organizing your work.
          </p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div
      ref={listRef}
      className={`task-list ${bulkSelectionMode ? 'task-list--bulk-selection' : ''} ${className}`}
      style={{
        height: '100%',
        overflowY: 'auto',
        position: 'relative',
        ...style,
      }}
    >
      {/* Bulk selection toolbar */}
      {bulkSelectionMode && selectedTasks.size > 0 && (
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'var(--bg-card)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-lg)',
          margin: '0 16px 16px 16px',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}>
          <span style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--text-primary)',
            fontWeight: 'var(--font-weight-medium)',
          }}>
            {selectedTasks.size} task{selectedTasks.size !== 1 ? 's' : ''} selected
          </span>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <GlassButton
              variant="success"
              size="sm"
              onClick={() => handleBulkAction('complete')}
              leftIcon="✓"
            >
              Complete
            </GlassButton>
            
            <GlassButton
              variant="danger"
              size="sm"
              onClick={() => handleBulkAction('delete')}
              leftIcon="🗑️"
            >
              Delete
            </GlassButton>
            
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedTasks(new Set());
                setBulkSelectionMode(false);
              }}
            >
              Cancel
            </GlassButton>
          </div>
        </div>
      )}

      {/* Task groups */}
      <div style={{ padding: '16px' }}>
        {taskGroups.map((group, groupIndex) => (
          <div key={group.label} style={{ marginBottom: '32px' }}>
            {/* Group header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              paddingBottom: '8px',
              borderBottom: '1px solid var(--border-secondary)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>{group.icon}</span>
                <h3 style={{
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: group.color,
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
                  {group.tasks.length}
                </div>
              </div>

              {enableBulkSelection && group.tasks.length > 0 && (
                <GlassButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setBulkSelectionMode(!bulkSelectionMode)}
                  leftIcon={bulkSelectionMode ? "✕" : "☑️"}
                >
                  {bulkSelectionMode ? 'Cancel' : 'Select'}
                </GlassButton>
              )}
            </div>

            {/* Tasks in group */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              {group.tasks.map((task, taskIndex) => {
                const globalIndex = taskGroups.slice(0, groupIndex).reduce((acc, g) => acc + g.tasks.length, 0) + taskIndex;
                const isSelected = selectedTasks.has(task.id);
                const isDraggedOver = dragOverIndex === globalIndex;

                return (
                  <div
                    key={task.id}
                    draggable={enableDragReorder && !bulkSelectionMode}
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onDragOver={(e) => handleDragOver(e, globalIndex)}
                    onDrop={(e) => handleDrop(e, globalIndex)}
                    style={{
                      position: 'relative',
                      transform: isDraggedOver ? 'translateY(4px)' : 'none',
                      transition: 'transform var(--transition-fast)',
                    }}
                  >
                    {bulkSelectionMode && (
                      <div style={{
                        position: 'absolute',
                        left: '-40px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 5,
                      }}>
                        <button
                          onClick={() => toggleTaskSelection(task.id)}
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: 'var(--radius-sm)',
                            border: `2px solid ${isSelected ? 'var(--accent-blue)' : 'var(--border-accent)'}`,
                            background: isSelected ? 'var(--accent-blue)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)',
                          }}
                        >
                          {isSelected && (
                            <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>✓</span>
                          )}
                        </button>
                      </div>
                    )}

                    {enableSwipeActions ? (
                      <SwipeGestureSystem
                        leftAction={{
                          icon: '🗑️',
                          color: 'white',
                          backgroundColor: 'var(--accent-red)',
                          label: 'Delete',
                        }}
                        rightAction={{
                          icon: '✓',
                          color: 'white',
                          backgroundColor: 'var(--accent-green)',
                          label: 'Complete',
                        }}
                        onSwipeLeft={() => onTaskDelete?.(task.id)}
                        onSwipeRight={() => onTaskToggle?.(task.id)}
                      >
                        <TaskCard
                          task={task}
                          onToggleComplete={onTaskToggle}
                          onEdit={onTaskEdit}
                          onDelete={onTaskDelete}
                          compact={compact}
                          enableSwipeActions={false} // Handled by SwipeGestureSystem
                          style={{
                            marginLeft: bulkSelectionMode ? '40px' : '0',
                            transition: 'margin-left var(--transition-fast)',
                            animationDelay: `${(groupIndex * 0.1) + (taskIndex * 0.05)}s`,
                            animation: 'slideInUp 0.3s ease-out both',
                          }}
                        />
                      </SwipeGestureSystem>
                    ) : (
                      <TaskCard
                        task={task}
                        onToggleComplete={onTaskToggle}
                        onEdit={onTaskEdit}
                        onDelete={onTaskDelete}
                        compact={compact}
                        enableSwipeActions={enableSwipeActions}
                        style={{
                          marginLeft: bulkSelectionMode ? '40px' : '0',
                          transition: 'margin-left var(--transition-fast)',
                          animationDelay: `${(groupIndex * 0.1) + (taskIndex * 0.05)}s`,
                          animation: 'slideInUp 0.3s ease-out both',
                        }}
                      />
                    )}
                  </div>
                );
              })}
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
      </div>

      {/* CSS-in-JS styles */}
      <style jsx>{`
        .task-list {
          scroll-behavior: smooth;
        }
        
        .task-list::-webkit-scrollbar {
          width: 6px;
        }
        
        .task-list::-webkit-scrollbar-track {
          background: var(--bg-secondary);
          border-radius: 3px;
        }
        
        .task-list::-webkit-scrollbar-thumb {
          background: var(--border-accent);
          border-radius: 3px;
        }
        
        .task-list::-webkit-scrollbar-thumb:hover {
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
          .task-list > div {
            padding: 12px;
          }
        }
        
        @media (max-width: 480px) {
          .task-list > div {
            padding: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default TaskList;
