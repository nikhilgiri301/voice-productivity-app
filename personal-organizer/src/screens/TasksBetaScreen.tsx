import React from 'react';

// Task type definition
interface Task {
  id: string;
  title: string;
  state: 'not-started' | 'in-progress' | 'completed' | 'blocked' | 'deferred';
  priority: 'critical' | 'important' | 'neither';
  context: 'work' | 'personal';
  dueDate?: Date;
  parentId?: string;        // null for parent tasks, set for subtasks
  subtasks?: Task[];        // only populated for parent tasks
  isExpanded?: boolean;     // UI state for expansion
}

// Sample data
const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Team standup meeting',
    state: 'not-started',
    priority: 'critical',
    context: 'work',
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    isExpanded: false,
  },
  {
    id: '2',
    title: 'Submit expense report',
    state: 'not-started',
    priority: 'important',
    context: 'work',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isExpanded: false,
  },
  {
    id: '3',
    title: 'Review project proposal',
    state: 'not-started',
    priority: 'critical',
    context: 'work',
    dueDate: new Date(),
    isExpanded: false,
  },
  {
    id: '4',
    title: 'Fix authentication bug',
    state: 'blocked',
    priority: 'critical',
    context: 'work',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    isExpanded: false,
    subtasks: [
      {
        id: '4a',
        title: 'Review security requirements',
        state: 'completed',
        priority: 'critical', // inherited from parent
        context: 'work',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        parentId: '4',
      },
      {
        id: '4b',
        title: 'Update JWT validation logic',
        state: 'in-progress',
        priority: 'critical', // inherited from parent
        context: 'work',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        parentId: '4',
      },
      {
        id: '4c',
        title: 'Write unit tests',
        state: 'not-started',
        priority: 'important', // changed from inherited critical
        context: 'work',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        parentId: '4',
      },
    ],
  },
  {
    id: '5',
    title: 'Grocery shopping',
    state: 'not-started',
    priority: 'neither',
    context: 'personal',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    isExpanded: false,
  },
  {
    id: '6',
    title: 'Update portfolio website with recent projects and achievements',
    state: 'in-progress',
    priority: 'important',
    context: 'personal',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    isExpanded: false,
    subtasks: [
      {
        id: '6a',
        title: 'Add new project screenshots',
        state: 'completed',
        priority: 'important', // inherited
        context: 'personal',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        parentId: '6',
      },
      {
        id: '6b',
        title: 'Update resume section',
        state: 'completed',
        priority: 'important', // inherited
        context: 'personal',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        parentId: '6',
      },
      {
        id: '6c',
        title: 'Write blog post about recent work',
        state: 'not-started',
        priority: 'neither', // changed from inherited important
        context: 'personal',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        parentId: '6',
      },
    ],
  },
  {
    id: '7',
    title: 'Call dentist for appointment',
    state: 'deferred',
    priority: 'important',
    context: 'personal',
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    isExpanded: false,
  },
  {
    id: '8',
    title: 'Plan weekend trip to the mountains with family and research accommodations',
    state: 'not-started',
    priority: 'important',
    context: 'personal',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    isExpanded: false,
  },
];

// Helper functions for subtask logic
const getSubtaskProgress = (task: Task): { completed: number; total: number } => {
  if (!task.subtasks) return { completed: 0, total: 0 };
  const completed = task.subtasks.filter(subtask => subtask.state === 'completed').length;
  return { completed, total: task.subtasks.length };
};

const shouldAutoCompleteParent = (task: Task): boolean => {
  if (!task.subtasks || task.subtasks.length === 0) return false;
  return task.subtasks.every(subtask => subtask.state === 'completed');
};

const isParentTask = (task: Task): boolean => {
  return !task.parentId && (task.subtasks && task.subtasks.length > 0);
};

const isSubtask = (task: Task): boolean => {
  return !!task.parentId;
};

// Priority Slider Component
const PrioritySlider: React.FC<{
  priority: 'critical' | 'important' | 'neither';
  onChange: (priority: 'critical' | 'important' | 'neither') => void;
}> = ({ priority, onChange }) => {
  const getHandlePosition = () => {
    switch(priority) {
      case 'critical': return '0%';
      case 'important': return '50%';
      case 'neither': return '100%';
    }
  };

  const getHandleColor = () => {
    switch(priority) {
      case 'critical': return '#ff4757';
      case 'important': return '#ffc107';
      case 'neither': return '#6b7280';
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;

    if (percentage < 0.33) {
      onChange('critical');
    } else if (percentage > 0.67) {
      onChange('neither');
    } else {
      onChange('important');
    }
  };

  return (
    <div 
      onClick={handleClick}
      style={{
        position: 'relative',
        width: '60px',
        height: '24px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Track */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '4px',
        background: 'linear-gradient(to right, rgba(255,71,87,0.3) 0%, rgba(255,193,7,0.3) 50%, rgba(107,114,128,0.3) 100%)',
        borderRadius: '2px',
      }} />
      
      {/* Position markers */}
      <div style={{
        position: 'absolute',
        left: '0%',
        width: '6px',
        height: '6px',
        backgroundColor: 'rgba(255,71,87,0.5)',
        borderRadius: '50%',
        transform: 'translateX(-50%)',
      }} />
      <div style={{
        position: 'absolute',
        left: '50%',
        width: '6px',
        height: '6px',
        backgroundColor: 'rgba(255,193,7,0.5)',
        borderRadius: '50%',
        transform: 'translateX(-50%)',
      }} />
      <div style={{
        position: 'absolute',
        left: '100%',
        width: '6px',
        height: '6px',
        backgroundColor: 'rgba(107,114,128,0.5)',
        borderRadius: '50%',
        transform: 'translateX(-50%)',
      }} />
      
      {/* Handle */}
      <div style={{
        position: 'absolute',
        left: getHandlePosition(),
        width: '16px',
        height: '16px',
        backgroundColor: getHandleColor(),
        borderRadius: '50%',
        transform: 'translateX(-50%)',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      }} />
    </div>
  );
};

// Single Task Card Component
const TaskCard: React.FC<{
  task: Task;
  onToggleExpansion?: (taskId: string) => void;
  onPriorityChange?: (taskId: string, priority: 'critical' | 'important' | 'neither') => void;
  isSubtask?: boolean;
}> = ({ task, onToggleExpansion, onPriorityChange, isSubtask = false }) => {
  const [priority, setPriority] = React.useState(task.priority);

  // Handle priority change
  const handlePriorityChange = (newPriority: 'critical' | 'important' | 'neither') => {
    setPriority(newPriority);
    onPriorityChange?.(task.id, newPriority);
  };

  // Get state icon
  const getStateIcon = () => {
    switch (task.state) {
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
      case 'completed':
        return (
          <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'blocked':
        return (
          <div className="w-5 h-5 bg-red-500 rounded flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        );
      case 'deferred':
        return (
          <div className="w-5 h-5 bg-yellow-500 rounded flex items-center justify-center">
            <div className="w-1 h-3 bg-white rounded-full" />
          </div>
        );
      default:
        return (
          <div className="w-5 h-5 border-2 border-text-secondary rounded" />
        );
    }
  };

  // Get accent color - matching the header context buttons (from Tailwind config)
  const accentColor = task.context === 'work' ? '#0050ff' : '#4cca4f';

  // Get subtask progress for parent tasks
  const progress = isParentTask(task) ? getSubtaskProgress(task) : null;

  // Determine if this task can be expanded
  const canExpand = isParentTask(task);

  // Card styles with grid layout
  const cardStyle: React.CSSProperties = {
    height: isSubtask ? '36px' : '48px', // Subtasks are smaller
    display: 'grid',
    gridTemplateColumns: '56px 1fr 100px',
    alignItems: 'center',
    backgroundColor: isSubtask ? '#242438' : '#2a2a3e', // Subtasks slightly darker
    borderLeft: `${isSubtask ? '8px' : '12px'} solid ${accentColor}`, // Thinner border for subtasks
    borderTop: `2px solid ${accentColor}`,
    borderRight: `2px solid ${accentColor}`,
    borderBottom: `2px solid ${accentColor}`,
    borderRadius: '16px',
    marginBottom: '12px',
    marginLeft: isSubtask ? '24px' : '0px', // Indent subtasks
    opacity: isSubtask ? 0.9 : 1, // Slightly transparent subtasks
    cursor: canExpand ? 'pointer' : 'default',
  };

  const handleCardClick = () => {
    if (canExpand && onToggleExpansion) {
      onToggleExpansion(task.id);
    }
  };

  return (
    <>
      <div style={cardStyle} onClick={handleCardClick}>
        {/* Status Column - Fixed 56px */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}>
          {canExpand ? (
            // Expansion indicator for parent tasks
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{
                fontSize: '12px',
                color: '#ffffff',
                transform: task.isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}>
                ▶
              </span>
              {getStateIcon()}
            </div>
          ) : (
            getStateIcon()
          )}
        </div>

        {/* Title Column - Flexible, truncated */}
        <div style={{
          paddingRight: '12px',
          overflow: 'hidden',
        }}>
          <h3 style={{
            fontSize: isSubtask ? '14px' : '16px', // Smaller font for subtasks
            fontWeight: isSubtask ? 500 : 600, // Less bold for subtasks
            color: '#ffffff',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {task.title}
          </h3>
        </div>

        {/* Priority/Progress Column - Fixed 100px */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingRight: '12px',
        }}>
          {progress ? (
            // Show progress for parent tasks with subtasks
            <div style={{
              fontSize: '12px',
              color: '#ffffff',
              backgroundColor: 'rgba(255,255,255,0.1)',
              padding: '2px 8px',
              borderRadius: '12px',
              fontWeight: 600,
            }}>
              [{progress.completed}/{progress.total}]
            </div>
          ) : (
            // Show priority slider for tasks without subtasks or subtasks themselves
            <PrioritySlider
              priority={priority}
              onChange={handlePriorityChange}
            />
          )}
        </div>
      </div>

      {/* Render subtasks if expanded */}
      {canExpand && task.isExpanded && task.subtasks && (
        <>
          {task.subtasks.map(subtask => (
            <TaskCard
              key={subtask.id}
              task={subtask}
              onPriorityChange={onPriorityChange}
              isSubtask={true}
            />
          ))}
        </>
      )}
    </>
  );
};

// Filter Component for TasksBeta
const TasksBetaFilters: React.FC<{
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
  tasks: Task[];
}> = ({ activeFilter, onFilterChange, tasks }) => {
  // Count tasks by priority (including subtasks)
  const getAllTasksFlat = (taskList: Task[]): Task[] => {
    const flat: Task[] = [];
    taskList.forEach(task => {
      flat.push(task);
      if (task.subtasks) {
        flat.push(...task.subtasks);
      }
    });
    return flat;
  };

  const allTasksFlat = getAllTasksFlat(tasks);
  const allCount = allTasksFlat.length;
  const criticalCount = allTasksFlat.filter(task => task.priority === 'critical').length;
  const importantCount = allTasksFlat.filter(task => task.priority === 'important').length;

  const leftFilters = [
    {
      id: 'view',
      label: 'View',
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
      ),
    },
    {
      id: 'all',
      label: `All (${allCount})`,
    },
    {
      id: 'critical',
      label: `Critical (${criticalCount})`,
    },
    {
      id: 'important',
      label: `Important (${importantCount})`,
    },
  ];

  const rightFilters = [
    {
      id: 'filter',
      label: '', // No text, just icon
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
      ),
    },
  ];

  const getFilterButtonClasses = (filter: any, isActive: boolean): string => {
    const baseClasses = [
      'px-3',
      'py-0.5', // Reduced from py-1 to make height smaller
      'text-secondary',
      'font-medium',
      'rounded-chip',
      'transition-all',
      'duration-200',
      'focus-ring',
      'flex',
      'items-center',
      'gap-2',
      'h-6', // Reduced from h-7 (28px) to h-6 (24px)
    ];

    if (isActive) {
      baseClasses.push('font-bold');
      if (filter.id === 'critical') {
        baseClasses.push('bg-red-500', 'text-white');
      } else if (filter.id === 'important') {
        baseClasses.push('bg-yellow-500', 'text-white');
      } else {
        baseClasses.push('bg-gray-500', 'text-white');
      }
    } else {
      baseClasses.push('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200');
    }

    return baseClasses.join(' ');
  };

  return (
    <div className="flex justify-between items-center gap-2 mb-6">
      {/* Left-aligned filters */}
      <div className="flex gap-2">
        {leftFilters.map((filter) => (
          <button
            key={filter.id}
            className={getFilterButtonClasses(filter, activeFilter === filter.id)}
            onClick={() => onFilterChange(filter.id)}
          >
            {filter.icon && filter.icon}
            {filter.label && <span>{filter.label}</span>}
          </button>
        ))}
      </div>

      {/* Right-aligned filter button */}
      <div className="flex gap-2">
        {rightFilters.map((filter) => (
          <button
            key={filter.id}
            className={getFilterButtonClasses(filter, activeFilter === filter.id)}
            onClick={() => onFilterChange(filter.id)}
          >
            {filter.icon}
          </button>
        ))}
      </div>
    </div>
  );
};

// Main Screen Component
const TasksBetaScreen: React.FC = () => {
  const [activeFilter, setActiveFilter] = React.useState('all');
  const [tasks, setTasks] = React.useState<Task[]>(sampleTasks);

  // Handle task expansion toggle
  const handleToggleExpansion = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, isExpanded: !task.isExpanded }
          : task
      )
    );
  };

  // Handle priority changes
  const handlePriorityChange = (taskId: string, newPriority: 'critical' | 'important' | 'neither') => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        // Update main task
        if (task.id === taskId) {
          return { ...task, priority: newPriority };
        }
        // Update subtask
        if (task.subtasks) {
          const updatedSubtasks = task.subtasks.map(subtask =>
            subtask.id === taskId
              ? { ...subtask, priority: newPriority }
              : subtask
          );
          return { ...task, subtasks: updatedSubtasks };
        }
        return task;
      })
    );
  };

  // Filter tasks based on active filter (includes subtask matching)
  const getFilteredTasks = (taskList: Task[]) => {
    switch (activeFilter) {
      case 'critical':
        return taskList.filter(task =>
          task.priority === 'critical' ||
          (task.subtasks && task.subtasks.some(subtask => subtask.priority === 'critical'))
        );
      case 'important':
        return taskList.filter(task =>
          task.priority === 'important' ||
          (task.subtasks && task.subtasks.some(subtask => subtask.priority === 'important'))
        );
      case 'all':
      default:
        return taskList;
    }
  };

  // Group tasks by due date
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const allOverdue = tasks.filter(task => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate.getFullYear(), task.dueDate.getMonth(), task.dueDate.getDate());
    return taskDate < today;
  });

  const allDueToday = tasks.filter(task => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate.getFullYear(), task.dueDate.getMonth(), task.dueDate.getDate());
    return taskDate.getTime() === today.getTime();
  });

  const allDueTomorrow = tasks.filter(task => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate.getFullYear(), task.dueDate.getMonth(), task.dueDate.getDate());
    return taskDate.getTime() === tomorrow.getTime();
  });

  const allUpcoming = tasks.filter(task => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate.getFullYear(), task.dueDate.getMonth(), task.dueDate.getDate());
    return taskDate > tomorrow;
  });

  // Apply priority filter to each date group
  const overdue = getFilteredTasks(allOverdue);
  const dueToday = getFilteredTasks(allDueToday);
  const dueTomorrow = getFilteredTasks(allDueTomorrow);
  const upcoming = getFilteredTasks(allUpcoming);

  return (
    <div className='flex-1 p-screen-margin'>
      {/* Header */}
      <div className='text-center mb-6'>
        <h1 className='text-section-header text-text-primary mb-2'>Tasks Beta</h1>
        <p className='text-secondary text-text-secondary'>
          Clean architecture with perfect alignment
        </p>
      </div>

      {/* Filters */}
      <TasksBetaFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        tasks={tasks}
      />

      {/* Task Sections */}
      {overdue.length > 0 && (
        <div className='mb-6'>
          <h2 className='text-base text-text-primary font-semibold mb-3'>
            Overdue ({overdue.length})
          </h2>
          {overdue.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleExpansion={handleToggleExpansion}
              onPriorityChange={handlePriorityChange}
            />
          ))}
        </div>
      )}

      {dueToday.length > 0 && (
        <div className='mb-6'>
          <h2 className='text-base text-text-primary font-semibold mb-3'>
            Due Today ({dueToday.length})
          </h2>
          {dueToday.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleExpansion={handleToggleExpansion}
              onPriorityChange={handlePriorityChange}
            />
          ))}
        </div>
      )}

      {dueTomorrow.length > 0 && (
        <div className='mb-6'>
          <h2 className='text-base text-text-primary font-semibold mb-3'>
            Due Tomorrow ({dueTomorrow.length})
          </h2>
          {dueTomorrow.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleExpansion={handleToggleExpansion}
              onPriorityChange={handlePriorityChange}
            />
          ))}
        </div>
      )}

      {upcoming.length > 0 && (
        <div className='mb-6'>
          <h2 className='text-base text-text-primary font-semibold mb-3'>
            Upcoming ({upcoming.length})
          </h2>
          {upcoming.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleExpansion={handleToggleExpansion}
              onPriorityChange={handlePriorityChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksBetaScreen;