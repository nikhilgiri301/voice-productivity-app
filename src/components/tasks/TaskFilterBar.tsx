import React, { useState } from 'react';
import { GlassCard, GlassInput, GlassButton } from '../glass';

interface TaskFilterBarProps {
  onFilterChange?: (filters: TaskFilters) => void;
  onSearchChange?: (query: string) => void;
  className?: string;
  style?: React.CSSProperties;
  compact?: boolean;
}

interface TaskFilters {
  priorities: TaskPriority[];
  statuses: TaskStatus[];
  dueDateFilter: DueDateFilter;
  categories: string[];
  showCompleted: boolean;
  sortBy: SortOption;
  sortOrder: 'asc' | 'desc';
}

type TaskPriority = 'high' | 'medium' | 'low';
type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'overdue';
type DueDateFilter = 'all' | 'today' | 'tomorrow' | 'this-week' | 'overdue' | 'no-due-date';
type SortOption = 'due-date' | 'priority' | 'created' | 'title' | 'completion';

const PRIORITY_OPTIONS = [
  { id: 'high' as TaskPriority, label: 'High', icon: '🔴', color: 'var(--accent-red)' },
  { id: 'medium' as TaskPriority, label: 'Medium', icon: '🟡', color: 'var(--accent-orange)' },
  { id: 'low' as TaskPriority, label: 'Low', icon: '🟢', color: 'var(--accent-green)' },
];

const STATUS_OPTIONS = [
  { id: 'pending' as TaskStatus, label: 'Pending', icon: '⏳', color: 'var(--accent-blue)' },
  { id: 'in-progress' as TaskStatus, label: 'In Progress', icon: '🔄', color: 'var(--accent-orange)' },
  { id: 'completed' as TaskStatus, label: 'Completed', icon: '✅', color: 'var(--accent-green)' },
  { id: 'overdue' as TaskStatus, label: 'Overdue', icon: '⚠️', color: 'var(--accent-red)' },
];

const DUE_DATE_OPTIONS = [
  { id: 'all' as DueDateFilter, label: 'All Tasks', icon: '📋' },
  { id: 'today' as DueDateFilter, label: 'Today', icon: '📅' },
  { id: 'tomorrow' as DueDateFilter, label: 'Tomorrow', icon: '📆' },
  { id: 'this-week' as DueDateFilter, label: 'This Week', icon: '🗓️' },
  { id: 'overdue' as DueDateFilter, label: 'Overdue', icon: '⚠️' },
  { id: 'no-due-date' as DueDateFilter, label: 'No Due Date', icon: '📝' },
];

const SORT_OPTIONS = [
  { id: 'due-date' as SortOption, label: 'Due Date', icon: '📅' },
  { id: 'priority' as SortOption, label: 'Priority', icon: '🔥' },
  { id: 'created' as SortOption, label: 'Created', icon: '🕐' },
  { id: 'title' as SortOption, label: 'Title', icon: '🔤' },
  { id: 'completion' as SortOption, label: 'Completion', icon: '✓' },
];

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  onFilterChange,
  onSearchChange,
  className = '',
  style = {},
  compact = false,
}) => {
  const [filters, setFilters] = useState<TaskFilters>({
    priorities: ['high', 'medium', 'low'],
    statuses: ['pending', 'in-progress'],
    dueDateFilter: 'all',
    categories: [],
    showCompleted: false,
    sortBy: 'due-date',
    sortOrder: 'asc',
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Update filters and notify parent
  const updateFilters = (newFilters: Partial<TaskFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange?.(updatedFilters);
    
    // Count active filters
    const count = 
      (updatedFilters.priorities.length < 3 ? 1 : 0) +
      (updatedFilters.statuses.length < 4 ? 1 : 0) +
      (updatedFilters.dueDateFilter !== 'all' ? 1 : 0) +
      (updatedFilters.categories.length > 0 ? 1 : 0) +
      (updatedFilters.showCompleted ? 1 : 0);
    
    setActiveFilterCount(count);
  };

  // Handle search input
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange?.(value);
  };

  // Toggle priority filter
  const togglePriority = (priority: TaskPriority) => {
    const newPriorities = filters.priorities.includes(priority)
      ? filters.priorities.filter(p => p !== priority)
      : [...filters.priorities, priority];
    updateFilters({ priorities: newPriorities });
  };

  // Toggle status filter
  const toggleStatus = (status: TaskStatus) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter(s => s !== status)
      : [...filters.statuses, status];
    updateFilters({ statuses: newStatuses });
  };

  // Clear all filters
  const clearAllFilters = () => {
    const defaultFilters: TaskFilters = {
      priorities: ['high', 'medium', 'low'],
      statuses: ['pending', 'in-progress'],
      dueDateFilter: 'all',
      categories: [],
      showCompleted: false,
      sortBy: 'due-date',
      sortOrder: 'asc',
    };
    setFilters(defaultFilters);
    setSearchQuery('');
    onFilterChange?.(defaultFilters);
    onSearchChange?.('');
    setActiveFilterCount(0);
  };

  return (
    <div className={`task-filter-bar ${className}`} style={style}>
      {/* Main filter bar */}
      <GlassCard variant="elevated" padding="md" style={{ marginBottom: showAdvancedFilters ? '16px' : '0' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: compact ? 'wrap' : 'nowrap',
        }}>
          {/* Search input */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <GlassInput
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search tasks..."
              leftIcon="🔍"
              rightIcon={searchQuery ? "✕" : undefined}
              onRightIconClick={searchQuery ? () => handleSearchChange('') : undefined}
              fullWidth
            />
          </div>

          {/* Quick filters */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
          }}>
            {/* Due date quick filter */}
            <select
              value={filters.dueDateFilter}
              onChange={(e) => updateFilters({ dueDateFilter: e.target.value as DueDateFilter })}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-primary)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                cursor: 'pointer',
              }}
            >
              {DUE_DATE_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>

            {/* Sort options */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilters({ sortBy: e.target.value as SortOption })}
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-primary)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  cursor: 'pointer',
                }}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
              
              <GlassButton
                variant="ghost"
                size="sm"
                onClick={() => updateFilters({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
                title={`Sort ${filters.sortOrder === 'asc' ? 'descending' : 'ascending'}`}
              >
                {filters.sortOrder === 'asc' ? '↑' : '↓'}
              </GlassButton>
            </div>

            {/* Advanced filters toggle */}
            <GlassButton
              variant={showAdvancedFilters ? "primary" : "ghost"}
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              leftIcon="🔧"
            >
              Filters
              {activeFilterCount > 0 && (
                <span style={{
                  marginLeft: '4px',
                  padding: '2px 6px',
                  borderRadius: '50%',
                  background: 'var(--accent-red)',
                  color: 'white',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-bold)',
                  minWidth: '16px',
                  textAlign: 'center',
                }}>
                  {activeFilterCount}
                </span>
              )}
            </GlassButton>

            {/* Clear filters */}
            {activeFilterCount > 0 && (
              <GlassButton
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                leftIcon="🗑️"
              >
                Clear
              </GlassButton>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Advanced filters panel */}
      {showAdvancedFilters && (
        <GlassCard 
          variant="subtle" 
          padding="md"
          style={{ 
            animation: 'slideInDown 0.3s ease-out',
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}>
            {/* Priority filters */}
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
                {PRIORITY_OPTIONS.map((priority) => (
                  <button
                    key={priority.id}
                    onClick={() => togglePriority(priority.id)}
                    style={{
                      padding: '8px 12px',
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
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>{priority.icon}</span>
                    <span>{priority.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Status filters */}
            <div>
              <h4 style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--text-primary)',
                margin: '0 0 8px 0',
              }}>
                Task Status
              </h4>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
              }}>
                {STATUS_OPTIONS.map((status) => (
                  <button
                    key={status.id}
                    onClick={() => toggleStatus(status.id)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: 'none',
                      background: filters.statuses.includes(status.id)
                        ? `${status.color}20`
                        : 'var(--bg-tertiary)',
                      color: filters.statuses.includes(status.id)
                        ? status.color
                        : 'var(--text-secondary)',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>{status.icon}</span>
                    <span>{status.label}</span>
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
                onClick={() => updateFilters({ showCompleted: !filters.showCompleted })}
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{filters.showCompleted ? '✓' : '○'}</span>
                <span>Show Completed Tasks</span>
              </button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* CSS-in-JS styles */}
      <style jsx>{`
        .task-filter-bar {
          position: sticky;
          top: 0;
          z-index: var(--z-sticky);
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .task-filter-bar select {
            font-size: var(--font-size-xs);
            padding: 6px 8px;
          }
          
          .task-filter-bar button {
            font-size: var(--font-size-xs);
            padding: 6px 8px;
          }
        }
        
        @media (max-width: 480px) {
          .task-filter-bar > div > div {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
          }
          
          .task-filter-bar select,
          .task-filter-bar button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default TaskFilterBar;
