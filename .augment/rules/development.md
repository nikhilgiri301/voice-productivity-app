---
type: "agent_requested"
description: "Example description"
---
# Development Rules

## Primary References
**See these documents for implementation details:**
- `Build_Sequence.md` → What to build in what order
- `Technical_Implementation.md` → How to build it
- Complete each phase fully before moving to next

## Tech Stack (Non-Negotiable)
```javascript
// Core
React 18+ with TypeScript (strict mode)
Vite (bundler)
Tailwind CSS (styling)
Zustand (state)
React Query (server state)
React Hook Form (forms)
Framer Motion (animations)

// Backend
Supabase (auth, database, realtime)
Gemini 2.5 Flash (AI/voice)
```

## Code Standards
- TypeScript strict mode - NO `any` types
- Functional components only
- Custom hooks for business logic
- Service layer for external APIs
- ESLint + Prettier configured

## Project Structure
```
src/
├── components/     # Reusable UI components
├── screens/        # Full page components
├── services/       # External integrations
├── hooks/          # Custom React hooks
├── store/          # Zustand stores
├── types/          # TypeScript types
└── utils/          # Helper functions
```

## Component Patterns
```typescript
// Always use this pattern
interface ComponentProps {
  className?: string;
  // other props...
}

export const Component: React.FC<ComponentProps> = ({ 
  className = '',
  ...props 
}) => {
  // implementation
};
```

## Cross-References
- Building UI? → Check `ui-patterns.md` first
- Need data models? → Check `database.md`
- Working on voice? → Check `voice-ai.md`

## Service Layer Pattern
- Abstract all external APIs
- Handle errors at service level
- Return typed responses
- See Technical Implementation examples

## Testing & Quality
- Test on Safari iOS after EVERY feature
- Commit working code frequently
- Handle all error states
- Loading states for async operations
- 44px minimum touch targets

## Common Pitfalls to Avoid
- Don't use component libraries
- Don't add desktop-specific features
- Don't skip phases in Build Sequence
- Don't use localStorage (Safari PWA limits)
- Don't bypass TypeScript with `any`

Remember: Build Sequence tells you WHAT and WHEN. Technical Implementation tells you HOW.