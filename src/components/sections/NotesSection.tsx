import React, { useState, useEffect } from 'react';
import BaseSection from './BaseSection';
import { NotesGrid } from '../notes';

interface Note {
  id: string;
  title?: string;
  content: string;
  tags: string[];
  linkedItems?: LinkedItem[];
  createdAt: string;
  updatedAt: string;
  isPinned?: boolean;
  color?: string;
  attachments?: Attachment[];
}

interface LinkedItem {
  id: string;
  type: 'event' | 'task';
  title: string;
  status?: string;
  dueDate?: string;
}

interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'file' | 'link';
  url: string;
  size?: number;
}

export const NotesSection: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Mock data for demonstration
  useEffect(() => {
    const mockNotes: Note[] = [
      {
        id: '1',
        title: 'Project Ideas',
        content: 'Brainstorming session notes for new features:\n\n• Voice command integration for hands-free operation\n• Advanced search with AI-powered relevance\n• Mobile-first responsive design improvements\n• Real-time collaboration features\n• Smart notification system\n\nNext steps: Create prototypes and gather user feedback.',
        tags: ['work', 'planning', 'ideas', 'development'],
        isPinned: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        linkedItems: [
          { id: 't1', type: 'task', title: 'Create voice command prototype', status: 'pending' },
          { id: 'e1', type: 'event', title: 'Team brainstorming session' },
        ],
      },
      {
        id: '2',
        title: 'Meeting Notes - Q4 Review',
        content: 'Quarterly review meeting highlights:\n\n📈 Performance Metrics:\n• Revenue increased by 15% compared to Q3\n• Customer satisfaction score: 4.2/5\n• Team productivity up 8%\n\n🎯 Key Focus Areas:\n• Customer retention strategies\n• Team expansion planning\n• Product roadmap refinement\n\n✅ Action Items:\n• Schedule follow-up with key clients\n• Draft hiring plan for Q1\n• Review and update pricing strategy',
        tags: ['meeting', 'quarterly', 'business', 'review'],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        linkedItems: [
          { id: 't2', type: 'task', title: 'Follow up with key clients', status: 'pending', dueDate: new Date(Date.now() + 172800000).toISOString() },
          { id: 't3', type: 'task', title: 'Draft Q1 hiring plan', status: 'pending' },
        ],
      },
      {
        id: '3',
        title: 'Recipe Collection',
        content: 'Delicious recipes to try this month:\n\n🍝 Mediterranean Pasta Salad\n• Cherry tomatoes, olives, feta cheese\n• Fresh basil and oregano\n• Lemon vinaigrette\n\n🍛 Thai Green Curry\n• Coconut milk base\n• Fresh vegetables and herbs\n• Jasmine rice on the side\n\n🍕 Homemade Pizza\n• Fresh mozzarella and basil\n• San Marzano tomatoes\n• Crispy thin crust\n\nNote: Try the farmers market for fresh ingredients!',
        tags: ['personal', 'cooking', 'recipes', 'food'],
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: '4',
        title: 'Book Recommendations',
        content: 'Must-read books for professional development:\n\n📚 Technical Books:\n• "Clean Code" by Robert Martin\n• "System Design Interview" by Alex Xu\n• "The Pragmatic Programmer" by Hunt & Thomas\n\n📚 Leadership & Management:\n• "The Manager\'s Path" by Camille Fournier\n• "Radical Candor" by Kim Scott\n• "Team Topologies" by Matthew Skelton\n\nCurrently reading: "Designing Data-Intensive Applications"',
        tags: ['personal', 'books', 'learning', 'development'],
        createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        updatedAt: new Date(Date.now() - 86400000).toISOString(), // Updated yesterday
      },
      {
        id: '5',
        content: 'Quick reminder: Don\'t forget to water the plants tomorrow morning. The succulents need water every 2 weeks, and the herbs need daily watering.',
        tags: ['personal', 'reminders', 'plants'],
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ];
    setNotes(mockNotes);
  }, []);

  // Filter and search notes
  useEffect(() => {
    let filtered = [...notes];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(note =>
        (note.title?.toLowerCase().includes(query)) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(note =>
        selectedTags.every(tag => note.tags.includes(tag))
      );
    }

    setFilteredNotes(filtered);
  }, [notes, searchQuery, selectedTags]);

  const handleSectionEnter = () => {
    console.log('Notes section entered');
  };

  const handleSectionExit = () => {
    console.log('Notes section exited');
  };

  const handleNoteEdit = (note: Note) => {
    console.log('Edit note:', note);
    // Open note editor modal or navigate to edit page
  };

  const handleNoteDelete = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  const handleNoteCreate = () => {
    console.log('Create new note');
    // Open note creation modal or navigate to create page
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleTagFilter = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
  };

  return (
    <BaseSection
      tabType="notes"
      onEnter={handleSectionEnter}
      onExit={handleSectionExit}
    >
      {/* Notes Grid with integrated search and filters */}
      <NotesGrid
        notes={filteredNotes}
        onNoteEdit={handleNoteEdit}
        onNoteDelete={handleNoteDelete}
        onNoteCreate={handleNoteCreate}
        loading={loading}
        hasMore={false}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedTags={selectedTags}
        onTagFilter={handleTagFilter}
        onClearFilters={handleClearFilters}
        layout="masonry"
        sortBy="updated"
        sortOrder="desc"
        style={{
          height: 'calc(100vh - 120px)', // Adjust based on header height
          overflowY: 'auto',
        }}
      />
    </BaseSection>
  );
};

export default NotesSection;
