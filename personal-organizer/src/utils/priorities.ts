/**
 * Priority utility functions for the voice-first productivity app
 * Handles priority calculations, color mapping, and priority-based sorting
 */

export type Priority = 'urgent' | 'important';
export type Context = 'work' | 'personal';

/**
 * Priority levels with numeric values for sorting
 */
export const PRIORITY_LEVELS: Record<Priority, number> = {
  urgent: 2,
  important: 1,
} as const;

/**
 * Priority color mappings for UI components
 */
export const PRIORITY_COLORS: Record<Priority, string> = {
  urgent: 'rgb(239, 68, 68)', // red-500
  important: 'rgb(234, 179, 8)', // yellow-500
} as const;

/**
 * Priority background colors for UI components
 */
export const PRIORITY_BG_COLORS: Record<Priority, string> = {
  urgent: 'rgb(254, 226, 226)', // red-100
  important: 'rgb(254, 249, 195)', // yellow-100
} as const;

/**
 * Context color mappings
 */
export const CONTEXT_COLORS: Record<Context, string> = {
  work: 'rgb(59, 130, 246)', // blue-500
  personal: 'rgb(168, 85, 247)', // purple-500
} as const;

/**
 * Get priority level as number for sorting
 */
export const getPriorityLevel = (priority: Priority): number => {
  return PRIORITY_LEVELS[priority];
};

/**
 * Get priority color
 */
export const getPriorityColor = (priority: Priority): string => {
  return PRIORITY_COLORS[priority];
};

/**
 * Get priority background color
 */
export const getPriorityBgColor = (priority: Priority): string => {
  return PRIORITY_BG_COLORS[priority];
};

/**
 * Get context color
 */
export const getContextColor = (context: Context): string => {
  return CONTEXT_COLORS[context];
};

/**
 * Sort items by priority (urgent first, then important)
 */
export const sortByPriority = <T extends { priority: Priority }>(items: T[]): T[] => {
  return [...items].sort((a, b) => getPriorityLevel(b.priority) - getPriorityLevel(a.priority));
};

/**
 * Sort items by priority and then by date
 */
export const sortByPriorityAndDate = <T extends { priority: Priority; createdAt: Date }>(
  items: T[],
  dateOrder: 'asc' | 'desc' = 'desc'
): T[] => {
  return [...items].sort((a, b) => {
    // First sort by priority
    const priorityDiff = getPriorityLevel(b.priority) - getPriorityLevel(a.priority);
    if (priorityDiff !== 0) return priorityDiff;
    
    // Then sort by date
    const dateDiff = b.createdAt.getTime() - a.createdAt.getTime();
    return dateOrder === 'desc' ? dateDiff : -dateDiff;
  });
};

/**
 * Filter items by priority
 */
export const filterByPriority = <T extends { priority: Priority }>(
  items: T[],
  priority: Priority
): T[] => {
  return items.filter(item => item.priority === priority);
};

/**
 * Filter items by context
 */
export const filterByContext = <T extends { context: Context }>(
  items: T[],
  context: Context
): T[] => {
  return items.filter(item => item.context === context);
};

/**
 * Get priority distribution (count of each priority level)
 */
export const getPriorityDistribution = <T extends { priority: Priority }>(
  items: T[]
): Record<Priority, number> => {
  return items.reduce(
    (acc, item) => {
      acc[item.priority] = (acc[item.priority] || 0) + 1;
      return acc;
    },
    { urgent: 0, important: 0 } as Record<Priority, number>
  );
};

/**
 * Get context distribution (count of each context)
 */
export const getContextDistribution = <T extends { context: Context }>(
  items: T[]
): Record<Context, number> => {
  return items.reduce(
    (acc, item) => {
      acc[item.context] = (acc[item.context] || 0) + 1;
      return acc;
    },
    { work: 0, personal: 0 } as Record<Context, number>
  );
};

/**
 * Calculate priority score based on multiple factors
 */
export const calculatePriorityScore = (
  priority: Priority,
  dueDate?: Date,
  createdAt?: Date,
  baseDate: Date = new Date()
): number => {
  let score = getPriorityLevel(priority) * 10; // Base score from priority

  // Add urgency based on due date
  if (dueDate) {
    const daysUntilDue = Math.ceil((dueDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue < 0) {
      // Overdue items get highest urgency
      score += 50;
    } else if (daysUntilDue === 0) {
      // Due today
      score += 30;
    } else if (daysUntilDue === 1) {
      // Due tomorrow
      score += 20;
    } else if (daysUntilDue <= 3) {
      // Due within 3 days
      score += 10;
    } else if (daysUntilDue <= 7) {
      // Due within a week
      score += 5;
    }
  }

  // Add age factor (older items get slightly higher priority)
  if (createdAt) {
    const daysOld = Math.floor((baseDate.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    score += Math.min(daysOld * 0.5, 10); // Cap age bonus at 10 points
  }

  return score;
};

/**
 * Sort items by calculated priority score
 */
export const sortByPriorityScore = <T extends { 
  priority: Priority; 
  dueDate?: Date; 
  createdAt?: Date 
}>(
  items: T[],
  baseDate: Date = new Date()
): T[] => {
  return [...items].sort((a, b) => {
    const scoreA = calculatePriorityScore(a.priority, a.dueDate, a.createdAt, baseDate);
    const scoreB = calculatePriorityScore(b.priority, b.dueDate, b.createdAt, baseDate);
    return scoreB - scoreA; // Higher scores first
  });
};

/**
 * Get priority label for display
 */
export const getPriorityLabel = (priority: Priority): string => {
  const labels: Record<Priority, string> = {
    urgent: 'Urgent',
    important: 'Important',
  };
  return labels[priority];
};

/**
 * Get context label for display
 */
export const getContextLabel = (context: Context): string => {
  const labels: Record<Context, string> = {
    work: 'Work',
    personal: 'Personal',
  };
  return labels[context];
};

/**
 * Get priority icon
 */
export const getPriorityIcon = (priority: Priority): string => {
  const icons: Record<Priority, string> = {
    urgent: '🔥',
    important: '⚡',
  };
  return icons[priority];
};

/**
 * Get context icon
 */
export const getContextIcon = (context: Context): string => {
  const icons: Record<Context, string> = {
    work: '💼',
    personal: '🏠',
  };
  return icons[context];
};

/**
 * Determine if a priority level is high (urgent or important)
 */
export const isHighPriority = (priority: Priority): boolean => {
  return priority === 'urgent' || priority === 'important';
};

/**
 * Get recommended priority based on due date and context
 */
export const getRecommendedPriority = (
  dueDate?: Date,
  context?: Context,
  baseDate: Date = new Date()
): Priority => {
  if (!dueDate) return 'important';

  const daysUntilDue = Math.ceil((dueDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));

  // Overdue or due today/tomorrow
  if (daysUntilDue <= 1) {
    return 'urgent';
  }

  // Due within a week
  if (daysUntilDue <= 7) {
    return context === 'work' ? 'important' : 'important';
  }

  // Due within two weeks
  if (daysUntilDue <= 14) {
    return 'important';
  }

  // Everything else
  return 'important';
};

/**
 * Get priority statistics for a collection of items
 */
export const getPriorityStats = <T extends { priority: Priority; dueDate?: Date }>(
  items: T[],
  baseDate: Date = new Date()
): {
  total: number;
  distribution: Record<Priority, number>;
  overdue: number;
  dueToday: number;
  dueTomorrow: number;
  highPriority: number;
} => {
  const distribution = getPriorityDistribution(items);
  
  let overdue = 0;
  let dueToday = 0;
  let dueTomorrow = 0;
  
  items.forEach(item => {
    if (item.dueDate) {
      const daysUntilDue = Math.ceil((item.dueDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilDue < 0) overdue++;
      else if (daysUntilDue === 0) dueToday++;
      else if (daysUntilDue === 1) dueTomorrow++;
    }
  });

  return {
    total: items.length,
    distribution,
    overdue,
    dueToday,
    dueTomorrow,
    highPriority: distribution.urgent + distribution.important,
  };
};
