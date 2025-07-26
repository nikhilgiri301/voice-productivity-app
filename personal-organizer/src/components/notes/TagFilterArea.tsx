import React, { useState, useRef, useEffect } from 'react';
import { Chip } from '@/components/common';

export interface TagData {
  name: string;
  count: number;
  color?: string;
}

export interface TagFilterAreaProps {
  tags: TagData[];
  selectedTags: string[];
  onTagToggle: (tagName: string) => void;
  onClearAll?: () => void;
  maxVisibleTags?: number;
  className?: string;
}

const TagFilterArea: React.FC<TagFilterAreaProps> = ({
  tags,
  selectedTags,
  onTagToggle,
  onClearAll,
  maxVisibleTags = 4,
  className = '',
}) => {
  const [showAllTags, setShowAllTags] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Sort tags by count (most used first)
  const sortedTags = [...tags].sort((a, b) => b.count - a.count);
  
  // Get visible tags (top N most used)
  const visibleTags = sortedTags.slice(0, maxVisibleTags);
  const hiddenTags = sortedTags.slice(maxVisibleTags);
  
  // Get tags to display based on current view
  const displayTags = showAllTags ? sortedTags : visibleTags;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
    return undefined;
  }, [isMenuOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
    return undefined;
  }, [isMenuOpen]);

  const handleTagClick = (tagName: string): void => {
    onTagToggle(tagName);
  };

  const handleMenuToggle = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleShowAllToggle = (): void => {
    setShowAllTags(!showAllTags);
    setIsMenuOpen(false);
  };

  const handleClearAll = (): void => {
    onClearAll?.();
    setIsMenuOpen(false);
  };

  const containerClasses = [
    'relative',
    'mb-4',
    className,
  ].join(' ');

  const tagsContainerClasses = [
    'flex',
    'flex-wrap',
    'gap-2',
    'items-center',
    'mb-2',
  ].join(' ');

  const menuClasses = [
    'absolute',
    'top-full',
    'right-0',
    'mt-1',
    'bg-bg-card',
    'rounded-card',
    'border',
    'border-border-default',
    'shadow-lg',
    'backdrop-blur-glass',
    'z-dropdown',
    'min-w-48',
    'overflow-hidden',
    'animate-scale-in',
  ].join(' ');

  const menuItemClasses = [
    'w-full',
    'flex',
    'items-center',
    'gap-3',
    'px-4',
    'py-3',
    'text-left',
    'text-body',
    'text-text-primary',
    'transition-colors',
    'duration-200',
    'hover:bg-bg-tertiary',
    'focus:bg-bg-tertiary',
    'focus:outline-none',
    'cursor-pointer',
  ].join(' ');

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className={containerClasses}>
      {/* Tags Display */}
      <div className={tagsContainerClasses}>
        {/* Tag Chips */}
        {displayTags.map((tag) => {
          const isSelected = selectedTags.includes(tag.name);
          
          return (
            <Chip
              key={tag.name}
              variant="filter"
              size="md"
              active={isSelected}
              onClick={() => handleTagClick(tag.name)}
              className="transition-all duration-200 hover:scale-105"
            >
              {tag.name} ({tag.count})
            </Chip>
          );
        })}

        {/* Show More/Less Button */}
        {hiddenTags.length > 0 && !showAllTags && (
          <button
            className="text-secondary text-accent hover:text-accent hover:opacity-80 transition-opacity duration-200 font-medium"
            onClick={handleShowAllToggle}
            aria-label={`Show ${hiddenTags.length} more tags`}
          >
            +{hiddenTags.length} more
          </button>
        )}

        {showAllTags && hiddenTags.length > 0 && (
          <button
            className="text-secondary text-accent hover:text-accent hover:opacity-80 transition-opacity duration-200 font-medium"
            onClick={handleShowAllToggle}
            aria-label="Show fewer tags"
          >
            Show less
          </button>
        )}

        {/* Menu Button */}
        <div className="relative">
          <button
            ref={buttonRef}
            className="touch-target flex items-center justify-center w-8 h-8 ml-2 text-text-secondary hover:text-text-primary transition-colors duration-200 rounded-full hover:bg-bg-tertiary focus:outline-none focus:bg-bg-tertiary"
            onClick={handleMenuToggle}
            aria-label="Tag filter options"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
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
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div ref={menuRef} className={menuClasses} role="menu">
              {/* Show All/Less Toggle */}
              <button
                className={menuItemClasses}
                onClick={handleShowAllToggle}
                role="menuitem"
              >
                <svg
                  className="w-4 h-4 text-text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={showAllTags ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                  />
                </svg>
                <span>
                  {showAllTags ? 'Show fewer tags' : `Show all ${tags.length} tags`}
                </span>
              </button>

              {/* Clear All */}
              {selectedTags.length > 0 && onClearAll && (
                <button
                  className={menuItemClasses}
                  onClick={handleClearAll}
                  role="menuitem"
                >
                  <svg
                    className="w-4 h-4 text-text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span>Clear all filters</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Selected Tags Summary */}
      {selectedTags.length > 0 && (
        <div className="flex items-center gap-2 text-secondary text-text-secondary">
          <span>Filtering by:</span>
          <div className="flex flex-wrap gap-1">
            {selectedTags.map((tagName) => (
              <span
                key={tagName}
                className="px-2 py-1 bg-accent bg-opacity-10 text-accent rounded-chip text-micro font-medium"
              >
                {tagName}
              </span>
            ))}
          </div>
          {onClearAll && (
            <button
              className="text-micro text-accent hover:text-accent hover:opacity-80 transition-opacity duration-200 underline"
              onClick={onClearAll}
            >
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TagFilterArea;
