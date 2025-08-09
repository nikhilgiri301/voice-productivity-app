import React, { useState, useMemo, useCallback } from 'react';
import {
  TaskFilters,
  SwipeableTaskCard,
  type TaskFilterType,
  type TaskData,
  type TaskState,
} from '@/components/tasks';
import {
  sortByPriorityScore,
  getPriorityStats,
  filterByPriority,
  type Priority
} from '@/utils/priorities';
import { isOverdue } from '@/utils/dates';

const TasksScreen: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<TaskFilterType>('all');

  // Sample tasks data with various states, priorities, and due dates
  // All tasks now have due dates for better organization
  const sampleTasks: TaskData[] = [
    {
      id: '1',
      title: 'Review project proposal',
      description: 'Analyze the Q3 project proposal and provide detailed feedback on technical feasibility and resource requirements.',
      state: 'not-started',
      priority: 'critical',
      context: 'work',
      dueDate: new Date(), // Today
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      tags: ['review', 'project', 'critical'],
    },
    {
      id: '2',
      title: 'Update portfolio website',
      description: 'Add recent projects and update the design to reflect current skills and experience.',
      state: 'in-progress',
      priority: 'useful',
      context: 'personal',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // In 2 days
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      tags: ['portfolio', 'design', 'development'],
    },
    {
      id: '3',
      title: 'Call dentist for appointment',
      description: 'Schedule routine cleaning and checkup appointment.',
      state: 'deferred',
      priority: 'useful',
      context: 'personal',
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // In 4 days
      createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
      tags: ['health', 'appointment'],
    },
    {
      id: '4',
      title: 'Prepare presentation slides',
      description: 'Create comprehensive slides for the client presentation including project timeline, deliverables, and budget breakdown.',
      state: 'completed',
      priority: 'critical',
      context: 'work',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      tags: ['presentation', 'client', 'slides'],
    },
    {
      id: '5',
      title: 'Fix authentication bug',
      description: 'Investigate and resolve the login timeout issue reported by multiple users.',
      state: 'blocked',
      priority: 'critical',
      context: 'work',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      tags: ['bug', 'authentication', 'critical'],
    },
    {
      id: '6',
      title: 'Plan weekend trip',
      description: 'Research destinations, book accommodations, and create itinerary for the upcoming weekend getaway.',
      state: 'in-progress',
      priority: 'useful',
      context: 'personal',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      tags: ['travel', 'planning', 'weekend'],
    },
    {
      id: '7',
      title: 'Submit expense report',
      description: 'Compile and submit monthly expense report with receipts.',
      state: 'not-started',
      priority: 'useful',
      context: 'work',
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days overdue
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      tags: ['expenses', 'admin', 'monthly'],
    },
    {
      id: '8',
      title: 'Grocery shopping',
      description: 'Buy ingredients for meal prep and household essentials.',
      state: 'not-started',
      priority: 'useful',
      context: 'personal',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
      createdAt: new Date(),
      tags: ['shopping', 'meal-prep'],
    },
    {
      id: '9',
      title: 'Team standup meeting',
      description: 'Weekly team sync to discuss progress and blockers.',
      state: 'not-started',
      priority: 'critical',
      context: 'work',
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days overdue
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      tags: ['meeting', 'team', 'standup'],
    },
  ];

  // Calculate task counts for filter badges using utility functions
  const taskCounts = useMemo(() => {
    const stats = getPriorityStats(sampleTasks);
    return {
      all: stats.total,
      critical: stats.distribution.critical,
      useful: stats.distribution.useful,
    };
  }, [sampleTasks]);

  // Filter and organize tasks by due date sections
  const organizedTasks = useMemo(() => {
    let filtered: TaskData[];

    if (activeFilter === 'all') {
      filtered = sampleTasks;
    } else if (activeFilter === 'view') {
      // View filter logic - for now, show all tasks
      // This can be expanded later with view options
      filtered = sampleTasks;
    } else if (activeFilter === 'custom') {
      // Custom filter logic - for now, show all tasks
      // This can be expanded later with custom filter options
      filtered = sampleTasks;
    } else {
      filtered = filterByPriority(sampleTasks, activeFilter as Priority);
    }

    // Exclude completed tasks for now (we'll handle them separately later)
    const activeTasks = filtered.filter(task => task.state !== 'completed');

    // Group tasks by due date sections
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const overdue: TaskData[] = [];
    const dueToday: TaskData[] = [];
    const dueTomorrow: TaskData[] = [];
    const upcoming: TaskData[] = [];

    activeTasks.forEach(task => {
      if (!task.dueDate) return; // Skip tasks without due dates for now

      const taskDate = new Date(task.dueDate.getFullYear(), task.dueDate.getMonth(), task.dueDate.getDate());

      if (taskDate < today) {
        overdue.push(task);
      } else if (taskDate.getTime() === today.getTime()) {
        dueToday.push(task);
      } else if (taskDate.getTime() === tomorrow.getTime()) {
        dueTomorrow.push(task);
      } else {
        upcoming.push(task);
      }
    });

    // Sort each section
    // Overdue: most overdue first (earliest dates first)
    overdue.sort((a, b) => (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0));

    // Due today and tomorrow: sort by priority score
    dueToday.sort((a, b) => sortByPriorityScore([a, b]).indexOf(a) - sortByPriorityScore([a, b]).indexOf(b));
    dueTomorrow.sort((a, b) => sortByPriorityScore([a, b]).indexOf(a) - sortByPriorityScore([a, b]).indexOf(b));

    // Upcoming: chronological order (earliest first)
    upcoming.sort((a, b) => (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0));

    return {
      overdue,
      dueToday,
      dueTomorrow,
      upcoming,
      completed: filtered.filter(task => task.state === 'completed')
    };
  }, [sampleTasks, activeFilter]);

  const handleFilterChange = useCallback((filter: TaskFilterType): void => {
    setActiveFilter(filter);
  }, []);

  const handleTaskStateChange = useCallback((taskId: string, newState: TaskState): void => {
    // State change functionality will be implemented in Phase 3
    console.log('Task state change:', taskId, newState);
  }, []);

  const handleSwipeComplete = useCallback((taskId: string): void => {
    // Swipe complete functionality will be implemented in Phase 3
    console.log('Swipe complete:', taskId);
  }, []);

  const handleSwipeEdit = useCallback((taskId: string): void => {
    // Swipe edit functionality will be implemented in Phase 3
    console.log('Swipe edit:', taskId);
  }, []);

  const handleTaskClick = useCallback((task: TaskData): void => {
    // Task click functionality will be implemented in Phase 3
    console.log('Task clicked:', task.title);
  }, []);

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

      {/* Organized Tasks List */}
      <div className='space-y-6'>
        {/* Check if we have any active tasks */}
        {organizedTasks.overdue.length === 0 &&
         organizedTasks.dueToday.length === 0 &&
         organizedTasks.dueTomorrow.length === 0 &&
         organizedTasks.upcoming.length === 0 ? (
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
          <>
            {/* Overdue Section */}
            {organizedTasks.overdue.length > 0 && (
              <div className='space-y-3'>
                <h2 className='text-base text-text-primary font-semibold'>
                  Overdue ({organizedTasks.overdue.length})
                </h2>
                {organizedTasks.overdue.map((task) => (
                  <SwipeableTaskCard
                    key={task.id}
                    task={task}
                    onStateChange={handleTaskStateChange}
                    onSwipeComplete={handleSwipeComplete}
                    onSwipeEdit={handleSwipeEdit}
                    onClick={handleTaskClick}
                  />
                ))}
              </div>
            )}

            {/* Due Today Section */}
            {organizedTasks.dueToday.length > 0 && (
              <div className='space-y-3'>
                <h2 className='text-base text-text-primary font-semibold'>
                  Due Today ({organizedTasks.dueToday.length})
                </h2>
                {organizedTasks.dueToday.map((task) => (
                  <SwipeableTaskCard
                    key={task.id}
                    task={task}
                    onStateChange={handleTaskStateChange}
                    onSwipeComplete={handleSwipeComplete}
                    onSwipeEdit={handleSwipeEdit}
                    onClick={handleTaskClick}
                  />
                ))}
              </div>
            )}

            {/* Due Tomorrow Section */}
            {organizedTasks.dueTomorrow.length > 0 && (
              <div className='space-y-3'>
                <h2 className='text-base text-text-primary font-semibold'>
                  Due Tomorrow ({organizedTasks.dueTomorrow.length})
                </h2>
                {organizedTasks.dueTomorrow.map((task) => (
                  <SwipeableTaskCard
                    key={task.id}
                    task={task}
                    onStateChange={handleTaskStateChange}
                    onSwipeComplete={handleSwipeComplete}
                    onSwipeEdit={handleSwipeEdit}
                    onClick={handleTaskClick}
                  />
                ))}
              </div>
            )}

            {/* Upcoming Section */}
            {organizedTasks.upcoming.length > 0 && (
              <div className='space-y-3'>
                <h2 className='text-base text-text-primary font-semibold'>
                  Upcoming ({organizedTasks.upcoming.length})
                </h2>
                {organizedTasks.upcoming.map((task) => (
                  <SwipeableTaskCard
                    key={task.id}
                    task={task}
                    onStateChange={handleTaskStateChange}
                    onSwipeComplete={handleSwipeComplete}
                    onSwipeEdit={handleSwipeEdit}
                    onClick={handleTaskClick}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Task Summary */}
      {(organizedTasks.overdue.length > 0 ||
        organizedTasks.dueToday.length > 0 ||
        organizedTasks.dueTomorrow.length > 0 ||
        organizedTasks.upcoming.length > 0) && (
        <div className='mt-6 p-4 bg-bg-card rounded-card'>
          <div className='flex items-center justify-between text-secondary'>
            <span className='text-text-secondary'>
              Showing {organizedTasks.overdue.length + organizedTasks.dueToday.length + organizedTasks.dueTomorrow.length + organizedTasks.upcoming.length} active tasks
            </span>
            <div className='flex items-center gap-4'>
              <span className='text-text-secondary'>
                {organizedTasks.completed.length} completed
              </span>
              <span className='text-priority-urgent'>
                {sampleTasks.filter(t => t.priority === 'critical' && t.state !== 'completed').length} critical
              </span>
              <span className='text-priority-urgent'>
                {organizedTasks.overdue.length} overdue
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksScreen;
