# Build Sequence - Voice-First Productivity App

## Overview
This document defines the prioritized build sequence for implementing the voice-first productivity app. Each phase builds upon the previous, ensuring a stable foundation before adding complexity. Focus on completing each phase fully before moving to the next.

## Phase 1: Foundation Setup

### 1.1 Project Initialization
**Priority: Critical - Must complete first**

```bash
# Initialize Vite project with React and TypeScript
npm create vite@latest personal-organizer -- --template react-ts

# Install core dependencies
npm install zustand @tanstack/react-query axios
npm install tailwindcss postcss autoprefixer
npm install @supabase/supabase-js
npm install react-router-dom
npm install framer-motion

# Development dependencies
npm install -D @types/react @types/react-dom
npm install -D eslint prettier husky lint-staged
npm install -D @vitejs/plugin-react-swc
```

**Configuration Files to Create:**
- `tailwind.config.js` - Tailwind configuration with custom colors
- `postcss.config.js` - PostCSS configuration
- `.eslintrc.json` - ESLint rules
- `.prettierrc` - Prettier formatting rules
- `tsconfig.json` - TypeScript strict mode configuration

### 1.2 Design System Implementation
**Priority: Critical - Establishes visual consistency**

Create foundational style files:
```
src/styles/
├── globals.css      # Tailwind imports and base styles
├── variables.css    # CSS custom properties
└── animations.css   # Keyframe animations
```

Define color system in Tailwind config:
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Background
        'bg-primary': '#0f0f23',
        'bg-secondary': '#1a1a2e',
        'bg-tertiary': '#16213e',
        'bg-card': '#2a2a3e',
        
        // Semantic colors
        'priority-urgent': '#ff6363',
        'priority-important': '#ff9800',
        'priority-optional': '#ffc107',
        'context-work': '#4a90e2',
        'context-personal': '#4caf50',
        'accent': '#e91e63',
        
        // Text
        'text-primary': '#ffffff',
        'text-secondary': '#8b9dc3',
      }
    }
  }
}
```

### 1.3 Base Component Library
**Priority: High - Reusable throughout app**

Create common components:
- `Button.tsx` - Primary, secondary, and ghost variants
- `Card.tsx` - Glassmorphism card container
- `Input.tsx` - Text input with floating label
- `Modal.tsx` - Base modal with backdrop
- `Chip.tsx` - Filter chips and tags
- `IconButton.tsx` - Icon-only buttons

Each component should:
- Accept `className` prop for composition
- Use TypeScript interfaces for props
- Include hover/active states
- Be fully accessible

### 1.4 Navigation Structure
**Priority: Critical - Core app architecture**

Implement tab navigation:
```typescript
// App.tsx structure
<Router>
  <div className="app-container">
    <Header />
    <Routes>
      <Route path="/" element={<ScheduleScreen />} />
      <Route path="/tasks" element={<TasksScreen />} />
      <Route path="/notes" element={<NotesScreen />} />
    </Routes>
    <TabBar />
  </div>
</Router>
```

Components to build:
- `Header.tsx` - Fixed header with date and context toggles
- `TabBar.tsx` - Bottom navigation with three tabs
- `Layout.tsx` - Consistent screen wrapper

## Phase 2: Core Screens & Static UI

### 2.1 Schedule Screen
**Priority: High - Primary user interface**

Build complete UI (no data yet):
- Day navigation component with arrows
- Current date display
- Filter chips (All, Today, This Week, Next Week)
- Event card component showing:
  - Time block design
  - Title and description
  - Context indicator (colored border)
  - Linked items placeholder

Static mockup with 3-4 sample events to verify design.

### 2.2 Tasks Screen
**Priority: High - Core functionality**

Build complete UI:
- Priority filter chips (All, Urgent, Important, Optional)
- Task card component with:
  - State selector dropdown
  - Priority badge
  - Title and description
  - Due date display
  - Context indicator
- Implement swipe gestures (visual only)
- Static mockup with various task states

### 2.3 Notes Screen
**Priority: High - Content management**

Build complete UI:
- Search bar component
- Dynamic tag filter area
- Note card component with:
  - Title
  - 2-line preview
  - Tag pills
  - Timestamp
  - Context indicator
- Archive/Active toggle
- Static mockup with sample notes

### 2.4 Voice Input Bar
**Priority: High - Central to voice-first approach**

Build in header:
- Microphone icon button
- Tap to expand states:
  - Idle state with placeholder text
  - Recording state with waveform animation
  - Processing state with spinner
- No actual voice functionality yet
- Focus on perfect animations and transitions

## Phase 3: Forms & Manual Input

### 3.1 Event Creation Form
**Priority: Critical - Data entry foundation**

Modal form with sections:
```
Essential (always visible):
- Title input
- Date picker
- Time picker

Collapsible sections:
- Duration & Recurrence
- Description
- Location
- Linked Items selector
```

Features:
- Progressive disclosure
- Validation states
- Context toggle (Work/Personal)
- Save/Cancel actions

### 3.2 Task Creation Form
**Priority: Critical - Core functionality**

Modal form with:
```
Essential:
- Title input
- Priority selector (3 options)

Collapsible:
- Due date picker
- Description
- Estimated duration
- Linked items
```

Include state management for form data.

### 3.3 Note Creation Form
**Priority: High - Content creation**

Full-screen form with:
- Title input
- Rich text editor (basic formatting)
- Tag input with autocomplete
- Context toggle
- Linked items selector

### 3.4 Edit Forms
**Priority: Medium - Data modification**

Reuse creation forms with:
- Pre-populated data
- Delete option
- Update confirmation
- Change tracking

## Phase 4: Database Integration

### 4.1 Supabase Setup
**Priority: Critical - Data persistence**

Configure Supabase:
```typescript
// supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

Run migrations for all tables (provided in Technical Implementation).

### 4.2 Authentication
**Priority: Critical - Security**

Implement auth flow:
- Login screen with email/password
- Supabase Auth integration
- Session persistence
- Protected routes
- Logout functionality

### 4.3 CRUD Operations
**Priority: Critical - Core functionality**

Implement for each entity type:

**Events Service:**
```typescript
// services/supabase/events.ts
export const eventService = {
  create: async (event: CreateEventDTO) => { },
  update: async (id: string, updates: UpdateEventDTO) => { },
  delete: async (id: string) => { },
  getAll: async () => { },
  getById: async (id: string) => { }
}
```

Same pattern for Tasks and Notes services.

### 4.4 State Management Integration
**Priority: High - Data flow**

Connect Zustand stores to Supabase:
- Fetch data on app load
- Update local state on CRUD operations
- Handle loading and error states
- Implement optimistic updates

### 4.5 Real-time Subscriptions
**Priority: Medium - Live updates**

Set up Supabase real-time:
- Subscribe to user's data changes
- Update local state on remote changes
- Handle connection states
- Implement reconnection logic

## Phase 5: Voice Integration

### 5.1 Voice Recording
**Priority: High - Voice input foundation**

Implement recording functionality:
```typescript
// hooks/useVoiceRecording.ts
export const useVoiceRecording = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  
  const startRecording = async () => {
    // Request microphone permission
    // Start MediaRecorder
    // Handle 2-minute maximum
  }
  
  const stopRecording = () => {
    // Stop MediaRecorder
    // Create audio blob
    // Return for processing
  }
  
  return { isRecording, startRecording, stopRecording, audioBlob }
}
```

### 5.2 Gemini Integration
**Priority: High - AI processing**

Implement Gemini service:
- Set up API client
- Create voice processing endpoint
- Handle multimodal input (audio)
- Parse response to structured data
- Error handling and retries

### 5.3 Voice Command Processing
**Priority: High - Core voice feature**

Complete flow:
1. Record audio (max 2 minutes)
2. Send to Gemini 2.5 Flash
3. Parse response to command structure
4. Show confirmation card
5. Execute command on approval
6. Update UI with results

### 5.4 Voice Command Patterns
**Priority: Medium - Enhanced usability**

Implement common patterns:
- "Add task [title] due [date]"
- "Schedule meeting with [person] at [time]"
- "Create note about [topic]"
- "Show me tasks for today"
- "Mark [task] as complete"

### 5.5 Voice Feedback
**Priority: Medium - User experience**

Add voice interaction feedback:
- Visual waveform during recording
- Processing animation
- Success/error states
- Confidence indicators
- Command history

## Phase 6: Linking System

### 6.1 Link Data Model
**Priority: High - Cross-reference functionality**

Implement linking:
- Many-to-many relationship table
- Bidirectional links
- Link type identification
- Database constraints

### 6.2 Link UI Components
**Priority: High - Visual connections**

Build components:
- Linked items pills
- Link selector modal
- Visual link indicators
- Link count badges

### 6.3 Link Management
**Priority: Medium - User control**

Features:
- Add links during creation
- Edit links on existing items
- Remove links
- Navigate through links
- Show related items

### 6.4 Smart Linking
**Priority: Low - Advanced feature**

AI-powered suggestions:
- Analyze content for relationships
- Suggest potential links
- Auto-link from voice commands
- Learn from user patterns

## Phase 7: Polish & Optimization

### 7.1 Animations
**Priority: Medium - Premium feel**

Implement throughout:
- Page transitions
- Card hover effects
- Swipe gestures
- Loading states
- Success animations
- Micro-interactions

Using Framer Motion for complex animations.

### 7.2 Offline Support
**Priority: Medium - Reliability**

Implement offline capabilities:
- Service worker setup
- Cache strategies
- Offline queue for changes
- Sync on reconnection
- Offline indicators

### 7.3 Performance Optimization
**Priority: High - User experience**

Optimize for mobile:
- Code splitting
- Lazy loading
- Image optimization
- Bundle size reduction
- Memory management
- Virtual scrolling for long lists

### 7.4 Accessibility
**Priority: High - Inclusive design**

Ensure compliance:
- Keyboard navigation
- Screen reader support
- Focus management
- ARIA labels
- Color contrast
- Touch targets (44px minimum)

### 7.5 Error Handling
**Priority: High - Robustness**

Comprehensive error handling:
- Global error boundary
- API error recovery
- Form validation messages
- Network failure handling
- User-friendly error states

## Phase 8: Final Testing & Deployment

### 8.1 Testing
**Priority: Critical - Quality assurance**

Test thoroughly:
- Manual testing on Safari iOS
- Voice command accuracy
- Data persistence
- Real-time sync
- Edge cases
- Performance benchmarks

### 8.2 Security Audit
**Priority: Critical - Data protection**

Verify security:
- API key protection
- Authentication flow
- RLS policies working
- No data leaks
- HTTPS everywhere
- Input sanitization

### 8.3 PWA Configuration
**Priority: High - Mobile experience**

Configure for iOS Safari:
- Web app manifest
- Apple-specific meta tags
- Icon sizes
- Splash screens
- Status bar styling

### 8.4 Deployment
**Priority: Final step**

Deploy to production:
- Build optimization
- Environment variables
- Choose platform (Render/Vercel)
- Custom domain setup
- SSL configuration
- Monitor deployment

## Success Checkpoints

### After Each Phase:
- ✓ All features working as designed
- ✓ No TypeScript errors
- ✓ Mobile Safari tested
- ✓ Code reviewed and clean
- ✓ Ready for next phase

### Definition of "Complete":
- Feature works end-to-end
- Handles errors gracefully
- Matches design specifications
- Performs well on mobile
- Code is maintainable

## AI Development Guidelines

### For Augment Code:
1. Complete each file fully before moving to next
2. Use TypeScript strict mode always
3. Follow the established patterns
4. Test in Safari iOS frequently
5. Commit working code often

### Code Quality Standards:
- No `any` types in TypeScript
- Descriptive variable names
- Comments for complex logic
- Consistent formatting
- Error handling everywhere

---

*This document supersedes any previous development plans. There are no timelines - only priorities. Execute phases in order, completing each fully before proceeding.*