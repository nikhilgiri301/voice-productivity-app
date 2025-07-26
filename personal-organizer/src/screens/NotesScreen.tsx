import React, { useState, useCallback } from 'react';
import {
  SearchBar,
  TagFilterArea,
  NoteCard,
  ArchiveToggle,
  type NoteData,
  type TagData,
  type ViewMode,
} from '@/components/notes';

const NotesScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<ViewMode>('active');

  // Sample notes data with various content types, tags, and timestamps
  const sampleNotes: NoteData[] = [
    {
      id: '1',
      title: 'Project Kickoff Meeting',
      content: `# Project Kickoff Meeting - Q3 Initiative

## Attendees
- Sarah (PM)
- Mike (Tech Lead)
- Lisa (Designer)
- John (Backend)

## Key Points
- Project timeline: 8 weeks
- Budget approved: $50k
- Tech stack: React, Node.js, PostgreSQL
- Design system to be finalized by end of week

## Action Items
- [ ] Set up development environment
- [ ] Create project repository
- [ ] Schedule weekly standups
- [ ] Finalize requirements document

## Next Steps
Follow up meeting scheduled for Friday to review initial wireframes and technical architecture decisions.`,
      tags: ['meeting', 'project', 'kickoff', 'q3'],
      context: 'work',
      createdAt: new Date(2025, 6, 24, 10, 30),
      updatedAt: new Date(2025, 6, 24, 10, 30),
      isPinned: true,
    },
    {
      id: '2',
      title: 'Weekend Trip Ideas',
      content: `Planning a weekend getaway for next month. Here are some options I've been researching:

**Mountain Retreat**
- Cabin rental in Blue Ridge Mountains
- Hiking trails nearby
- Cost: $200/night

**Beach House**
- Ocean view property in Outer Banks
- Private beach access
- Cost: $300/night

**City Break**
- Boutique hotel in Charleston
- Historic district walking tours
- Cost: $150/night

Need to check availability and book soon!`,
      tags: ['travel', 'planning', 'weekend', 'vacation'],
      context: 'personal',
      createdAt: new Date(2025, 6, 22, 14, 15),
      updatedAt: new Date(2025, 6, 25, 9, 20),
    },
    {
      id: '3',
      title: 'App Feature Ideas',
      content: `Brainstorming session for new app features:

1. **Voice Commands**
   - Quick task creation
   - Note dictation
   - Calendar scheduling

2. **Smart Scheduling**
   - AI-powered time blocking
   - Energy level optimization
   - Automatic break suggestions

3. **Integration Ideas**
   - Calendar sync
   - Email parsing
   - Slack notifications

4. **Mobile Enhancements**
   - Offline mode
   - Widget support
   - Apple Watch app

These could be great for the next sprint planning session.`,
      tags: ['ideas', 'features', 'brainstorming', 'app'],
      context: 'work',
      createdAt: new Date(2025, 6, 21, 16, 45),
      updatedAt: new Date(2025, 6, 23, 11, 30),
    },
    {
      id: '4',
      title: 'Book Recommendations',
      content: `Books to read this quarter:

**Fiction**
- "The Seven Husbands of Evelyn Hugo" by Taylor Jenkins Reid
- "Project Hail Mary" by Andy Weir
- "Klara and the Sun" by Kazuo Ishiguro

**Non-Fiction**
- "Atomic Habits" by James Clear
- "The Psychology of Money" by Morgan Housel
- "Educated" by Tara Westover

**Technical**
- "Clean Architecture" by Robert Martin
- "Designing Data-Intensive Applications" by Martin Kleppmann

Goal: Read at least 2 books per month.`,
      tags: ['books', 'reading', 'goals', 'learning'],
      context: 'personal',
      createdAt: new Date(2025, 6, 20, 19, 30),
      updatedAt: new Date(2025, 6, 20, 19, 30),
    },
    {
      id: '5',
      title: 'Client Feedback Summary',
      content: `Feedback from client presentation on July 23rd:

**Positive Points:**
- UI design is clean and intuitive
- Performance improvements are noticeable
- Mobile responsiveness works well

**Areas for Improvement:**
- Need better error handling
- Loading states could be more informative
- Search functionality needs refinement

**Action Items:**
- Implement better error boundaries
- Add skeleton loading states
- Enhance search with filters and sorting

**Timeline:**
- Fixes to be completed by end of week
- Follow-up demo scheduled for next Tuesday

Overall positive reception with minor tweaks needed.`,
      tags: ['client', 'feedback', 'presentation', 'improvements'],
      context: 'work',
      createdAt: new Date(2025, 6, 23, 15, 20),
      updatedAt: new Date(2025, 6, 24, 8, 45),
      isArchived: true,
    },
    {
      id: '6',
      title: 'Grocery List',
      content: `Weekly grocery shopping list:

**Produce:**
- Bananas
- Apples
- Spinach
- Bell peppers
- Onions

**Proteins:**
- Chicken breast
- Salmon fillets
- Greek yogurt
- Eggs

**Pantry:**
- Quinoa
- Olive oil
- Canned beans
- Pasta

**Snacks:**
- Almonds
- Dark chocolate
- Hummus

Don't forget to check for sales on organic produce!`,
      tags: ['grocery', 'shopping', 'food', 'weekly'],
      context: 'personal',
      createdAt: new Date(2025, 6, 25, 8, 0),
      updatedAt: new Date(2025, 6, 26, 7, 30),
    },
    {
      id: '7',
      title: 'Code Review Notes',
      content: `Review notes for PR #247 - User Dashboard Feature:

**Code Quality:**
- Good separation of concerns
- Proper error handling implemented
- TypeScript types are well-defined

**Performance:**
- Consider memoizing expensive calculations
- Lazy loading for dashboard widgets
- Optimize re-renders with React.memo

**Security:**
- Input validation looks good
- API endpoints properly secured
- No sensitive data in client-side code

**Testing:**
- Unit tests cover main functionality
- Integration tests needed for API calls
- E2E tests for critical user flows

**Recommendation:** Approve with minor performance optimizations.`,
      tags: ['code-review', 'development', 'quality', 'performance'],
      context: 'work',
      createdAt: new Date(2025, 6, 19, 13, 15),
      updatedAt: new Date(2025, 6, 19, 13, 15),
      isArchived: true,
    },
  ];

  // Generate tag data with counts
  const allTags: TagData[] = React.useMemo(() => {
    const tagCounts: { [key: string]: number } = {};

    sampleNotes.forEach(note => {
      if (currentView === 'active' && note.isArchived) return;
      if (currentView === 'archived' && !note.isArchived) return;

      note.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return Object.entries(tagCounts).map(([name, count]) => ({
      name,
      count,
    }));
  }, [sampleNotes, currentView]);

  // Filter notes based on search query, selected tags, and view mode
  const filteredNotes = React.useMemo(() => {
    return sampleNotes.filter(note => {
      // Filter by view mode
      if (currentView === 'active' && note.isArchived) return false;
      if (currentView === 'archived' && !note.isArchived) return false;

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = note.title.toLowerCase().includes(query);
        const matchesContent = note.content.toLowerCase().includes(query);
        const matchesTags = note.tags.some(tag => tag.toLowerCase().includes(query));

        if (!matchesTitle && !matchesContent && !matchesTags) return false;
      }

      // Filter by selected tags
      if (selectedTags.length > 0) {
        const hasSelectedTag = selectedTags.some(tag => note.tags.includes(tag));
        if (!hasSelectedTag) return false;
      }

      return true;
    });
  }, [sampleNotes, searchQuery, selectedTags, currentView]);

  // Calculate view counts
  const viewCounts = {
    active: sampleNotes.filter(note => !note.isArchived).length,
    archived: sampleNotes.filter(note => note.isArchived).length,
  };

  const handleSearchChange = useCallback((value: string): void => {
    setSearchQuery(value);
  }, []);

  const handleSearchSubmit = useCallback((query: string): void => {
    // Search submit functionality will be implemented in Phase 3
    console.log('Search submitted:', query);
  }, []);

  const handleTagToggle = useCallback((tagName: string): void => {
    setSelectedTags(prev =>
      prev.includes(tagName)
        ? prev.filter(tag => tag !== tagName)
        : [...prev, tagName]
    );
  }, []);

  const handleClearAllTags = useCallback((): void => {
    setSelectedTags([]);
  }, []);

  const handleViewChange = useCallback((view: ViewMode): void => {
    setCurrentView(view);
    setSelectedTags([]); // Clear tag filters when switching views
  }, []);

  const handleNoteClick = useCallback((note: NoteData): void => {
    // Note click functionality will be implemented in Phase 3
    console.log('Note clicked:', note.title);
  }, []);

  const handleNotePin = useCallback((noteId: string): void => {
    // Pin functionality will be implemented in Phase 3
    console.log('Note pin toggled:', noteId);
  }, []);

  const handleNoteArchive = useCallback((noteId: string): void => {
    // Archive functionality will be implemented in Phase 3
    console.log('Note archive toggled:', noteId);
  }, []);

  return (
    <div className='flex-1 p-screen-margin space-y-4'>
      {/* Screen Header */}
      <div className='text-center mb-6'>
        <h1 className='text-section-header text-text-primary mb-2'>Notes</h1>
        <p className='text-secondary text-text-secondary'>
          Your thoughts and meeting notes
        </p>
      </div>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChange={handleSearchChange}
        onSearch={handleSearchSubmit}
        placeholder="Search notes..."
      />

      {/* Archive Toggle */}
      <ArchiveToggle
        currentView={currentView}
        onViewChange={handleViewChange}
        activeCounts={viewCounts}
      />

      {/* Tag Filter Area */}
      {allTags.length > 0 && (
        <TagFilterArea
          tags={allTags}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          onClearAll={handleClearAllTags}
        />
      )}

      {/* Notes List */}
      <div className='space-y-3' id="notes-content">
        {filteredNotes.length === 0 ? (
          <div className='text-center py-12'>
            <div className='w-16 h-16 mx-auto mb-4 bg-priority-optional bg-opacity-20 rounded-full flex items-center justify-center'>
              <svg
                className='w-8 h-8 text-priority-optional'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                />
              </svg>
            </div>
            <h3 className='text-card-title text-text-primary mb-2'>
              {searchQuery || selectedTags.length > 0
                ? 'No notes found'
                : currentView === 'archived'
                  ? 'No archived notes'
                  : 'No notes yet'
              }
            </h3>
            <p className='text-body text-text-secondary'>
              {searchQuery || selectedTags.length > 0
                ? 'Try adjusting your search or filter criteria.'
                : currentView === 'archived'
                  ? 'Archived notes will appear here when you archive them.'
                  : 'Create your first note to get started.'
              }
            </p>
          </div>
        ) : (
          <>
            {/* Pinned Notes First */}
            {filteredNotes
              .filter(note => note.isPinned && !note.isArchived)
              .map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onClick={handleNoteClick}
                  onPin={handleNotePin}
                  onArchive={handleNoteArchive}
                />
              ))
            }

            {/* Regular Notes */}
            {filteredNotes
              .filter(note => !note.isPinned || note.isArchived)
              .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
              .map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onClick={handleNoteClick}
                  onPin={handleNotePin}
                  onArchive={handleNoteArchive}
                />
              ))
            }
          </>
        )}
      </div>

      {/* Notes Summary */}
      {filteredNotes.length > 0 && (
        <div className='mt-6 p-4 bg-bg-card rounded-card'>
          <div className='flex items-center justify-between text-secondary'>
            <span className='text-text-secondary'>
              Showing {filteredNotes.length} of {currentView === 'active' ? viewCounts.active : viewCounts.archived} {currentView} notes
            </span>
            <div className='flex items-center gap-4'>
              <span className='text-text-secondary'>
                {sampleNotes.filter(n => n.isPinned && !n.isArchived).length} pinned
              </span>
              <span className='text-accent'>
                {selectedTags.length > 0 ? `${selectedTags.length} filter${selectedTags.length > 1 ? 's' : ''} active` : 'All notes'}
              </span>
              {searchQuery && (
                <span className='text-priority-important'>
                  Search: "{searchQuery}"
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesScreen;
