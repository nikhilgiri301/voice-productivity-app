import React, { useState, useRef } from 'react';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Search notes...',
  disabled = false,
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
    if (e.key === 'Escape') {
      onChange('');
      inputRef.current?.blur();
    }
  };

  const handleSearchClick = (): void => {
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleClearClick = (): void => {
    onChange('');
    inputRef.current?.focus();
  };

  const handleFocus = (): void => {
    setIsFocused(true);
  };

  const handleBlur = (): void => {
    setIsFocused(false);
  };

  const containerClasses = [
    'relative',
    'flex',
    'items-center',
    'bg-bg-card',
    'rounded-button',
    'border',
    'border-border-default',
    'transition-all',
    'duration-200',
    'overflow-hidden',
    isFocused ? 'ring-2 ring-accent ring-opacity-50 border-accent' : '',
    disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-accent hover:border-opacity-50',
    className,
  ].join(' ');

  const inputClasses = [
    'flex-1',
    'px-4',
    'py-3',
    'bg-transparent',
    'text-body',
    'text-text-primary',
    'placeholder-text-secondary',
    'border-none',
    'outline-none',
    'min-w-0',
    disabled ? 'cursor-not-allowed' : '',
  ].join(' ');

  const iconButtonClasses = [
    'touch-target',
    'flex',
    'items-center',
    'justify-center',
    'w-10',
    'h-10',
    'text-text-secondary',
    'transition-colors',
    'duration-200',
    'hover:text-text-primary',
    'focus:outline-none',
    'focus:text-accent',
    disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
  ].join(' ');

  return (
    <div className={containerClasses}>
      {/* Search Icon */}
      <div className="pl-4 pr-2 flex items-center">
        <svg
          className="w-5 h-5 text-text-secondary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Input Field */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClasses}
        aria-label="Search notes"
      />

      {/* Action Buttons */}
      <div className="flex items-center pr-2">
        {/* Clear Button */}
        {value && !disabled && (
          <button
            className={iconButtonClasses}
            onClick={handleClearClick}
            aria-label="Clear search"
            type="button"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Search Button */}
        {onSearch && (
          <button
            className={iconButtonClasses}
            onClick={handleSearchClick}
            disabled={disabled || !value.trim()}
            aria-label="Search"
            type="button"
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
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Focus Indicator */}
      {isFocused && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent animate-scale-in" />
      )}
    </div>
  );
};

export default SearchBar;
