import React from 'react';

// Task type definition
interface Task {
  id: string;
  title: string;
  state: 'not-started' | 'in-progress' | 'completed' | 'blocked' | 'deferred';
  priority: 'critical' | 'important' | 'neither';
  context: 'work' | 'personal';
  dueDate?: Date;
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
  },
  {
    id: '2',
    title: 'Submit expense report',
    state: 'not-started',
    priority: 'important',
    context: 'work',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    title: 'Review project proposal',
    state: 'not-started',
    priority: 'critical',
    context: 'work',
    dueDate: new Date(),
  },
  {
    id: '4',
    title: 'Fix authentication bug',
    state: 'blocked',
    priority: 'critical',
    context: 'work',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: '5',
    title: 'Grocery shopping',
    state: 'not-started',
    priority: 'neither',
    context: 'personal',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: '6',
    title: 'Update portfolio website with recent projects and achievements',
    state: 'in-progress',
    priority: 'important',
    context: 'personal',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '7',
    title: 'Call dentist for appointment',
    state: 'deferred',
    priority: 'important',
    context: 'personal',
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
  },
  {
    id: '8',
    title: 'Plan weekend trip to the mountains with family and research accommodations',
    state: 'not-started',
    priority: 'important',
    context: 'personal',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
];

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
const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const [priority, setPriority] = React.useState(task.priority);
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
          <div className="w-5 h-5 bg-accent rounded flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
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
    }
  };

  // Get accent color - matching the header context buttons (from Tailwind config)
  const accentColor = task.context === 'work' ? '#0050ff' : '#4cca4f';

  // Card styles with grid layout
  const cardStyle: React.CSSProperties = {
    height: '48px',
    display: 'grid',
    gridTemplateColumns: '56px 1fr 100px',
    alignItems: 'center',
    backgroundColor: '#2a2a3e',
    borderLeft: `12px solid ${accentColor}`,
    borderTop: `2px solid ${accentColor}`,
    borderRight: `2px solid ${accentColor}`,
    borderBottom: `2px solid ${accentColor}`,
    borderRadius: '16px',
    marginBottom: '12px',
  };

  return (
    <div style={cardStyle}>
      {/* Status Column - Fixed 56px */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100%',
      }}>
        {getStateIcon()}
      </div>

      {/* Title Column - Flexible, truncated */}
      <div style={{
        paddingRight: '12px',
        overflow: 'hidden',
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 600,
          color: '#ffffff',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {task.title}
        </h3>
      </div>

      {/* Priority Column - Fixed 100px */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: '12px',
      }}>
        <PrioritySlider 
          priority={priority}
          onChange={setPriority}
        />
      </div>
    </div>
  );
};

// Filter Component for TasksBeta
const TasksBetaFilters: React.FC<{
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
  tasks: Task[];
}> = ({ activeFilter, onFilterChange, tasks }) => {
  // Count tasks by priority
  const allCount = tasks.length;
  const criticalCount = tasks.filter(task => task.priority === 'critical').length;
  const importantCount = tasks.filter(task => task.priority === 'important').length;

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

  // Filter tasks based on active filter
  const getFilteredTasks = (tasks: Task[]) => {
    switch (activeFilter) {
      case 'critical':
        return tasks.filter(task => task.priority === 'critical');
      case 'important':
        return tasks.filter(task => task.priority === 'important');
      case 'all':
      default:
        return tasks;
    }
  };

  // Group tasks by due date
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const allOverdue = sampleTasks.filter(task => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate.getFullYear(), task.dueDate.getMonth(), task.dueDate.getDate());
    return taskDate < today;
  });

  const allDueToday = sampleTasks.filter(task => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate.getFullYear(), task.dueDate.getMonth(), task.dueDate.getDate());
    return taskDate.getTime() === today.getTime();
  });

  const allDueTomorrow = sampleTasks.filter(task => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate.getFullYear(), task.dueDate.getMonth(), task.dueDate.getDate());
    return taskDate.getTime() === tomorrow.getTime();
  });

  const allUpcoming = sampleTasks.filter(task => {
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
        tasks={sampleTasks}
      />

      {/* Task Sections */}
      {overdue.length > 0 && (
        <div className='mb-6'>
          <h2 className='text-base text-text-primary font-semibold mb-3'>
            Overdue ({overdue.length})
          </h2>
          {overdue.map(task => <TaskCard key={task.id} task={task} />)}
        </div>
      )}

      {dueToday.length > 0 && (
        <div className='mb-6'>
          <h2 className='text-base text-text-primary font-semibold mb-3'>
            Due Today ({dueToday.length})
          </h2>
          {dueToday.map(task => <TaskCard key={task.id} task={task} />)}
        </div>
      )}

      {dueTomorrow.length > 0 && (
        <div className='mb-6'>
          <h2 className='text-base text-text-primary font-semibold mb-3'>
            Due Tomorrow ({dueTomorrow.length})
          </h2>
          {dueTomorrow.map(task => <TaskCard key={task.id} task={task} />)}
        </div>
      )}

      {upcoming.length > 0 && (
        <div className='mb-6'>
          <h2 className='text-base text-text-primary font-semibold mb-3'>
            Upcoming ({upcoming.length})
          </h2>
          {upcoming.map(task => <TaskCard key={task.id} task={task} />)}
        </div>
      )}
    </div>
  );
};

export default TasksBetaScreen;