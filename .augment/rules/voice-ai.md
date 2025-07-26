---
type: "agent_requested"
description: "Example description"
---
# Voice & AI Rules

## Primary Reference
**See `Technical_Implementation.md` sections:**
- "Gemini 2.5 Flash Integration" for API details
- "Voice Integration Specification" for complete flow
- "API Integration Specifications" for implementation

## Critical: Gemini 2.5 Flash ONLY
- Model: `gemini-2.5-flash`
- Use multimodal API (accepts audio directly)
- NO OpenAI Whisper
- NO other transcription services
- Gemini handles both transcription AND parsing

## Voice Recording Rules
- Maximum duration: 2 minutes
- Format: webm audio (browser default)
- Start/stop on button tap (no hands-free)
- Visual feedback required during recording

## Voice Processing Flow
1. Record audio → webm blob
2. Convert to base64
3. Send to Gemini with parsing prompt
4. Parse response to command structure
5. Show confirmation card
6. Execute on user approval

## Command Structure
```typescript
{
  intent: 'create_event' | 'create_task' | 'create_note' | 'query' | 'update' | 'delete'
  entities: {
    title?: string
    date?: Date
    priority?: 'urgent' | 'important' | 'optional'
    context?: 'work' | 'personal'
    // etc...
  }
  confidence: number
}
```

## Cross-References
- Voice UI components? → Check `ui-patterns.md` for design
- Storing commands? → Check `database.md` for schema
- API service pattern? → Check `development.md`

## Voice UI States
- Idle: Microphone icon with placeholder text
- Recording: Animated waveform
- Processing: Loading spinner
- Confirming: Show parsed command card
- Error: Red state with retry option

## Error Handling
- Microphone permission denied
- Recording timeout (>2 min)
- Low confidence results (<0.7)
- Network failures
- Always provide manual fallback

Remember: Technical Implementation has complete Gemini integration code. Manual input must work before voice.