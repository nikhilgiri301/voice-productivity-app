// Test utilities and helpers for the Personal Organizer app

export interface TestScenario {
  name: string;
  description: string;
  steps: string[];
  expectedResult: string;
  category: 'voice' | 'manual' | 'integration' | 'performance';
}

export const testScenarios: TestScenario[] = [
  // Voice Input Tests
  {
    name: "Voice Calendar Event Creation",
    description: "Test creating a calendar event using voice input",
    steps: [
      "Click the voice input button (microphone icon)",
      "Say: 'Schedule coffee with Sarah Tuesday 3pm'",
      "Wait for AI processing",
      "Review the confirmation card",
      "Click 'Approve' to create the event"
    ],
    expectedResult: "Calendar event should be created with correct title, date, and time",
    category: "voice"
  },
  {
    name: "Voice Task Creation",
    description: "Test creating a task using voice input",
    steps: [
      "Click the voice input button",
      "Say: 'Add task buy groceries by Friday high priority'",
      "Review the confirmation card",
      "Verify priority is set to high",
      "Click 'Approve'"
    ],
    expectedResult: "Task should be created with high priority and Friday due date",
    category: "voice"
  },
  {
    name: "Voice Note Creation",
    description: "Test creating a note using voice input",
    steps: [
      "Click the voice input button",
      "Say: 'Create note meeting ideas for project planning'",
      "Review the confirmation card",
      "Click 'Approve'"
    ],
    expectedResult: "Note should be created with the specified content",
    category: "voice"
  },
  {
    name: "Voice Query Operation",
    description: "Test querying items using voice input",
    steps: [
      "Create some test items first",
      "Click the voice input button",
      "Say: 'What do I have today?'",
      "Review the query results modal"
    ],
    expectedResult: "Should display today's calendar events and tasks",
    category: "voice"
  },
  {
    name: "Voice Bulk Operations",
    description: "Test bulk operations using voice input",
    steps: [
      "Create multiple test tasks",
      "Click the voice input button",
      "Say: 'Mark all overdue tasks as high priority'",
      "Confirm the bulk operation"
    ],
    expectedResult: "All overdue tasks should be updated to high priority",
    category: "voice"
  },

  // Manual Input Tests
  {
    name: "Manual Calendar Event Creation",
    description: "Test creating a calendar event using manual forms",
    steps: [
      "Click the calendar icon in the header",
      "Fill in event title: 'Team Meeting'",
      "Set start time to tomorrow 10:00 AM",
      "Set end time to tomorrow 11:00 AM",
      "Add location: 'Conference Room A'",
      "Click 'Create Event'"
    ],
    expectedResult: "Calendar event should be created and appear in the dashboard",
    category: "manual"
  },
  {
    name: "Manual Task Creation",
    description: "Test creating a task using manual forms",
    steps: [
      "Click the task icon in the header",
      "Fill in task title: 'Review quarterly reports'",
      "Set due date to next week",
      "Set priority to medium",
      "Add description",
      "Click 'Create Task'"
    ],
    expectedResult: "Task should be created with all specified details",
    category: "manual"
  },
  {
    name: "Manual Note Creation",
    description: "Test creating a note using manual forms",
    steps: [
      "Click the note icon in the header",
      "Fill in note title: 'Project Ideas'",
      "Add content with multiple lines",
      "Add tags: 'work, planning, ideas'",
      "Click 'Create Note'"
    ],
    expectedResult: "Note should be created with tags properly parsed",
    category: "manual"
  },

  // Integration Tests
  {
    name: "Item Linking",
    description: "Test linking related items together",
    steps: [
      "Create a calendar event",
      "Create a related task",
      "Click the link icon on one item",
      "Add the other item as a linked item",
      "Verify the link appears on both items"
    ],
    expectedResult: "Items should be properly linked and show relationship indicators",
    category: "integration"
  },
  {
    name: "Advanced Search",
    description: "Test the advanced search functionality",
    steps: [
      "Create items of different types",
      "Click the search icon in the header",
      "Apply various filters (type, priority, date range)",
      "Execute the search",
      "Verify results match the filters"
    ],
    expectedResult: "Search should return only items matching the applied filters",
    category: "integration"
  },
  {
    name: "Real-time Updates",
    description: "Test real-time synchronization",
    steps: [
      "Open the app in two browser tabs",
      "Create an item in one tab",
      "Check if it appears in the other tab",
      "Edit the item in the second tab",
      "Verify changes appear in the first tab"
    ],
    expectedResult: "Changes should sync in real-time across all open instances",
    category: "integration"
  },

  // Performance Tests
  {
    name: "Large Dataset Performance",
    description: "Test app performance with many items",
    steps: [
      "Create 50+ items of various types",
      "Navigate through different views",
      "Test search functionality",
      "Test voice input with many existing items",
      "Monitor loading times and responsiveness"
    ],
    expectedResult: "App should remain responsive with large datasets",
    category: "performance"
  },
  {
    name: "Offline Functionality",
    description: "Test PWA offline capabilities",
    steps: [
      "Load the app while online",
      "Disconnect from the internet",
      "Try to navigate the app",
      "Attempt to create items",
      "Reconnect and verify sync"
    ],
    expectedResult: "App should work offline and sync when reconnected",
    category: "performance"
  }
];

// Browser compatibility tests
export const browserTests = [
  {
    browser: "Chrome",
    features: ["Voice input", "PWA install", "Notifications", "Offline mode"],
    notes: "Full feature support expected"
  },
  {
    browser: "Safari",
    features: ["Voice input", "PWA install", "Limited notifications"],
    notes: "Voice input may require user gesture, PWA install via share menu"
  },
  {
    browser: "Firefox",
    features: ["Voice input", "Limited PWA", "Notifications"],
    notes: "Voice input supported, PWA features limited"
  },
  {
    browser: "Edge",
    features: ["Voice input", "PWA install", "Notifications", "Offline mode"],
    notes: "Similar to Chrome, full feature support"
  }
];

// Device-specific tests
export const deviceTests = [
  {
    device: "iPhone",
    tests: ["Touch interactions", "Voice input", "PWA install", "Orientation changes"],
    notes: "Primary target device"
  },
  {
    device: "iPad",
    tests: ["Touch interactions", "Voice input", "PWA install", "Split screen"],
    notes: "Secondary target device"
  },
  {
    device: "Android Phone",
    tests: ["Touch interactions", "Voice input", "PWA install"],
    notes: "Cross-platform compatibility"
  },
  {
    device: "Desktop",
    tests: ["Mouse interactions", "Keyboard shortcuts", "Voice input", "Window resizing"],
    notes: "Desktop experience validation"
  }
];

// Utility functions for testing
export const testUtils = {
  // Simulate voice input for testing
  simulateVoiceInput: (transcript: string, confidence: number = 0.9) => {
    const event = new CustomEvent('voicetest', {
      detail: { transcript, confidence, timestamp: new Date().toISOString() }
    });
    window.dispatchEvent(event);
  },

  // Wait for element to appear
  waitForElement: (selector: string, timeout: number = 5000): Promise<Element> => {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      }, timeout);
    });
  },

  // Simulate network offline/online
  simulateNetworkChange: (online: boolean) => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: online
    });
    
    const event = new Event(online ? 'online' : 'offline');
    window.dispatchEvent(event);
  },

  // Generate test data
  generateTestItem: (type: 'calendar' | 'task' | 'note', index: number = 0) => {
    const baseItem = {
      user_id: 'test-user',
      created_via: 'manual' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    switch (type) {
      case 'calendar':
        return {
          ...baseItem,
          type: 'calendar' as const,
          title: `Test Event ${index}`,
          description: `Description for test event ${index}`,
          start_time: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString(),
          end_time: new Date(Date.now() + index * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
          location: `Location ${index}`
        };
      
      case 'task':
        return {
          ...baseItem,
          type: 'task' as const,
          title: `Test Task ${index}`,
          description: `Description for test task ${index}`,
          due_date: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString(),
          priority: ['low', 'medium', 'high'][index % 3] as 'low' | 'medium' | 'high',
          completed: false
        };
      
      case 'note':
        return {
          ...baseItem,
          type: 'note' as const,
          title: `Test Note ${index}`,
          content: `This is the content for test note ${index}. It contains multiple lines and various information.`,
          tags: [`tag${index}`, 'test', 'sample']
        };
    }
  }
};

// Performance monitoring
export const performanceMonitor = {
  startTiming: (label: string) => {
    performance.mark(`${label}-start`);
  },

  endTiming: (label: string) => {
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);
    
    const measure = performance.getEntriesByName(label)[0];
    console.log(`${label}: ${measure.duration.toFixed(2)}ms`);
    
    return measure.duration;
  },

  measurePageLoad: () => {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      console.log('Page Load Metrics:', {
        'DNS Lookup': navigation.domainLookupEnd - navigation.domainLookupStart,
        'TCP Connection': navigation.connectEnd - navigation.connectStart,
        'Request': navigation.responseStart - navigation.requestStart,
        'Response': navigation.responseEnd - navigation.responseStart,
        'DOM Processing': navigation.domContentLoadedEventEnd - navigation.responseEnd,
        'Total Load Time': navigation.loadEventEnd - navigation.fetchStart
      });
    });
  }
};
