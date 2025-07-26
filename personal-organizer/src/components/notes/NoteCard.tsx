import React from 'react';
import { Card, Chip } from '@/components/common';

export interface NoteData {
  id: string;
  title: string;
  content: string;
  tags: string[];
  context: 'work' | 'personal';
  createdAt: Date;
  updatedAt: Date;
  isArchived?: boolean;
  isPinned?: boolean;
}

export interface NoteCardProps {
  note: NoteData;
  onClick?: (note: NoteData) => void;
  onPin?: (noteId: string) => void;
  onArchive?: (noteId: string) => void;
  className?: string;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onClick,
  onPin,
  onArchive,
  className = '',
}) => {
  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffWeeks < 4) return `${diffWeeks}w ago`;
    if (diffMonths < 12) return `${diffMonths}mo ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getPreviewText = (content: string): string => {
    // Remove markdown formatting and extra whitespace
    const cleanContent = content
      .replace(/[#*_`~]/g, '') // Remove markdown characters
      .replace(/\n\s*\n/g, ' ') // Replace multiple newlines with space
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
    
    // Limit to approximately 2 lines worth of text (about 120 characters)
    const maxLength = 120;
    if (cleanContent.length <= maxLength) return cleanContent;
    
    // Find the last complete word within the limit
    const truncated = cleanContent.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    
    return lastSpaceIndex > 0 
      ? truncated.substring(0, lastSpaceIndex) + '...'
      : truncated + '...';
  };

  const handleCardClick = (): void => {
    onClick?.(note);
  };

  const handlePinClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    onPin?.(note.id);
  };

  const handleArchiveClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    onArchive?.(note.id);
  };

  const cardClasses = [
    'border-l-4',
    note.context === 'work' ? 'border-l-context-work' : 'border-l-context-personal',
    note.isArchived ? 'opacity-75' : '',
    note.isPinned ? 'ring-2 ring-accent ring-opacity-30' : '',
    className,
  ].join(' ');

  const titleClasses = [
    'text-card-title',
    'text-text-primary',
    'font-semibold',
    'mb-2',
    'line-clamp-1',
    'pr-8', // Space for pin icon
  ].join(' ');

  const previewClasses = [
    'text-body',
    'text-text-secondary',
    'mb-3',
    'line-clamp-2',
    'leading-relaxed',
  ].join(' ');

  const metaClasses = [
    'flex',
    'items-center',
    'justify-between',
    'mb-3',
    'text-secondary',
    'text-text-secondary',
  ].join(' ');

  const tagsClasses = [
    'flex',
    'flex-wrap',
    'gap-1',
    'mt-2',
  ].join(' ');

  const actionButtonClasses = [
    'touch-target',
    'w-8',
    'h-8',
    'flex',
    'items-center',
    'justify-center',
    'rounded-full',
    'transition-all',
    'duration-200',
    'hover:bg-bg-tertiary',
    'focus:outline-none',
    'focus:bg-bg-tertiary',
  ].join(' ');

  return (
    <Card
      variant="glass"
      padding="md"
      className={cardClasses}
      onClick={handleCardClick}
      hoverable={!!onClick}
      {...(onClick && { 
        role: 'button',
        'aria-label': `View note: ${note.title}` 
      })}
    >
      {/* Header with Title and Pin Button */}
      <div className="relative">
        <h3 className={titleClasses}>{note.title}</h3>
        
        {/* Pin Button */}
        {onPin && (
          <button
            className={`absolute top-0 right-0 ${actionButtonClasses} ${
              note.isPinned ? 'text-accent' : 'text-text-secondary hover:text-accent'
            }`}
            onClick={handlePinClick}
            aria-label={note.isPinned ? 'Unpin note' : 'Pin note'}
          >
            <svg
              className="w-4 h-4"
              fill={note.isPinned ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Content Preview */}
      <p className={previewClasses}>
        {getPreviewText(note.content)}
      </p>

      {/* Metadata */}
      <div className={metaClasses}>
        <div className="flex items-center gap-2">
          <span>{formatRelativeTime(note.updatedAt)}</span>
          {note.isArchived && (
            <span className="px-2 py-1 bg-text-secondary bg-opacity-20 text-text-secondary rounded-chip text-micro">
              Archived
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Chip
            variant="context"
            color={note.context}
            size="sm"
            className="capitalize"
          >
            {note.context}
          </Chip>

          {/* Archive Button */}
          {onArchive && (
            <button
              className={`${actionButtonClasses} text-text-secondary hover:text-priority-urgent`}
              onClick={handleArchiveClick}
              aria-label={note.isArchived ? 'Unarchive note' : 'Archive note'}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={note.isArchived 
                    ? "M7 16l-4-4m0 0l4-4m-4 4h18" // Unarchive icon
                    : "M5 8l6 6m0 0l6-6m-6 6V3" // Archive icon
                  }
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className={tagsClasses}>
          {note.tags.slice(0, 4).map((tag) => (
            <Chip
              key={tag}
              variant="tag"
              size="sm"
              className="text-micro"
            >
              {tag}
            </Chip>
          ))}
          {note.tags.length > 4 && (
            <Chip variant="tag" size="sm" className="text-micro">
              +{note.tags.length - 4} more
            </Chip>
          )}
        </div>
      )}
    </Card>
  );
};

export default NoteCard;
