import React, { useState, useRef } from 'react';
import { GlassCard } from '../glass';

interface NoteCardProps {
  note: Note;
  onEdit?: (note: Note) => void;
  onDelete?: (noteId: string) => void;
  onTagClick?: (tag: string) => void;
  onLinkedItemClick?: (item: LinkedItem) => void;
  className?: string;
  style?: React.CSSProperties;
  compact?: boolean;
  maxPreviewLength?: number;
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

const TAG_COLORS = [
  'var(--accent-blue)',
  'var(--accent-green)',
  'var(--accent-orange)',
  'var(--accent-purple)',
  'var(--accent-red)',
  'var(--accent-yellow)',
];

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onDelete,
  onTagClick,
  onLinkedItemClick,
  className = '',
  style = {},
  compact = false,
  maxPreviewLength = 200,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Get tag color based on tag name
  const getTagColor = (tag: string): string => {
    const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return TAG_COLORS[hash % TAG_COLORS.length];
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  // Truncate content for preview
  const getTruncatedContent = (): { text: string; isTruncated: boolean } => {
    if (isExpanded || note.content.length <= maxPreviewLength) {
      return { text: note.content, isTruncated: false };
    }
    
    const truncated = note.content.substring(0, maxPreviewLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    const finalText = lastSpaceIndex > maxPreviewLength * 0.8 
      ? truncated.substring(0, lastSpaceIndex) 
      : truncated;
    
    return { text: finalText + '...', isTruncated: true };
  };

  // Extract title from content if no title is provided
  const getDisplayTitle = (): string => {
    if (note.title) return note.title;
    
    const firstLine = note.content.split('\n')[0];
    if (firstLine.length > 50) {
      return firstLine.substring(0, 47) + '...';
    }
    return firstLine || 'Untitled Note';
  };

  // Get note background color
  const getNoteBackgroundColor = (): string => {
    if (note.color) return note.color;
    if (note.isPinned) return 'linear-gradient(135deg, rgba(255, 204, 0, 0.1) 0%, rgba(255, 204, 0, 0.05) 100%)';
    return 'var(--bg-card)';
  };

  const { text: previewText, isTruncated } = getTruncatedContent();
  const displayTitle = getDisplayTitle();

  return (
    <GlassCard
      ref={cardRef}
      variant="default"
      padding={compact ? "sm" : "md"}
      interactive={true}
      className={`note-card ${note.isPinned ? 'note-card--pinned' : ''} ${className}`}
      style={{
        background: getNoteBackgroundColor(),
        borderLeft: note.isPinned ? '4px solid var(--accent-yellow)' : undefined,
        position: 'relative',
        cursor: 'pointer',
        ...style,
      }}
      onClick={() => onEdit?.(note)}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Pin indicator */}
      {note.isPinned && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          color: 'var(--accent-yellow)',
          fontSize: '16px',
          zIndex: 2,
        }}>
          📌
        </div>
      )}

      {/* Note content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {/* Title */}
        <h3 style={{
          fontSize: compact ? 'var(--font-size-base)' : 'var(--font-size-lg)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--text-primary)',
          margin: 0,
          lineHeight: 'var(--line-height-tight)',
          paddingRight: note.isPinned ? '24px' : '0',
        }}>
          {displayTitle}
        </h3>

        {/* Content preview */}
        <div style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--text-secondary)',
          lineHeight: 'var(--line-height-normal)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}>
          {previewText}
          
          {isTruncated && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-blue)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                marginLeft: '4px',
                padding: '2px 4px',
                borderRadius: 'var(--radius-sm)',
                transition: 'background var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--accent-blue)20';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
              }}
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>

        {/* Tags */}
        {note.tags.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
          }}>
            {note.tags.map((tag, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick?.(tag);
                }}
                style={{
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: `${getTagColor(tag)}20`,
                  color: getTagColor(tag),
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${getTagColor(tag)}30`;
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `${getTagColor(tag)}20`;
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <span>#</span>
                <span>{tag}</span>
              </button>
            ))}
          </div>
        )}

        {/* Linked items */}
        {note.linkedItems && note.linkedItems.length > 0 && !compact && (
          <div style={{
            padding: '8px',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-secondary)',
          }}>
            <div style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--text-tertiary)',
              marginBottom: '6px',
              fontWeight: 'var(--font-weight-medium)',
            }}>
              Linked Items
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}>
              {note.linkedItems.map((item) => (
                <button
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onLinkedItemClick?.(item);
                  }}
                  style={{
                    padding: '4px 6px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: item.type === 'task' ? 'var(--accent-green)15' : 'var(--accent-blue)15',
                    color: item.type === 'task' ? 'var(--accent-green)' : 'var(--accent-blue)',
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 'var(--font-weight-medium)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = item.type === 'task' ? 'var(--accent-green)25' : 'var(--accent-blue)25';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = item.type === 'task' ? 'var(--accent-green)15' : 'var(--accent-blue)15';
                  }}
                >
                  <span>{item.type === 'task' ? '✓' : '📅'}</span>
                  <span>{item.title}</span>
                  {item.dueDate && (
                    <span style={{ 
                      marginLeft: 'auto', 
                      opacity: 0.7,
                      fontSize: 'var(--font-size-xs)',
                    }}>
                      {formatTimestamp(item.dueDate)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Attachments indicator */}
        {note.attachments && note.attachments.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--text-tertiary)',
          }}>
            <span>📎</span>
            <span>{note.attachments.length} attachment{note.attachments.length !== 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Footer with timestamp */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'auto',
          paddingTop: '8px',
          borderTop: '1px solid var(--border-secondary)',
        }}>
          <div style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--text-tertiary)',
            fontWeight: 'var(--font-weight-medium)',
          }}>
            {note.updatedAt !== note.createdAt ? 'Updated' : 'Created'} {formatTimestamp(note.updatedAt)}
          </div>

          {/* Character count for longer notes */}
          {note.content.length > 100 && (
            <div style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--text-tertiary)',
              opacity: 0.7,
            }}>
              {note.content.length} chars
            </div>
          )}
        </div>
      </div>

      {/* Action buttons (shown on hover) */}
      {showActions && !compact && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: note.isPinned ? '32px' : '8px',
          display: 'flex',
          gap: '4px',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-sm)',
          padding: '4px',
          boxShadow: 'var(--shadow-md)',
          animation: 'fadeIn 0.2s ease-out',
          zIndex: 3,
        }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(note);
            }}
            style={{
              background: 'none',
              border: 'none',
              padding: '4px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              color: 'var(--accent-blue)',
              fontSize: '14px',
              transition: 'background var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--accent-blue)20';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
            }}
            title="Edit note"
          >
            ✏️
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(note.id);
            }}
            style={{
              background: 'none',
              border: 'none',
              padding: '4px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              color: 'var(--accent-red)',
              fontSize: '14px',
              transition: 'background var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--accent-red)20';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
            }}
            title="Delete note"
          >
            🗑️
          </button>
        </div>
      )}

      {/* CSS-in-JS styles */}
      <style jsx>{`
        .note-card {
          transition: all var(--transition-fast);
          overflow: hidden;
        }
        
        .note-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }
        
        .note-card--pinned {
          background: linear-gradient(135deg, rgba(255, 204, 0, 0.1) 0%, rgba(255, 204, 0, 0.05) 100%);
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .note-card h3 {
            font-size: var(--font-size-base);
          }
          
          .note-card > div {
            gap: 8px;
          }
        }
        
        @media (max-width: 480px) {
          .note-card {
            padding: var(--spacing-3);
          }
        }
        
        /* Animation for action buttons */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </GlassCard>
  );
};

export default NoteCard;
