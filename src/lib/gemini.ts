import { AIProcessingResult, ProductivityItem } from '../types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

interface GeminiRequest {
  contents: {
    parts: {
      text: string;
    }[];
  }[];
}

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
    finishReason: string;
    index: number;
    safetyRatings: any[];
  }[];
}

export class GeminiService {
  private static async makeRequest(prompt: string): Promise<string> {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    const requestBody: GeminiRequest = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    };

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data: GeminiResponse = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response from Gemini API');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API request failed:', error);
      throw error;
    }
  }

  static async processVoiceCommand(
    transcript: string,
    confidence: number,
    existingItems?: ProductivityItem[]
  ): Promise<AIProcessingResult> {
    try {
      const prompt = this.buildPrompt(transcript, existingItems);
      const response = await this.makeRequest(prompt);
      
      // Clean and parse the JSON response
      let cleanResponse = response.trim();

      // Remove any markdown code blocks if present
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      // Try to extract JSON from the response
      const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanResponse = jsonMatch[0];
      }

      console.log('Cleaned Gemini response:', cleanResponse);

      const parsedResponse = JSON.parse(cleanResponse);

      return {
        operation: parsedResponse.operation,
        items: parsedResponse.items || [],
        confidence: Math.min(confidence, parsedResponse.confidence || 0.8),
        error: undefined
      };
    } catch (error) {
      console.error('Error processing voice command:', error);
      return {
        operation: 'create',
        items: [],
        confidence: 0,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private static buildPrompt(transcript: string, existingItems?: ProductivityItem[]): string {
    const currentDate = new Date().toISOString();
    const existingItemsContext = existingItems 
      ? `\n\nExisting items for reference:\n${JSON.stringify(existingItems.slice(0, 10), null, 2)}`
      : '';

    return `
You are an AI assistant that processes voice commands for a productivity organizer app. 
Parse the following voice command and return a JSON response with the operation and items to create/modify.

Current date/time: ${currentDate}

Voice command: "${transcript}"
${existingItemsContext}

Instructions:
1. Determine the operation type: "create", "edit", "delete", or "query"
2. Extract relevant information to create productivity items
3. For calendar events, carefully parse time expressions in USER'S LOCAL TIMEZONE:
   - "10pm" = 22:00 LOCAL TIME (NOT UTC!)
   - "3pm" = 15:00 LOCAL TIME (same day unless specified otherwise)
   - "Tuesday 3pm" = next Tuesday at 15:00 LOCAL TIME
   - "tomorrow 10am" = next day at 10:00 LOCAL TIME
   - "Friday afternoon" = next Friday at 14:00 LOCAL TIME
   - Default duration: 1 hour unless specified
   - CRITICAL: Create dates in user's local timezone, then convert to ISO
   - NEVER interpret times as UTC - always assume user's local time
4. For tasks, set appropriate priority and due dates based on urgency words
5. For notes, extract the main content and relevant tags
6. If editing/deleting, try to match against existing items by title/content
7. Return confidence score (0-1) based on clarity of the command

Time parsing examples (ALL IN USER'S LOCAL TIMEZONE):
- "meditation session at 10pm" → today at 22:00:00 LOCAL, end at 23:00:00 LOCAL
- "coffee with Sarah Tuesday 3pm" → Tuesday at 15:00:00 LOCAL, end at 16:00:00 LOCAL
- "meeting tomorrow morning" → tomorrow at 09:00:00 LOCAL, end at 10:00:00 LOCAL
- "lunch Friday 12:30" → Friday at 12:30:00 LOCAL, end at 13:30:00 LOCAL
- "call at 2" → today at 14:00:00 LOCAL, end at 14:30:00 LOCAL

TIMEZONE HANDLING:
- User timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}
- Current local time: ${new Date().toLocaleString()}
- When creating ISO strings, ensure they represent the user's intended local time

Response format (JSON only, no other text):
{
  "operation": "create|edit|delete|query",
  "confidence": 0.8,
  "items": [
    {
      "type": "calendar|task|note",
      "title": "extracted title",
      "description": "optional description",
      "start_time": "2024-01-01T10:00:00Z", // for calendar events
      "end_time": "2024-01-01T11:00:00Z",   // for calendar events
      "location": "optional location",       // for calendar events
      "attendees": ["email@example.com"],   // for calendar events
      "due_date": "2024-01-01T17:00:00Z",   // for tasks
      "priority": "high|medium|low",        // for tasks
      "content": "note content",            // for notes
      "tags": ["tag1", "tag2"],            // for notes
      "linked_items": []                    // IDs of related items
    }
  ],
  "explanation": "Brief explanation of what was understood"
}

Examples:
- "Schedule coffee with Sarah Tuesday 3pm" → create calendar event
- "Add task buy groceries by Friday" → create task with due date
- "Create note meeting ideas" → create note
- "Move my dentist appointment to Friday" → edit existing calendar event
- "Delete all today's meetings" → delete multiple calendar events
- "What do I have after lunch today?" → query calendar events
- "Cancel all meetings this week" → delete multiple calendar events
- "Mark all overdue tasks as high priority" → edit multiple tasks
- "Create meeting prep task and schedule the meeting for tomorrow 2pm" → create multiple linked items

For bulk operations, return multiple items in the array with appropriate filters/criteria.
For linked operations (creating multiple related items), ensure items reference each other.

Parse the command and respond with valid JSON only.
`;
  }

  // Helper method to validate and clean AI response
  static validateAIResponse(response: any): AIProcessingResult {
    const validOperations = ['create', 'edit', 'delete', 'query'];
    
    if (!response.operation || !validOperations.includes(response.operation)) {
      response.operation = 'create';
    }

    if (!Array.isArray(response.items)) {
      response.items = [];
    }

    if (typeof response.confidence !== 'number' || response.confidence < 0 || response.confidence > 1) {
      response.confidence = 0.5;
    }

    // Validate each item
    response.items = response.items.map((item: any) => {
      const validTypes = ['calendar', 'task', 'note'];
      if (!item.type || !validTypes.includes(item.type)) {
        item.type = 'note';
      }

      if (!item.title || typeof item.title !== 'string') {
        item.title = 'Untitled';
      }

      // Validate calendar-specific fields
      if (item.type === 'calendar') {
        if (item.start_time && !this.isValidDate(item.start_time)) {
          delete item.start_time;
        }
        if (item.end_time && !this.isValidDate(item.end_time)) {
          delete item.end_time;
        }
      }

      // Validate task-specific fields
      if (item.type === 'task') {
        if (item.due_date && !this.isValidDate(item.due_date)) {
          delete item.due_date;
        }
        if (item.priority && !['high', 'medium', 'low'].includes(item.priority)) {
          item.priority = 'medium';
        }
      }

      return item;
    });

    return response;
  }

  private static isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  // Method to generate follow-up questions for unclear commands
  static async generateClarificationQuestion(transcript: string): Promise<string> {
    const prompt = `
The user said: "${transcript}"

This voice command is unclear or incomplete. Generate a helpful clarification question to get more specific information.

Examples:
- If they said "schedule meeting" → "When would you like to schedule the meeting, and who should attend?"
- If they said "add task" → "What task would you like to add, and when is it due?"
- If they said "create note" → "What would you like the note to be about?"

Respond with just the clarification question, no other text.
`;

    try {
      return await this.makeRequest(prompt);
    } catch (error) {
      return "Could you please provide more details about what you'd like to do?";
    }
  }
}
