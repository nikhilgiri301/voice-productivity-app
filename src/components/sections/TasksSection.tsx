import React, { useState, useEffect } from 'react';
import BaseSection from './BaseSection';
import { TaskFilterBar, TaskList } from '../tasks';

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

interface TaskFilters {
  priorities: ('high' | 'medium' | 'low')[];
  statuses: ('pending' | 'in-progress' | 'completed' | 'overdue')[];
  dueDateFilter: 'all' | 'today' | 'tomorrow' | 'this-week' | 'overdue' | 'no-due-date';
  categories: string[];
  showCompleted: boolean;
  sortBy: 'due-date' | 'priority' | 'created' | 'title' | 'completion';
  sortOrder: 'asc' | 'desc';
}

export const TasksSection: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<TaskFilters>({
    priorities: ['high', 'medium', 'low'],
    statuses: ['pending', 'in-progress'],
    dueDateFilter: 'all',
    categories: [],
    showCompleted: false,
    sortBy: 'due-date',
    sortOrder: 'asc',
  });

  // Mock data for demonstration
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Review quarterly reports',
        description: 'Q4 financial review and analysis',
        completed: false,
        priority: 'high',
        dueDate: today,
        dueTime: '2:00 PM',
        category: 'work',
        tags: ['finance', 'quarterly'],
        estimatedMinutes: 120,
        createdAt: new Date().toISOString(),
        linkedItems: [
          { id: 'e1', type: 'event', title: 'Q4 Review Meeting' },
        ],
        subtasks: [
          { id: 'st1', title: 'Gather financial data', completed: true },
          { id: 'st2', title: 'Analyze trends', completed: false },
          { id: 'st3', title: 'Prepare presentation', completed: false },
        ],
      },
      {
        id: '2',
        title: 'Update project documentation',
        description: 'Add new API endpoints to documentation',
        completed: false,
        priority: 'medium',
        dueDate: tomorrowStr,
        category: 'development',
        tags: ['documentation', 'api'],
        estimatedMinutes: 90,
        createdAt: new Date().toISOString(),
        subtasks: [
          { id: 'st4', title: 'Document new endpoints', completed: false },
          { id: 'st5', title: 'Update examples', completed: false },
        ],
      },
      {
        id: '3',
        title: 'Buy groceries',
        description: 'Weekly grocery shopping',
        completed: true,
        priority: 'low',
        dueDate: today,
        category: 'personal',
        tags: ['shopping', 'weekly'],
        estimatedMinutes: 60,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      },
      {
        id: '4',
        title: 'Prepare presentation slides',
        description: 'Create slides for client presentation',
        completed: false,
        priority: 'high',
        dueDate: today,
        dueTime: '4:00 PM',
        category: 'work',
        tags: ['presentation', 'client'],
        estimatedMinutes: 180,
        createdAt: new Date().toISOString(),
        linkedItems: [
          { id: 'e2', type: 'event', title: 'Client Presentation' },
          { id: 'n1', type: 'note', title: 'Presentation outline' },
        ],
      },
      {
        id: '5',
        title: 'Call dentist for appointment',
        completed: false,
        priority: 'medium',
        category: 'personal',
        tags: ['health', 'appointment'],
        estimatedMinutes: 15,
        createdAt: new Date().toISOString(),
      },
    ];
    setTasks(mockTasks);
  }, []);

  // Filter and search tasks
  useEffect(() => {
    let filtered = [...tasks];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        task.category?.toLowerCase().includes(query)
      );
    }

    // Apply priority filter
    filtered = filtered.filter(task => filters.priorities.includes(task.priority));

    // Apply status filter
    filtered = filtered.filter(task => {
      if (task.completed && !filters.showCompleted) return false;

      const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

      if (task.completed) {
        return filters.statuses.includes('completed');
      } else if (isOverdue) {
        return filters.statuses.includes('overdue');
      } else {
        return filters.statuses.includes('pending') || filters.statuses.includes('in-progress');
      }
    });

    // Apply due date filter
    if (filters.dueDateFilter !== 'all') {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const weekFromNow = new Date(today);
      weekFromNow.setDate(weekFromNow.getDate() + 7);

      filtered = filtered.filter(task => {
        if (!task.dueDate && filters.dueDateFilter === 'no-due-date') return true;
        if (!task.dueDate) return false;

        const dueDate = new Date(task.dueDate);

        switch (filters.dueDateFilter) {
          case 'today':
            return dueDate.toDateString() === today.toDateString();
          case 'tomorrow':
            return dueDate.toDateString() === tomorrow.toDateString();
          case 'this-week':
            return dueDate <= weekFromNow && dueDate >= today;
          case 'overdue':
            return dueDate < today && !task.completed;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case 'due-date':
          if (!a.dueDate && !b.dueDate) comparison = 0;
          else if (!a.dueDate) comparison = 1;
          else if (!b.dueDate) comparison = -1;
          else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
          break;
        case 'created':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'completion':
          const aCompletion = a.subtasks ? (a.subtasks.filter(st => st.completed).length / a.subtasks.length) : (a.completed ? 1 : 0);
          const bCompletion = b.subtasks ? (b.subtasks.filter(st => st.completed).length / b.subtasks.length) : (b.completed ? 1 : 0);
          comparison = bCompletion - aCompletion;
          break;
      }

      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    setFilteredTasks(filtered);
  }, [tasks, searchQuery, filters]);

  const handleSectionEnter = () => {
    console.log('Tasks section entered');
  };

  const handleSectionExit = () => {
    console.log('Tasks section exited');
  };

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? {
        ...task,
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : undefined
      } : task
    ));
  };

  const handleEditTask = (task: Task) => {
    console.log('Edit task:', task);
    // Open edit modal or navigate to edit page
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleTaskReorder = (fromIndex: number, toIndex: number) => {
    const newTasks = [...tasks];
    const [movedTask] = newTasks.splice(fromIndex, 1);
    newTasks.splice(toIndex, 0, movedTask);
    setTasks(newTasks);
  };

  const handleBulkAction = (action: string, taskIds: string[]) => {
    console.log('Bulk action:', action, taskIds);

    switch (action) {
      case 'complete':
        setTasks(tasks.map(task =>
          taskIds.includes(task.id) ? {
            ...task,
            completed: true,
            completedAt: new Date().toISOString()
          } : task
        ));
        break;
      case 'delete':
        setTasks(tasks.filter(task => !taskIds.includes(task.id)));
        break;
    }
  };

  const handleFilterChange = (newFilters: TaskFilters) => {
    setFilters(newFilters);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <BaseSection
      tabType="tasks"
      onEnter={handleSectionEnter}
      onExit={handleSectionExit}
    >
      {/* Task Filter Bar */}
      <TaskFilterBar
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        style={{ marginBottom: '24px' }}
      />

      {/* Task List */}
      <TaskList
        tasks={filteredTasks}
        onTaskToggle={handleToggleTask}
        onTaskEdit={handleEditTask}
        onTaskDelete={handleDeleteTask}
        onTaskReorder={handleTaskReorder}
        onBulkAction={handleBulkAction}
        loading={loading}
        groupBy="priority"
        enableBulkSelection={true}
        enableDragReorder={true}
        enableSwipeActions={true}
        compact={false}
        style={{
          height: 'calc(100vh - 200px)', // Adjust based on filter bar height
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-primary)',
          backdropFilter: 'blur(20px)',
        }}
      />
    </BaseSection>
  );
};

export default TasksSection;
