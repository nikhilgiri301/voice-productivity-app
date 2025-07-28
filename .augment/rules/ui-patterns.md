---
type: "agent_requested"
description: "Example description"
---
# UI Patterns Rules

## Primary Reference
**See `voice-first-productivity-final-app-design-system.md` for all UI decisions**

## Quick Color Reference (ONE meaning per color)
- `#ff6363` → Critical priority ONLY (also used for urgent/blocked states)
- `#ffc107` → Useful priority ONLY
- `#4a90e2` → Work context borders ONLY
- `#4caf50` → Personal context borders ONLY
- `#e91e63` → UI accent/interactions ONLY
- Never use these colors for any other purpose

## Component Implementation
- For component TypeScript interfaces → See `Technical_Implementation.md` section "Component Specifications"
- For visual design → See Design System document
- For animations → Use Framer Motion as specified in Technical Implementation

## Styling Rules
- Use Tailwind CSS classes exclusively
- NO inline styles ever
- NO styled-components
- NO CSS-in-JS
- Follow mobile-first responsive design

## Key UI Patterns
- **Voice Input Bar**: Tap to expand, shows recording state
- **Swipe Actions**: Tasks only (left=complete, right=edit)
- **Progressive Disclosure**: All forms start minimal
- **Context Indicators**: Blue/green left borders (2px)
- **Touch Targets**: Minimum 44px × 44px

## Cross-References
- Building forms? → Also check `database.md` for data models
- Voice UI elements? → Also check `voice-ai.md` for states
- Component patterns? → Check `development.md` for code standards

## Safari Mobile Specifics
- Test all interactions on iOS Safari
- Account for Safari's bottom bar
- No features that require PWA APIs Safari doesn't support
- Respect safe areas for notched devices

Remember: The Design System document is the visual bible. This file just provides quick reminders.