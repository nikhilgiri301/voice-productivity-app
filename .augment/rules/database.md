---
type: "agent_requested"
description: "Example description"
---
# Database Rules

## Primary Reference
**See `Technical_Implementation.md` sections:**
- "Data Models" for TypeScript interfaces
- "Database Schema" for PostgreSQL tables
- "Row Level Security (RLS) Policies" for security

## Supabase Configuration
- Database: PostgreSQL via Supabase
- Real-time: Enabled for all user tables
- Auth: Supabase Auth with email/password
- RLS: MANDATORY on all tables

## Key Tables
1. `schedule_events` - Calendar entries
2. `tasks` - Task management  
3. `notes` - Note storage
4. `linked_items` - Many-to-many relationships
5. `voice_commands` - Audit trail (see `voice-ai.md`)

## Data Model Reminders
- All tables have `user_id` (RLS enforcement)
- Timestamps: `created_at`, `updated_at`
- Context field: 'work' | 'personal' on all content
- Task states: 6 options (not just done/not done)
- Notes have `is_archived` boolean

## Linking System
- Bidirectional links stored in `linked_items`
- Check both source and target when querying
- Links persist even when items are archived
- See Technical Implementation for exact schema

## Cross-References
- Adding voice commands? → Check `voice-ai.md` for structure
- Building UI for data? → Check `ui-patterns.md` for display
- Creating forms? → Check both this and `ui-patterns.md`
- API patterns? → Check `development.md` for service layer

## Security Non-Negotiables
- Never bypass RLS
- Always use authenticated queries
- No client-side data filtering for security
- Use Supabase client library, not direct SQL

## Real-time Sync
- Subscribe to user's data only
- Handle connection states gracefully
- Implement optimistic updates
- See Technical Implementation for subscription setup

Remember: Technical Implementation has the complete schema. This is just a quick reference.