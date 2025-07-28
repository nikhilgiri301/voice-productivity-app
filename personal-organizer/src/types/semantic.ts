/**
 * Semantic Type Definitions - Comprehensive Type System
 * 
 * This file defines all TypeScript types and interfaces for semantic values
 * used throughout the application. These types ensure type safety and
 * consistency across all components and utilities.
 */

// Re-export core types from constants for consistency
export type {
  Priority,
  TaskState,
  Context,
  VoiceState,
} from '../constants';

// =============================================================================
// BASE ENTITY INTERFACES
// =============================================================================

/**
 * Base interface for all entities with common fields
 */
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string; // For multi-user support in future
}

/**
 * Base interface for entities with semantic categorization
 */
export interface SemanticEntity extends BaseEntity {
  context: Context;
  tags?: string[];
}

// =============================================================================
// TASK SYSTEM TYPES
// =============================================================================

/**
 * Complete task data structure
 */
export interface TaskData extends SemanticEntity {
  title: string;
  description?: string;
  state: TaskState;
  priority: Priority;
  dueDate?: Date;
  completedAt?: Date;
  estimatedDuration?: number; // in minutes
  actualDuration?: number;    // in minutes
  linkedItems?: LinkedItem[];
  attachments?: Attachment[];
}

/**
 * Task creation input (omits generated fields)
 */
export interface CreateTaskInput {
  title: string;
  description?: string;
  priority: Priority;
  context: Context;
  dueDate?: Date;
  estimatedDuration?: number;
  tags?: string[];
}

/**
 * Task update input (all fields optional except id)
 */
export interface UpdateTaskInput {
  id: string;
  title?: string;
  description?: string;
  state?: TaskState;
  priority?: Priority;
  context?: Context;
  dueDate?: Date;
  estimatedDuration?: number;
  tags?: string[];
}

/**
 * Task filter criteria
 */
export interface TaskFilters {
  priorities?: Priority[];
  states?: TaskState[];
  contexts?: Context[];
  tags?: string[];
  dueDateRange?: {
    start?: Date;
    end?: Date;
  };
  searchQuery?: string;
  isOverdue?: boolean;
}

/**
 * Task sorting options
 */
export interface TaskSortOptions {
  field: 'priority' | 'dueDate' | 'createdAt' | 'title' | 'state';
  direction: 'asc' | 'desc';
}

// =============================================================================
// SCHEDULE SYSTEM TYPES
// =============================================================================

/**
 * Schedule event data structure
 */
export interface ScheduleEvent extends SemanticEntity {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  isAllDay: boolean;
  recurrence?: RecurrencePattern;
  attendees?: string[];
  linkedItems?: LinkedItem[];
  attachments?: Attachment[];
}

/**
 * Recurrence pattern for repeating events
 */
export interface RecurrencePattern {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number; // every N days/weeks/months/years
  endDate?: Date;
  occurrences?: number; // number of occurrences
  daysOfWeek?: number[]; // 0-6, Sunday = 0
}

/**
 * Schedule event creation input
 */
export interface CreateScheduleEventInput {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  context: Context;
  location?: string;
  isAllDay?: boolean;
  recurrence?: RecurrencePattern;
  tags?: string[];
}

/**
 * Schedule event update input
 */
export interface UpdateScheduleEventInput {
  id: string;
  title?: string;
  description?: string;
  startTime?: Date;
  endTime?: Date;
  context?: Context;
  location?: string;
  isAllDay?: boolean;
  recurrence?: RecurrencePattern;
  tags?: string[];
}

// =============================================================================
// NOTES SYSTEM TYPES
// =============================================================================

/**
 * Note data structure
 */
export interface NoteData extends SemanticEntity {
  title: string;
  content: string;
  isArchived: boolean;
  linkedItems?: LinkedItem[];
  attachments?: Attachment[];
}

/**
 * Note creation input
 */
export interface CreateNoteInput {
  title: string;
  content: string;
  context: Context;
  tags?: string[];
}

/**
 * Note update input
 */
export interface UpdateNoteInput {
  id: string;
  title?: string;
  content?: string;
  context?: Context;
  isArchived?: boolean;
  tags?: string[];
}

// =============================================================================
// SHARED UTILITY TYPES
// =============================================================================

/**
 * Linked item reference for cross-entity relationships
 */
export interface LinkedItem {
  id: string;
  type: 'task' | 'event' | 'note';
  title: string;
}

/**
 * File attachment structure
 */
export interface Attachment {
  id: string;
  filename: string;
  mimeType: string;
  size: number; // in bytes
  url: string;
  uploadedAt: Date;
}

/**
 * Voice processing result
 */
export interface VoiceProcessingResult {
  transcript: string;
  confidence: number; // 0-1
  intent?: {
    action: 'create' | 'update' | 'delete' | 'search' | 'navigate';
    entity: 'task' | 'event' | 'note';
    parameters: Record<string, any>;
  };
  error?: string;
}

/**
 * Voice command context
 */
export interface VoiceCommandContext {
  currentScreen: 'tasks' | 'schedule' | 'notes';
  selectedItems?: string[]; // IDs of currently selected items
  filters?: TaskFilters;
  user?: {
    id: string;
    preferences: UserPreferences;
  };
}

// =============================================================================
// USER PREFERENCES TYPES
// =============================================================================

/**
 * User preference settings
 */
export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  defaultContext: Context;
  defaultPriority: Priority;
  timeFormat: '12h' | '24h';
  dateFormat: 'US' | 'EU' | 'ISO';
  notifications: NotificationSettings;
  voice: VoiceSettings;
}

/**
 * Notification preference settings
 */
export interface NotificationSettings {
  enabled: boolean;
  taskReminders: boolean;
  eventReminders: boolean;
  overdueAlerts: boolean;
  reminderTiming: number; // minutes before due time
}

/**
 * Voice feature settings
 */
export interface VoiceSettings {
  enabled: boolean;
  language: string;
  autoListen: boolean;
  confirmActions: boolean;
}

// =============================================================================
// COMPONENT PROP TYPES
// =============================================================================

/**
 * Common props for card components
 */
export interface BaseCardProps {
  className?: string;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  hoverable?: boolean;
  selected?: boolean;
}

/**
 * Task card component props
 */
export interface TaskCardProps extends BaseCardProps {
  task: TaskData;
  onStateChange?: (taskId: string, newState: TaskState) => void;
  showContext?: boolean;
  showPriority?: boolean;
  showDueDate?: boolean;
  showTags?: boolean;
}

/**
 * Schedule card component props
 */
export interface ScheduleCardProps extends BaseCardProps {
  event: ScheduleEvent;
  onTimeChange?: (eventId: string, startTime: Date, endTime: Date) => void;
  showContext?: boolean;
  showLocation?: boolean;
  showAttendees?: boolean;
}

/**
 * Note card component props
 */
export interface NoteCardProps extends BaseCardProps {
  note: NoteData;
  onArchive?: (noteId: string) => void;
  showContext?: boolean;
  showPreview?: boolean;
  maxPreviewLength?: number;
}

/**
 * Filter component props
 */
export interface FilterProps<T> {
  filters: T;
  onFiltersChange: (filters: T) => void;
  availableOptions: {
    priorities?: Priority[];
    states?: TaskState[];
    contexts?: Context[];
    tags?: string[];
  };
  className?: string;
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
  };
}

/**
 * Paginated response for list endpoints
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
    totalPages: number;
  };
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Make specific fields optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make specific fields required
 */
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Extract the value type from a const assertion
 */
export type ValueOf<T> = T[keyof T];

/**
 * Create a union type from an array of strings
 */
export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

// =============================================================================
// TYPE GUARDS
// =============================================================================

/**
 * Type guard function signatures (implementations in utils/type-guards.ts)
 */
export type PriorityGuard = (value: unknown) => value is Priority;
export type TaskStateGuard = (value: unknown) => value is TaskState;
export type ContextGuard = (value: unknown) => value is Context;
export type VoiceStateGuard = (value: unknown) => value is VoiceState;

// =============================================================================
// FORM VALIDATION TYPES
// =============================================================================

/**
 * Form field validation result
 */
export interface FieldValidation {
  isValid: boolean;
  error?: string;
  warnings?: string[];
}

/**
 * Form validation state
 */
export interface FormValidationState {
  [fieldName: string]: FieldValidation;
}

/**
 * Form submission state
 */
export interface FormSubmissionState {
  isSubmitting: boolean;
  hasSubmitted: boolean;
  submitError?: string;
  submitSuccess?: boolean;
}

// =============================================================================
// SEARCH AND FILTERING TYPES
// =============================================================================

/**
 * Search result item
 */
export interface SearchResultItem {
  id: string;
  type: 'task' | 'event' | 'note';
  title: string;
  description?: string;
  context: Context;
  relevanceScore: number; // 0-1
  matchedFields: string[];
  highlightedText?: string;
}

/**
 * Search options
 */
export interface SearchOptions {
  query: string;
  types?: ('task' | 'event' | 'note')[];
  contexts?: Context[];
  limit?: number;
  includeArchived?: boolean;
  fuzzyMatch?: boolean;
}

// =============================================================================
// STATISTICS AND ANALYTICS TYPES
// =============================================================================

/**
 * Priority distribution statistics
 */
export interface PriorityStats {
  total: number;
  distribution: Record<Priority, number>;
  percentages: Record<Priority, number>;
}

/**
 * Task completion statistics
 */
export interface TaskCompletionStats {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
  completionRate: number; // 0-1
  averageCompletionTime?: number; // in hours
}

/**
 * Context usage statistics
 */
export interface ContextStats {
  distribution: Record<Context, number>;
  percentages: Record<Context, number>;
  mostActive: Context;
}

/**
 * Time-based statistics
 */
export interface TimeStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
  overdue: number;
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  // All types are exported above as individual exports
  // This default export is for convenience when importing the entire module
};
