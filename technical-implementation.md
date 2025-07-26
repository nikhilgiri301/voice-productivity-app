# Technical Implementation - Voice-First Productivity App

## Overview
This document defines the complete technical implementation for a voice-first productivity PWA optimized for Safari mobile. All technical decisions prioritize simplicity, AI-friendly patterns, and proven technologies.

## Technology Stack

### Core Framework
- **React 18.3+** - Latest stable React with concurrent features
- **TypeScript 5.x** - Strict mode enabled for type safety
- **Vite 5.x** - Build tool for fast development and optimized production builds

### Styling & UI
- **Tailwind CSS 3.x** - Utility-first CSS framework
- **CSS Modules** - For component-specific styles when needed
- **Framer Motion** - For smooth animations and gestures

### State Management
- **Zustand 4.x** - Simple, lightweight state management
- **React Query (TanStack Query)** - For server state and caching
- **React Hook Form** - Form state management with validation

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Authentication
- **Supabase JS Client 2.x** - Official JavaScript client

### AI Integration
- **Google Gemini 2.5 Flash** - Natural language processing
- **Google Cloud Speech-to-Text** - Voice transcription backup
- **Gemini API Client** - Direct REST API integration

### Development Tools
- **ESLint** - Code linting with React/TypeScript rules
- **Prettier** - Code formatting
- **Husky** - Git hooks for code quality
- **React DevTools** - Development debugging

## Architecture Patterns

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components (Button, Card, etc.)
│   ├── voice/          # Voice-related components
│   ├── schedule/       # Schedule-specific components
│   ├── tasks/          # Task-specific components
│   └── notes/          # Note-specific components
├── screens/            # Full screen components
│   ├── ScheduleScreen.tsx
│   ├── TasksScreen.tsx
│   └── NotesScreen.tsx
├── services/           # External service integrations
│   ├── supabase/       # Database operations
│   ├── gemini/         # AI service
│   └── voice/          # Voice processing
├── hooks/              # Custom React hooks
│   ├── useVoice.ts
│   ├── useRealtime.ts
│   └── useAuth.ts
├── store/              # Zustand store definitions
│   ├── authStore.ts
│   ├── scheduleStore.ts
│   ├── tasksStore.ts
│   └── notesStore.ts
├── types/              # TypeScript type definitions
│   ├── models.ts       # Data models
│   ├── api.ts          # API types
│   └── components.ts   # Component prop types
├── utils/              # Helper functions
│   ├── dates.ts
│   ├── voice.ts
│   └── validation.ts
├── styles/             # Global styles
│   ├── globals.css     # Tailwind imports
│   └── variables.css   # CSS variables
└── App.tsx             # Root component
```

### Component Architecture

#### Base Component Pattern
```typescript
interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
  // Specific props
}

export const Component: React.FC<ComponentProps> = ({ 
  className = '', 
  children,
  ...props 
}) => {
  // Component logic
  return (
    <div className={`base-styles ${className}`}>
      {children}
    </div>
  );
};
```

#### State Management Pattern
```typescript
// Zustand store example
interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
}

const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await taskService.fetchAll();
      set({ tasks, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  // ... other actions
}));
```

### Service Layer Pattern
```typescript
// Service abstraction for external APIs
class GeminiService {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async processVoiceCommand(audioBlob: Blob): Promise<ParsedCommand> {
    // 1. Convert audio to text
    const transcript = await this.transcribeAudio(audioBlob);
    
    // 2. Parse command with Gemini
    const parsed = await this.parseCommand(transcript);
    
    return parsed;
  }
  
  private async transcribeAudio(audioBlob: Blob): Promise<string> {
    // Implementation
  }
  
  private async parseCommand(text: string): Promise<ParsedCommand> {
    // Implementation
  }
}
```

## Data Models

### Core Types
```typescript
// Base model for all entities
interface BaseModel {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Schedule Event
interface ScheduleEvent extends BaseModel {
  title: string;
  description?: string;
  start_time: string;  // ISO 8601
  end_time: string;    // ISO 8601
  location?: string;
  context: 'work' | 'personal';
  linked_items: LinkedItem[];
}

// Task
interface Task extends BaseModel {
  title: string;
  description?: string;
  priority: 'urgent' | 'important' | 'optional';
  state: 'not_started' | 'in_progress' | 'blocked' | 'deferred' | 'cancelled' | 'completed';
  due_date?: string;
  completed_at?: string;
  estimated_duration?: number; // minutes
  context: 'work' | 'personal';
  linked_items: LinkedItem[];
}

// Note
interface Note extends BaseModel {
  title: string;
  content: string;
  tags: string[];
  is_archived: boolean;
  context: 'work' | 'personal';
  linked_items: LinkedItem[];
}

// Linked Item Reference
interface LinkedItem {
  id: string;
  type: 'event' | 'task' | 'note';
  title: string;
}

// Voice Command
interface VoiceCommand extends BaseModel {
  transcript: string;
  parsed_intent: string;
  parsed_entities: Record<string, any>;
  confidence: number;
  processed: boolean;
}
```

### Database Schema
```sql
-- Users table (managed by Supabase Auth)

-- Schedule Events
CREATE TABLE schedule_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location TEXT,
  context TEXT CHECK (context IN ('work', 'personal')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT CHECK (priority IN ('urgent', 'important', 'optional')),
  state TEXT DEFAULT 'not_started' CHECK (state IN ('not_started', 'in_progress', 'blocked', 'deferred', 'cancelled', 'completed')),
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  estimated_duration INTEGER, -- minutes
  context TEXT CHECK (context IN ('work', 'personal')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notes
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[],
  is_archived BOOLEAN DEFAULT FALSE,
  context TEXT CHECK (context IN ('work', 'personal')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Linked Items (many-to-many relationships)
CREATE TABLE linked_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('event', 'task', 'note')),
  target_id UUID NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('event', 'task', 'note')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(source_id, source_type, target_id, target_type)
);

-- Voice Commands (audit trail)
CREATE TABLE voice_commands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  transcript TEXT NOT NULL,
  parsed_intent TEXT,
  parsed_entities JSONB,
  confidence DECIMAL(3,2),
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS) Policies
```sql
-- Enable RLS on all tables
ALTER TABLE schedule_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE linked_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_commands ENABLE ROW LEVEL SECURITY;

-- Users can only see/modify their own data
CREATE POLICY "Users can view own events" ON schedule_events
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own tasks" ON tasks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own notes" ON notes
  FOR ALL USING (auth.uid() = user_id);

-- Linked items policy (can see if you own either source or target)
CREATE POLICY "Users can view own linked items" ON linked_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM schedule_events WHERE id = linked_items.source_id AND user_id = auth.uid()
      UNION
      SELECT 1 FROM tasks WHERE id = linked_items.source_id AND user_id = auth.uid()
      UNION
      SELECT 1 FROM notes WHERE id = linked_items.source_id AND user_id = auth.uid()
      UNION
      SELECT 1 FROM schedule_events WHERE id = linked_items.target_id AND user_id = auth.uid()
      UNION
      SELECT 1 FROM tasks WHERE id = linked_items.target_id AND user_id = auth.uid()
      UNION
      SELECT 1 FROM notes WHERE id = linked_items.target_id AND user_id = auth.uid()
    )
  );
```

## Component Specifications

### VoiceInputBar
```typescript
interface VoiceInputBarProps {
  onVoiceCommand: (command: ParsedCommand) => void;
  maxDuration?: number; // default: 120 seconds
}

interface ParsedCommand {
  transcript: string;
  intent: 'create_event' | 'create_task' | 'create_note' | 'query' | 'update' | 'delete';
  entities: {
    title?: string;
    description?: string;
    date?: Date;
    time?: string;
    priority?: 'urgent' | 'important' | 'optional';
    context?: 'work' | 'personal';
    linkedTo?: string[];
  };
  confidence: number;
}

// States: idle, recording, processing, confirming, error
```

### TaskCard
```typescript
interface TaskCardProps {
  task: Task;
  onToggleComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onLinkPress: (item: LinkedItem) => void;
}

// Swipe gestures:
// - Swipe left: Complete/Uncomplete
// - Swipe right: Edit
// - Long press: Delete confirmation
```

### ScheduleEventCard
```typescript
interface ScheduleEventCardProps {
  event: ScheduleEvent;
  onEdit: () => void;
  onDelete: () => void;
  onLinkPress: (item: LinkedItem) => void;
}

// Visual elements:
// - Time block (start, duration, end)
// - Context indicator (blue/green border)
// - Linked items pills
```

### NoteCard
```typescript
interface NoteCardProps {
  note: Note;
  onPress: () => void;
  onArchive: () => void;
  onTagPress: (tag: string) => void;
  onLinkPress: (item: LinkedItem) => void;
}

// Features:
// - 2-line preview with ellipsis
// - Tag pills (single line, overflow hidden)
// - Swipe left to archive
```

### SmartFilterChips
```typescript
interface FilterChip {
  id: string;
  label: string;
  isActive: boolean;
  color?: string;
}

interface SmartFilterChipsProps {
  filters: FilterChip[];
  onFilterToggle: (filterId: string) => void;
  multiSelect?: boolean; // default: false
}
```

## API Integration Specifications

### Gemini 2.5 Flash Integration
```typescript
class GeminiVoiceService {
  private apiKey: string;
  private model = 'gemini-2.5-flash';
  
  async processVoiceCommand(audioBlob: Blob): Promise<ParsedCommand> {
    // Convert audio to base64
    const audioBase64 = await this.blobToBase64(audioBlob);
    
    // Prepare multimodal request
    const request = {
      contents: [{
        parts: [
          {
            text: `Parse this voice command for a productivity app. Extract:
                   - Intent (create_event, create_task, create_note, query, update, delete)
                   - Title
                   - Date/time references
                   - Priority (urgent, important, optional)
                   - Context (work, personal)
                   - Any linked items mentioned
                   
                   Return as JSON.`
          },
          {
            inline_data: {
              mime_type: 'audio/webm',
              data: audioBase64
            }
          }
        ]
      }]
    };
    
    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${this.model}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': this.apiKey
        },
        body: JSON.stringify(request)
      }
    );
    
    // Parse response
    const data = await response.json();
    return this.extractParsedCommand(data);
  }
}
```

### Supabase Real-time Subscriptions
```typescript
// Real-time sync setup
const setupRealtimeSync = () => {
  // Subscribe to changes in user's data
  const subscription = supabase
    .channel('user_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        handleRealtimeUpdate('tasks', payload);
      }
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'schedule_events',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        handleRealtimeUpdate('events', payload);
      }
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'notes',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        handleRealtimeUpdate('notes', payload);
      }
    )
    .subscribe();
    
  return subscription;
};
```

## Security Specifications

### Authentication Flow
1. Email/password authentication via Supabase Auth
2. Session persistence in secure storage
3. Automatic token refresh
4. Logout clears all local data

### API Security
- All API keys stored in environment variables
- Never expose keys in client code
- Use server-side functions for sensitive operations
- Implement rate limiting for API calls

### Data Security
- All data encrypted in transit (HTTPS)
- Row Level Security enforces user isolation
- No cross-user data access possible
- Audit trail for all voice commands

## Performance Specifications

### Loading Performance
- Initial load: < 3 seconds on 3G
- Time to interactive: < 2 seconds
- Lazy load non-critical components
- Code splitting by route

### Runtime Performance
- 60fps animations using CSS transforms
- Virtual scrolling for lists > 100 items
- Debounced search inputs
- Optimistic UI updates

### Voice Performance
- Start recording: < 100ms response
- Process command: < 2 seconds
- Visual feedback during processing
- Graceful degradation on errors

## PWA Configuration

### Manifest.json
```json
{
  "name": "Personal Organizer",
  "short_name": "Organizer",
  "description": "Voice-first productivity app",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f0f23",
  "theme_color": "#4a90e2",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Service Worker Strategy
- Cache-first for static assets
- Network-first for API calls
- Background sync for offline changes
- Push notifications ready (future)

## Development Standards

### Code Quality Rules
```javascript
// ESLint configuration
{
  "extends": [
    "react-app",
    "react-app/jest",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn"
  }
}
```

### Git Commit Standards
- Conventional commits format
- Pre-commit hooks via Husky
- Automated code formatting
- Branch protection rules

### Testing Strategy
- Unit tests for utilities
- Integration tests for services
- Component testing for UI
- E2E tests for critical paths

## Environment Configuration

### Required Environment Variables
```bash
# .env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_APP_URL=http://localhost:5173
```

### Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Error Handling

### Global Error Boundary
- Catches all React errors
- Shows user-friendly error screen
- Logs errors to monitoring service
- Allows retry/refresh

### API Error Handling
- Retry failed requests (3x)
- Exponential backoff
- User-friendly error messages
- Fallback to cached data

### Voice Error Handling
- Microphone permission denied
- Recording timeout (2 minutes)
- Network failure during processing
- Low confidence results

## Monitoring & Analytics

### Performance Monitoring
- Core Web Vitals tracking
- API response times
- Voice command success rate
- Error frequency tracking

### User Analytics
- Feature usage patterns
- Voice vs manual input ratio
- Common voice commands
- User retention metrics

---

*This document supersedes any previous technical specifications. Augment Code should reference this as the authoritative technical guide for implementation.*