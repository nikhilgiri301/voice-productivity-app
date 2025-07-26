import React, { useState } from 'react';
import {
  TaskFilters,
  SwipeableTaskCard,
  type TaskFilterType,
  type TaskData,
  type TaskState,
} from '@/components/tasks';

const TasksScreen: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<TaskFilterType>('all');

  // Sample tasks data with various states, priorities, and due dates
  const sampleTasks: TaskData[] = [
    {
      id: '1',
      title: 'Review project proposal',
      description: 'Analyze the Q3 project proposal and provide detailed feedback on technical feasibility and resource requirements.',
      state: 'not-started',
      priority: 'urgent',
      context: 'work',
      dueDate: new Date(2025, 6, 26), // Today
      createdAt: new Date(2025, 6, 24),
      tags: ['review', 'project', 'urgent'],
    },
    {
      id: '2',
      title: 'Update portfolio website',
      description: 'Add recent projects and update the design to reflect current skills and experience.',
      state: 'in-progress',
      priority: 'important',
      context: 'personal',
      dueDate: new Date(2025, 6, 28), // In 2 days
      createdAt: new Date(2025, 6, 20),
      tags: ['portfolio', 'design', 'development'],
    },
    {
      id: '3',
      title: 'Call dentist for appointment',
      description: 'Schedule routine cleaning and checkup appointment.',
      state: 'deferred',
      priority: 'optional',
      context: 'personal',
      dueDate: new Date(2025, 6, 30), // In 4 days
      createdAt: new Date(2025, 6, 15),
      tags: ['health', 'appointment'],
    },
    {
      id: '4',
      title: 'Prepare presentation slides',
      description: 'Create comprehensive slides for the client presentation including project timeline, deliverables, and budget breakdown.',
      state: 'completed',
      priority: 'urgent',
      context: 'work',
      dueDate: new Date(2025, 6, 25), // Yesterday
      createdAt: new Date(2025, 6, 22),
      completedAt: new Date(2025, 6, 25),
      tags: ['presentation', 'client', 'slides'],
    },
    {
      id: '5',
      title: 'Fix authentication bug',
      description: 'Investigate and resolve the login timeout issue reported by multiple users.',
      state: 'blocked',
      priority: 'urgent',
      context: 'work',
      dueDate: new Date(2025, 6, 27), // Tomorrow
      createdAt: new Date(2025, 6, 23),
      tags: ['bug', 'authentication', 'urgent'],
    },
    {
      id: '6',
      title: 'Plan weekend trip',
      description: 'Research destinations, book accommodations, and create itinerary for the upcoming weekend getaway.',
      state: 'in-progress',
      priority: 'optional',
      context: 'personal',
      dueDate: new Date(2025, 7, 1), // Next week
      createdAt: new Date(2025, 6, 18),
      tags: ['travel', 'planning', 'weekend'],
    },
    {
      id: '7',
      title: 'Code review for team member',
      description: 'Review pull request #247 for the new user dashboard feature.',
      state: 'cancelled',
      priority: 'important',
      context: 'work',
      dueDate: new Date(2025, 6, 24), // Yesterday
      createdAt: new Date(2025, 6, 21),
      tags: ['code-review', 'team', 'dashboard'],
    },
    {
      id: '8',
      title: 'Grocery shopping',
      description: 'Buy ingredients for meal prep and household essentials.',
      state: 'not-started',
      priority: 'important',
      context: 'personal',
      dueDate: new Date(2025, 6, 27), // Tomorrow
      createdAt: new Date(2025, 6, 26),
      tags: ['shopping', 'meal-prep'],
    },
  ];

  // Calculate task counts for filter badges
  const taskCounts = {
    all: sampleTasks.length,
    urgent: sampleTasks.filter(task => task.priority === 'urgent').length,
    important: sampleTasks.filter(task => task.priority === 'important').length,
    optional: sampleTasks.filter(task => task.priority === 'optional').length,
  };

  // Filter tasks based on active filter
  const filteredTasks = sampleTasks.filter(task => {
    if (activeFilter === 'all') return true;
    return task.priority === activeFilter;
  });

  const handleFilterChange = (filter: TaskFilterType): void => {
    setActiveFilter(filter);
  };

  const handleTaskStateChange = (taskId: string, newState: TaskState): void => {
    // State change functionality will be implemented in Phase 3
    console.log('Task state change:', taskId, newState);
  };

  const handleSwipeComplete = (taskId: string): void => {
    // Swipe complete functionality will be implemented in Phase 3
    console.log('Swipe complete:', taskId);
  };

  const handleSwipeEdit = (taskId: string): void => {
    // Swipe edit functionality will be implemented in Phase 3
    console.log('Swipe edit:', taskId);
  };

  const handleTaskClick = (task: TaskData): void => {
    // Task click functionality will be implemented in Phase 3
    console.log('Task clicked:', task.title);
  };

  return (
    <div className='flex-1 p-screen-margin space-y-4'>
      {/* Screen Header */}
      <div className='text-center mb-6'>
        <h1 className='text-section-header text-text-primary mb-2'>Tasks</h1>
        <p className='text-secondary text-text-secondary'>
          Your to-dos and action items
        </p>
      </div>

      {/* Task Filters */}
      <TaskFilters
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        taskCounts={taskCounts}
      />

      {/* Tasks List */}
      <div className='space-y-3'>
        {filteredTasks.length === 0 ? (
          <div className='text-center py-12'>
            <div className='w-16 h-16 mx-auto mb-4 bg-accent bg-opacity-20 rounded-full flex items-center justify-center'>
              <svg
                className='w-8 h-8 text-accent'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
                />
              </svg>
            </div>
            <h3 className='text-card-title text-text-primary mb-2'>
              No tasks found
            </h3>
            <p className='text-body text-text-secondary'>
              No tasks match the selected filter. Try selecting a different priority level.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <SwipeableTaskCard
              key={task.id}
              task={task}
              onStateChange={handleTaskStateChange}
              onSwipeComplete={handleSwipeComplete}
              onSwipeEdit={handleSwipeEdit}
              onClick={handleTaskClick}
            />
          ))
        )}
      </div>

      {/* Task Summary */}
      {filteredTasks.length > 0 && (
        <div className='mt-6 p-4 bg-bg-card rounded-card'>
          <div className='flex items-center justify-between text-secondary'>
            <span className='text-text-secondary'>
              Showing {filteredTasks.length} of {sampleTasks.length} tasks
            </span>
            <div className='flex items-center gap-4'>
              <span className='text-text-secondary'>
                {sampleTasks.filter(t => t.state === 'completed').length} completed
              </span>
              <span className='text-priority-urgent'>
                {sampleTasks.filter(t => t.priority === 'urgent' && t.state !== 'completed').length} urgent
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksScreen;
