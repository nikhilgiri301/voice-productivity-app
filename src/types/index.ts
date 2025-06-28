// Core data model for the productivity organizer

export type ItemType = 'calendar' | 'task' | 'note';
export type Priority = 'high' | 'medium' | 'low';
export type CreatedVia = 'voice' | 'manual';

export interface ProductivityItem {
  id: string;
  type: ItemType;
  title: string;
  description?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  
  // Calendar-specific fields
  start_time?: string;
  end_time?: string;
  location?: string;
  attendees?: string[];
  
  // Task-specific fields
  due_date?: string;
  priority?: Priority;
  completed?: boolean;
  
  // Note-specific fields
  content?: string;
  tags?: string[];
  
  // Linking & Context
  linked_items?: string[]; // IDs of related items
  created_via: CreatedVia;
  ai_confidence?: number; // 0-1 for voice-created items
}

// Calendar Event specific interface
export interface CalendarEvent extends Omit<ProductivityItem, 'type'> {
  type: 'calendar';
  start_time: string;
  end_time: string;
  location?: string;
  attendees?: string[];
}

// Task specific interface
export interface Task extends Omit<ProductivityItem, 'type'> {
  type: 'task';
  due_date?: string;
  priority?: Priority;
  completed: boolean;
}

// Note specific interface
export interface Note extends Omit<ProductivityItem, 'type'> {
  type: 'note';
  content: string;
  tags?: string[];
}

// Voice processing types
export interface VoiceCommand {
  transcript: string;
  confidence: number;
  timestamp: string;
}

export interface AIProcessingResult {
  operation: 'create' | 'edit' | 'delete' | 'query';
  items: Partial<ProductivityItem>[];
  confidence: number;
  error?: string;
}

// Confirmation card types
export interface ConfirmationCard {
  id: string;
  type: 'create' | 'edit' | 'delete' | 'query';
  item: Partial<ProductivityItem>;
  originalItem?: ProductivityItem; // For edit operations
  approved: boolean;
  rejected: boolean;
}

// User preferences
export interface UserPreferences {
  id: string;
  user_id: string;
  default_calendar_duration: number; // minutes
  default_task_priority: Priority;
  voice_enabled: boolean;
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
}

// Database response types
export interface DatabaseResponse<T> {
  data: T | null;
  error: string | null;
}

// Form data types
export interface CalendarFormData {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  attendees?: string;
}

export interface TaskFormData {
  title: string;
  description?: string;
  due_date?: string;
  priority: Priority;
}

export interface NoteFormData {
  title: string;
  content: string;
  tags?: string;
}

// API response types
export interface GeminiResponse {
  operation: string;
  items: any[];
  confidence: number;
  error?: string;
}

// Component props types
export interface DashboardProps {
  items: ProductivityItem[];
  onItemUpdate: (item: ProductivityItem) => void;
  onItemDelete: (id: string) => void;
}

export interface ItemCardProps {
  item: ProductivityItem;
  onEdit: (item: ProductivityItem) => void;
  onDelete: (id: string) => void;
  onToggleComplete?: (id: string) => void;
}

export interface VoiceInputProps {
  onVoiceCommand: (command: VoiceCommand) => void;
  isListening: boolean;
  onToggleListening: () => void;
}

export interface ConfirmationCardProps {
  card: ConfirmationCard;
  onApprove: (cardId: string) => void;
  onReject: (cardId: string) => void;
  onEdit: (cardId: string, item: Partial<ProductivityItem>) => void;
}
