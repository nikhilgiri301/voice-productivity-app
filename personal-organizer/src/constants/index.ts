/**
 * Central Constants System - Single Source of Truth
 * 
 * This file defines ALL semantic values used throughout the application.
 * Any changes to priorities, states, contexts, or their associated values
 * should ONLY be made here to ensure system-wide consistency.
 */

// =============================================================================
// SEMANTIC TYPE DEFINITIONS
// =============================================================================

/**
 * Task and item priority levels
 * - critical: High importance, urgent attention required (red)
 * - useful: Moderate importance, should be addressed (yellow)
 */
export type Priority = 'critical' | 'useful';

/**
 * Task state definitions
 * - not-started: Task has not been begun
 * - in-progress: Task is currently being worked on
 * - blocked: Task cannot proceed due to external dependency
 * - deferred: Task has been postponed to a later time
 * - cancelled: Task has been cancelled and will not be completed
 * - completed: Task has been finished successfully
 */
export type TaskState = 'not-started' | 'in-progress' | 'blocked' | 'deferred' | 'cancelled' | 'completed';

/**
 * Context categories for organizing items
 * - work: Professional, business-related items
 * - personal: Personal, non-work related items
 */
export type Context = 'work' | 'personal';

/**
 * Voice processing states
 * - idle: Not processing, ready for input
 * - listening: Actively recording voice input
 * - processing: Analyzing and interpreting voice input
 * - error: Error occurred during processing
 */
export type VoiceState = 'idle' | 'listening' | 'processing' | 'error';

// =============================================================================
// PRIORITY SYSTEM
// =============================================================================

/**
 * Priority levels with numeric values for sorting and comparison
 * Higher numbers indicate higher priority
 */
export const PRIORITY_LEVELS: Record<Priority, number> = {
  critical: 2,
  useful: 1,
} as const;

/**
 * Priority display labels for UI
 */
export const PRIORITY_LABELS: Record<Priority, string> = {
  critical: 'Critical',
  useful: 'Useful',
} as const;

/**
 * Priority color values (hex codes)
 * These are the authoritative color definitions
 */
export const PRIORITY_COLORS: Record<Priority, string> = {
  critical: '#ff6363', // red - for urgent/critical items
  useful: '#ffc107',   // yellow - for useful/moderate items
} as const;

/**
 * Priority background colors for UI elements
 */
export const PRIORITY_BG_COLORS: Record<Priority, string> = {
  critical: '#fee2e2', // red-100 equivalent
  useful: '#fef3c7',   // yellow-100 equivalent
} as const;

/**
 * Priority icons for visual representation
 */
export const PRIORITY_ICONS: Record<Priority, string> = {
  critical: '🔥',
  useful: '⚡',
} as const;

// =============================================================================
// TASK STATE SYSTEM
// =============================================================================

/**
 * Task state display labels for UI
 */
export const TASK_STATE_LABELS: Record<TaskState, string> = {
  'not-started': 'Not Started',
  'in-progress': 'In Progress',
  'blocked': 'Blocked',
  'deferred': 'Deferred',
  'cancelled': 'Cancelled',
  'completed': 'Completed',
} as const;

/**
 * Task state colors for UI representation
 */
export const TASK_STATE_COLORS: Record<TaskState, string> = {
  'not-started': '#6b7280', // gray-500
  'in-progress': '#3b82f6', // blue-500
  'blocked': '#ef4444',     // red-500
  'deferred': '#f59e0b',    // amber-500
  'cancelled': '#6b7280',   // gray-500
  'completed': '#10b981',   // emerald-500
} as const;

// =============================================================================
// CONTEXT SYSTEM
// =============================================================================

/**
 * Context display labels for UI
 */
export const CONTEXT_LABELS: Record<Context, string> = {
  work: 'Work',
  personal: 'Personal',
} as const;

/**
 * Context colors for accent borders and UI elements
 */
export const CONTEXT_COLORS: Record<Context, string> = {
  work: '#4a90e2',     // blue - for work context
  personal: '#4caf50', // green - for personal context
} as const;

/**
 * Context icons for visual representation
 */
export const CONTEXT_ICONS: Record<Context, string> = {
  work: '💼',
  personal: '🏠',
} as const;

// =============================================================================
// VOICE STATE SYSTEM
// =============================================================================

/**
 * Voice state display labels for UI
 */
export const VOICE_STATE_LABELS: Record<VoiceState, string> = {
  idle: 'Ready',
  listening: 'Listening...',
  processing: 'Processing...',
  error: 'Error',
} as const;

/**
 * Voice state colors for UI representation
 */
export const VOICE_STATE_COLORS: Record<VoiceState, string> = {
  idle: '#e91e63',      // pink/magenta - accent color
  listening: '#ff6363', // red - urgent attention
  processing: '#ffc107', // yellow - processing
  error: '#ef4444',     // red - error state
} as const;

// =============================================================================
// CSS CLASS NAME GENERATORS
// =============================================================================

/**
 * Generate CSS class names for priority-based styling
 */
export const getPriorityClasses = (priority: Priority) => ({
  text: `text-priority-${priority}` as const,
  bg: `bg-priority-${priority}` as const,
  border: `border-priority-${priority}` as const,
  ring: `ring-priority-${priority}` as const,
});

/**
 * Generate CSS class names for context-based styling
 */
export const getContextClasses = (context: Context) => ({
  text: `text-context-${context}` as const,
  bg: `bg-context-${context}` as const,
  border: `border-context-${context}` as const,
  ring: `ring-context-${context}` as const,
});

/**
 * Generate CSS class names for task state styling
 */
export const getTaskStateClasses = (state: TaskState) => ({
  text: `text-state-${state}` as const,
  bg: `bg-state-${state}` as const,
  border: `border-state-${state}` as const,
  ring: `ring-state-${state}` as const,
});

// =============================================================================
// VALIDATION ARRAYS
// =============================================================================

/**
 * Arrays for runtime validation and iteration
 */
export const ALL_PRIORITIES: Priority[] = ['critical', 'useful'] as const;
export const ALL_TASK_STATES: TaskState[] = ['not-started', 'in-progress', 'blocked', 'deferred', 'cancelled', 'completed'] as const;
export const ALL_CONTEXTS: Context[] = ['work', 'personal'] as const;
export const ALL_VOICE_STATES: VoiceState[] = ['idle', 'listening', 'processing', 'error'] as const;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get priority level as number for sorting
 */
export const getPriorityLevel = (priority: Priority): number => {
  return PRIORITY_LEVELS[priority];
};

/**
 * Get priority color value
 */
export const getPriorityColor = (priority: Priority): string => {
  return PRIORITY_COLORS[priority];
};

/**
 * Get context color value
 */
export const getContextColor = (context: Context): string => {
  return CONTEXT_COLORS[context];
};

/**
 * Check if a priority is high (critical)
 */
export const isHighPriority = (priority: Priority): boolean => {
  return priority === 'critical';
};

/**
 * Check if a task state indicates completion
 */
export const isTaskCompleted = (state: TaskState): boolean => {
  return state === 'completed';
};

/**
 * Check if a task state indicates active work
 */
export const isTaskActive = (state: TaskState): boolean => {
  return state === 'in-progress';
};

/**
 * Check if a task state indicates a problem
 */
export const isTaskProblematic = (state: TaskState): boolean => {
  return state === 'blocked' || state === 'cancelled';
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // Types are exported above
  
  // Constants
  PRIORITY_LEVELS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  PRIORITY_BG_COLORS,
  PRIORITY_ICONS,
  
  TASK_STATE_LABELS,
  TASK_STATE_COLORS,
  
  CONTEXT_LABELS,
  CONTEXT_COLORS,
  CONTEXT_ICONS,
  
  VOICE_STATE_LABELS,
  VOICE_STATE_COLORS,
  
  // Validation Arrays
  ALL_PRIORITIES,
  ALL_TASK_STATES,
  ALL_CONTEXTS,
  ALL_VOICE_STATES,
  
  // Class Generators
  getPriorityClasses,
  getContextClasses,
  getTaskStateClasses,
  
  // Utility Functions
  getPriorityLevel,
  getPriorityColor,
  getContextColor,
  isHighPriority,
  isTaskCompleted,
  isTaskActive,
  isTaskProblematic,
};
