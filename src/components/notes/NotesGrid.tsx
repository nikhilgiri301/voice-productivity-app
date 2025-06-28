import React, { useState, useRef, useEffect, useCallback } from 'react';
import NoteCard from './NoteCard';
import NoteTagSystem from './NoteTagSystem';
import { GlassCard, GlassInput, GlassButton } from '../glass';

interface NotesGridProps {
  notes: Note[];
  onNoteEdit?: (note: Note) => void;
  onNoteDelete?: (noteId: string) => void;
  onNoteCreate?: () => void;
  onLoadMore?: () => Promise<void>;
  loading?: boolean;
  hasMore?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  selectedTags?: string[];
  onTagFilter?: (tag: string) => void;
  onClearFilters?: () => void;
  className?: string;
  style?: React.CSSProperties;
  layout?: 'masonry' | 'grid' | 'list';
  sortBy?: 'created' | 'updated' | 'title' | 'relevance';
  sortOrder?: 'asc' | 'desc';
}

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

export const NotesGrid: React.FC<NotesGridProps> = ({
  notes,
  onNoteEdit,
  onNoteDelete,
  onNoteCreate,
  onLoadMore,
  loading = false,
  hasMore = false,
  searchQuery = '',
  onSearchChange,
  selectedTags = [],
  onTagFilter,
  onClearFilters,
  className = '',
  style = {},
  layout = 'masonry',
  sortBy = 'updated',
  sortOrder = 'desc',
}) => {
  const [columns, setColumns] = useState(3);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [showFilters, setShowFilters] = useState(false);
  
  const gridRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Calculate responsive columns
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 480) setColumns(1);
      else if (width < 768) setColumns(2);
      else if (width < 1200) setColumns(3);
      else setColumns(4);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // Set up infinite scroll
  useEffect(() => {
    if (!onLoadMore || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [onLoadMore, hasMore, loading]);

  // Handle search input with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchQuery) {
        onSearchChange?.(searchInput);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, searchQuery, onSearchChange]);

  // Sort and organize notes
  const sortedNotes = [...notes].sort((a, b) => {
    // Always put pinned notes first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    let comparison = 0;
    
    switch (sortBy) {
      case 'created':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'updated':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
      case 'title':
        const aTitle = a.title || a.content.split('\n')[0] || '';
        const bTitle = b.title || b.content.split('\n')[0] || '';
        comparison = aTitle.localeCompare(bTitle);
        break;
      case 'relevance':
        // Simple relevance based on search query match
        if (searchQuery) {
          const aRelevance = (a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ? 2 : 0) +
                           (a.content.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : 0);
          const bRelevance = (b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ? 2 : 0) +
                           (b.content.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : 0);
          comparison = bRelevance - aRelevance;
        }
        break;
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  // Organize notes into columns for masonry layout
  const organizeNotesIntoColumns = useCallback(() => {
    if (layout !== 'masonry') return [sortedNotes];

    const noteColumns: Note[][] = Array.from({ length: columns }, () => []);
    const columnHeights = new Array(columns).fill(0);

    sortedNotes.forEach((note) => {
      // Find the shortest column
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      noteColumns[shortestColumnIndex].push(note);
      
      // Estimate height based on content length (rough approximation)
      const estimatedHeight = 200 + (note.content.length * 0.1) + (note.tags.length * 20);
      columnHeights[shortestColumnIndex] += estimatedHeight;
    });

    return noteColumns;
  }, [sortedNotes, columns, layout]);

  const noteColumns = organizeNotesIntoColumns();

  // Get all unique tags from notes
  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

  // Handle tag click
  const handleTagClick = (tag: string) => {
    onTagFilter?.(tag);
  };

  // Handle linked item click
  const handleLinkedItemClick = (item: LinkedItem) => {
    console.log('Navigate to linked item:', item);
    // Navigate to the linked item
  };

  // Get active filter count
  const activeFilterCount = selectedTags.length + (searchQuery ? 1 : 0);

  // Empty state
  if (notes.length === 0 && !loading) {
    return (
      <div className={`notes-grid notes-grid--empty ${className}`} style={style}>
        <GlassCard variant="subtle" padding="xl" style={{ textAlign: 'center', margin: '20px' }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '16px',
            opacity: 0.5,
          }}>
            📝
          </div>
          <h3 style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--text-primary)',
            margin: '0 0 8px 0',
          }}>
            No notes found
          </h3>
          <p style={{
            fontSize: 'var(--font-size-base)',
            color: 'var(--text-secondary)',
            margin: '0 0 16px 0',
          }}>
            {searchQuery || selectedTags.length > 0 
              ? 'Try adjusting your search or filters'
              : 'Create your first note to get started'
            }
          </p>
          {onNoteCreate && (
            <GlassButton
              variant="primary"
              onClick={onNoteCreate}
              leftIcon="+"
            >
              Create Note
            </GlassButton>
          )}
        </GlassCard>
      </div>
    );
  }

  return (
    <div className={`notes-grid notes-grid--${layout} ${className}`} style={style}>
      {/* Search and filter bar */}
      <GlassCard variant="elevated" padding="md" style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: showFilters ? '16px' : '0',
        }}>
          {/* Search input */}
          <div style={{ flex: 1 }}>
            <GlassInput
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search notes..."
              leftIcon="🔍"
              rightIcon={searchInput ? "✕" : undefined}
              onRightIconClick={searchInput ? () => setSearchInput('') : undefined}
              fullWidth
            />
          </div>

          {/* Filter toggle */}
          <GlassButton
            variant={showFilters ? "primary" : "ghost"}
            size="md"
            onClick={() => setShowFilters(!showFilters)}
            leftIcon="🏷️"
          >
            Tags
            {activeFilterCount > 0 && (
              <span style={{
                marginLeft: '4px',
                padding: '2px 6px',
                borderRadius: '50%',
                background: 'var(--accent-red)',
                color: 'white',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-bold)',
                minWidth: '16px',
                textAlign: 'center',
              }}>
                {activeFilterCount}
              </span>
            )}
          </GlassButton>

          {/* Create note button */}
          {onNoteCreate && (
            <GlassButton
              variant="success"
              size="md"
              onClick={onNoteCreate}
              leftIcon="+"
            >
              New Note
            </GlassButton>
          )}

          {/* Clear filters */}
          {activeFilterCount > 0 && (
            <GlassButton
              variant="ghost"
              size="md"
              onClick={onClearFilters}
              leftIcon="🗑️"
            >
              Clear
            </GlassButton>
          )}
        </div>

        {/* Tag filter system */}
        {showFilters && (
          <NoteTagSystem
            tags={allTags}
            selectedTags={selectedTags}
            onTagFilter={handleTagClick}
            mode="filter"
            style={{
              animation: 'slideInDown 0.3s ease-out',
            }}
          />
        )}
      </GlassCard>

      {/* Notes grid */}
      <div
        ref={gridRef}
        style={{
          display: layout === 'list' ? 'flex' : 'grid',
          flexDirection: layout === 'list' ? 'column' : undefined,
          gridTemplateColumns: layout === 'grid' 
            ? `repeat(${columns}, 1fr)` 
            : layout === 'masonry' 
              ? `repeat(${columns}, 1fr)`
              : undefined,
          gap: '16px',
          alignItems: layout === 'masonry' ? 'start' : 'stretch',
        }}
      >
        {layout === 'masonry' ? (
          // Masonry layout
          noteColumns.map((columnNotes, columnIndex) => (
            <div
              key={columnIndex}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              {columnNotes.map((note, noteIndex) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={onNoteEdit}
                  onDelete={onNoteDelete}
                  onTagClick={handleTagClick}
                  onLinkedItemClick={handleLinkedItemClick}
                  style={{
                    animationDelay: `${(columnIndex * 0.1) + (noteIndex * 0.05)}s`,
                    animation: 'slideInUp 0.3s ease-out both',
                  }}
                />
              ))}
            </div>
          ))
        ) : (
          // Grid or list layout
          sortedNotes.map((note, index) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={onNoteEdit}
              onDelete={onNoteDelete}
              onTagClick={handleTagClick}
              onLinkedItemClick={handleLinkedItemClick}
              compact={layout === 'list'}
              style={{
                animationDelay: `${index * 0.05}s`,
                animation: 'slideInUp 0.3s ease-out both',
              }}
            />
          ))
        )}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '3px solid var(--border-secondary)',
            borderTopColor: 'var(--accent-blue)',
            animation: 'spin 1s linear infinite',
          }} />
        </div>
      )}

      {/* Load more trigger */}
      {hasMore && !loading && (
        <div ref={loadMoreRef} style={{ height: '20px', margin: '20px 0' }} />
      )}

      {/* CSS-in-JS styles */}
      <style jsx>{`
        .notes-grid {
          width: 100%;
          padding: 16px;
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .notes-grid {
            padding: 12px;
          }
          
          .notes-grid > div {
            gap: 12px;
          }
        }
        
        @media (max-width: 480px) {
          .notes-grid {
            padding: 8px;
          }
          
          .notes-grid > div {
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default NotesGrid;
