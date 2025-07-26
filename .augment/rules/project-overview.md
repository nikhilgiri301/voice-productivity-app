---
type: "always_apply"
description: "Example description"
---
# Project Overview - Voice-First Productivity App

## Critical Overrides (ALWAYS APPLY)
- This is a **PWA only** - NOT a native app, NOT a hybrid app
- Use **Gemini 2.5 Flash** for all AI - NOT OpenAI, NOT Claude
- **Safari mobile only** - do not consider desktop or other browsers
- **NEVER mention timelines** - work by priorities only
- This is for **personal use** but with proper security (auth, RLS)

## Authoritative Documents
Always reference these three documents in the project root:

1. **`voice-first-productivity-final-app-design-system.md`**
   - Vision, philosophy, user experience
   - Color meanings (ONE purpose per color)
   - UI patterns and navigation flow
   - Feature rationale

2. **`Technical_Implementation.md`**
   - Complete technical specifications
   - Tech stack, architecture, data models
   - Component interfaces
   - API integrations

3. **`Build_Sequence.md`**
   - Prioritized implementation phases
   - What to build in what order
   - Success criteria
   - No timelines, only sequence

## When to Check Other Rule Files
- **Starting any UI work?** → Check `ui-patterns.md`
- **Working with data?** → Check `database.md`
- **Implementing voice?** → Check `voice-ai.md`
- **Writing code?** → Check `development.md`

## Core Architecture Reminders
- Three screens: Schedule, Tasks, Notes
- Voice-first but manual input must work first
- Progressive disclosure in all forms
- Mobile-first, touch-friendly (44px targets)
- Real-time sync via Supabase

## What This App Is NOT
- NOT a team collaboration tool
- NOT a native iOS/Android app
- NOT using Magic Patterns
- NOT following any timeline
- NOT using any UI component libraries

Remember: When in doubt, the three main documents have all answers.