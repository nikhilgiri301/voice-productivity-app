import React, { useState, useRef, useEffect } from 'react';
import { GlassCard, GlassInput, GlassButton } from '../glass';

interface NoteTagSystemProps {
  tags: string[];
  selectedTags?: string[];
  onTagsChange?: (tags: string[]) => void;
  onTagFilter?: (tag: string) => void;
  onTagCreate?: (tag: string) => void;
  onTagDelete?: (tag: string) => void;
  allTags?: string[];
  className?: string;
  style?: React.CSSProperties;
  mode?: 'filter' | 'edit' | 'display';
  maxTags?: number;
  allowCreate?: boolean;
}

interface TagSuggestion {
  tag: string;
  count: number;
  color: string;
}

const TAG_COLORS = [
  'var(--accent-blue)',
  'var(--accent-green)',
  'var(--accent-orange)',
  'var(--accent-purple)',
  'var(--accent-red)',
  'var(--accent-yellow)',
];

const PREDEFINED_TAGS = [
  'work', 'personal', 'ideas', 'meeting', 'project', 'todo', 'important',
  'research', 'planning', 'review', 'draft', 'urgent', 'follow-up',
];

export const NoteTagSystem: React.FC<NoteTagSystemProps> = ({
  tags,
  selectedTags = [],
  onTagsChange,
  onTagFilter,
  onTagCreate,
  onTagDelete,
  allTags = [],
  className = '',
  style = {},
  mode = 'display',
  maxTags = 10,
  allowCreate = true,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<TagSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Get tag color based on tag name
  const getTagColor = (tag: string): string => {
    const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return TAG_COLORS[hash % TAG_COLORS.length];
  };

  // Generate tag suggestions based on input
  useEffect(() => {
    if (!inputValue.trim() || mode === 'display') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const query = inputValue.toLowerCase();
    const tagCounts = new Map<string, number>();
    
    // Count occurrences of each tag
    allTags.forEach(tag => {
      const count = tagCounts.get(tag) || 0;
      tagCounts.set(tag, count + 1);
    });

    // Filter and sort suggestions
    const filtered = Array.from(new Set([...allTags, ...PREDEFINED_TAGS]))
      .filter(tag => 
        tag.toLowerCase().includes(query) && 
        !tags.includes(tag) &&
        (!selectedTags || !selectedTags.includes(tag))
      )
      .map(tag => ({
        tag,
        count: tagCounts.get(tag) || 0,
        color: getTagColor(tag),
      }))
      .sort((a, b) => {
        // Prioritize exact matches
        if (a.tag.toLowerCase() === query) return -1;
        if (b.tag.toLowerCase() === query) return 1;
        
        // Then by usage count
        if (a.count !== b.count) return b.count - a.count;
        
        // Finally alphabetically
        return a.tag.localeCompare(b.tag);
      })
      .slice(0, 8);

    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
    setFocusedSuggestionIndex(-1);
  }, [inputValue, allTags, tags, selectedTags, mode]);

  // Handle tag addition
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (!trimmedTag || tags.includes(trimmedTag) || tags.length >= maxTags) return;

    const newTags = [...tags, trimmedTag];
    onTagsChange?.(newTags);
    onTagCreate?.(trimmedTag);
    setInputValue('');
    setShowSuggestions(false);
  };

  // Handle tag removal
  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    onTagsChange?.(newTags);
  };

  // Handle input key events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedSuggestionIndex >= 0 && suggestions[focusedSuggestionIndex]) {
        addTag(suggestions[focusedSuggestionIndex].tag);
      } else if (inputValue.trim() && allowCreate) {
        addTag(inputValue);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedSuggestionIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setFocusedSuggestionIndex(-1);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // Remove last tag when backspacing on empty input
      removeTag(tags[tags.length - 1]);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (tag: string) => {
    addTag(tag);
    inputRef.current?.focus();
  };

  // Handle tag filter click
  const handleTagClick = (tag: string) => {
    if (mode === 'filter') {
      onTagFilter?.(tag);
    } else if (mode === 'edit') {
      removeTag(tag);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`note-tag-system ${className}`} style={{ position: 'relative', ...style }}>
      {/* Tag display */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        marginBottom: mode === 'edit' ? '8px' : '0',
      }}>
        {tags.map((tag, index) => (
          <div
            key={index}
            style={{
              padding: '4px 8px',
              borderRadius: 'var(--radius-md)',
              background: `${getTagColor(tag)}20`,
              color: getTagColor(tag),
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-medium)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: mode === 'filter' ? 'pointer' : 'default',
              transition: 'all var(--transition-fast)',
              border: selectedTags.includes(tag) ? `2px solid ${getTagColor(tag)}` : '1px solid transparent',
            }}
            onClick={() => handleTagClick(tag)}
            onMouseEnter={(e) => {
              if (mode === 'filter') {
                e.currentTarget.style.background = `${getTagColor(tag)}30`;
                e.currentTarget.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (mode === 'filter') {
                e.currentTarget.style.background = `${getTagColor(tag)}20`;
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            <span>#</span>
            <span>{tag}</span>
            
            {mode === 'edit' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(tag);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  fontSize: '10px',
                  padding: '0',
                  marginLeft: '2px',
                  opacity: 0.7,
                  transition: 'opacity var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0.7';
                }}
              >
                ✕
              </button>
            )}
          </div>
        ))}

        {/* Add tag input (edit mode only) */}
        {mode === 'edit' && tags.length < maxTags && (
          <div style={{ position: 'relative', minWidth: '120px' }}>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(suggestions.length > 0)}
              placeholder="Add tag..."
              style={{
                border: 'none',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                padding: '4px 8px',
                fontSize: 'var(--font-size-xs)',
                color: 'var(--text-primary)',
                outline: 'none',
                width: '100%',
                minWidth: '80px',
              }}
            />
          </div>
        )}
      </div>

      {/* Tag suggestions dropdown */}
      {showSuggestions && mode === 'edit' && (
        <GlassCard
          ref={suggestionsRef}
          variant="elevated"
          padding="sm"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            marginTop: '4px',
            maxHeight: '200px',
            overflowY: 'auto',
            animation: 'slideInDown 0.2s ease-out',
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}>
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.tag}
                onClick={() => handleSuggestionClick(suggestion.tag)}
                style={{
                  padding: '8px 12px',
                  border: 'none',
                  background: focusedSuggestionIndex === index ? 'var(--bg-tertiary)' : 'transparent',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'background var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-tertiary)';
                  setFocusedSuggestionIndex(index);
                }}
                onMouseLeave={(e) => {
                  if (focusedSuggestionIndex !== index) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <span style={{
                    color: suggestion.color,
                    fontSize: 'var(--font-size-xs)',
                  }}>
                    #
                  </span>
                  <span style={{
                    color: 'var(--text-primary)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                  }}>
                    {suggestion.tag}
                  </span>
                </div>
                
                {suggestion.count > 0 && (
                  <span style={{
                    color: 'var(--text-tertiary)',
                    fontSize: 'var(--font-size-xs)',
                    background: 'var(--bg-secondary)',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-sm)',
                  }}>
                    {suggestion.count}
                  </span>
                )}
              </button>
            ))}
            
            {/* Create new tag option */}
            {allowCreate && inputValue.trim() && !suggestions.some(s => s.tag.toLowerCase() === inputValue.toLowerCase()) && (
              <button
                onClick={() => addTag(inputValue)}
                style={{
                  padding: '8px 12px',
                  border: 'none',
                  background: 'transparent',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'background var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  textAlign: 'left',
                  borderTop: '1px solid var(--border-secondary)',
                  marginTop: '4px',
                  paddingTop: '12px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-tertiary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{
                  color: 'var(--accent-green)',
                  fontSize: 'var(--font-size-sm)',
                }}>
                  +
                </span>
                <span style={{
                  color: 'var(--text-primary)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                }}>
                  Create "{inputValue}"
                </span>
              </button>
            )}
          </div>
        </GlassCard>
      )}

      {/* Tag limit indicator */}
      {mode === 'edit' && tags.length >= maxTags && (
        <div style={{
          fontSize: 'var(--font-size-xs)',
          color: 'var(--text-tertiary)',
          marginTop: '4px',
          fontStyle: 'italic',
        }}>
          Maximum {maxTags} tags reached
        </div>
      )}

      {/* CSS-in-JS styles */}
      <style jsx>{`
        .note-tag-system {
          width: 100%;
        }
        
        /* Scrollbar for suggestions */
        .note-tag-system div::-webkit-scrollbar {
          width: 4px;
        }
        
        .note-tag-system div::-webkit-scrollbar-track {
          background: var(--bg-secondary);
          border-radius: 2px;
        }
        
        .note-tag-system div::-webkit-scrollbar-thumb {
          background: var(--border-accent);
          border-radius: 2px;
        }
        
        /* Animation for suggestions dropdown */
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
        @media (max-width: 480px) {
          .note-tag-system input {
            font-size: var(--font-size-xs);
            padding: 3px 6px;
          }
        }
      `}</style>
    </div>
  );
};

export default NoteTagSystem;
