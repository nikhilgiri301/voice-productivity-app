import React, { useState, useRef, useEffect } from 'react';
import { type TaskState } from './TaskCard';

export interface TaskStateSelectorProps {
  currentState: TaskState;
  onStateChange: (newState: TaskState) => void;
  disabled?: boolean;
  className?: string;
}

interface StateOption {
  value: TaskState;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const TaskStateSelector: React.FC<TaskStateSelectorProps> = ({
  currentState,
  onStateChange,
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const stateOptions: StateOption[] = [
    {
      value: 'not-started',
      label: 'Not Started',
      description: 'Task has not been started yet',
      color: 'text-text-secondary',
      icon: (
        <div className="w-4 h-4 border-2 border-text-secondary rounded" />
      ),
    },
    {
      value: 'in-progress',
      label: 'In Progress',
      description: 'Task is currently being worked on',
      color: 'text-accent',
      icon: (
        <div className="w-4 h-4 border-2 border-accent rounded flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-accent rounded-full" />
        </div>
      ),
    },
    {
      value: 'blocked',
      label: 'Blocked',
      description: 'Task is blocked by external dependencies',
      color: 'text-priority-urgent',
      icon: (
        <div className="w-4 h-4 bg-priority-urgent rounded flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM10 18a8 8 0 100-16 8 8 0 000 16z" clipRule="evenodd" />
          </svg>
        </div>
      ),
    },
    {
      value: 'deferred',
      label: 'Deferred',
      description: 'Task has been postponed to a later time',
      color: 'text-priority-useful',
      icon: (
        <div className="w-4 h-4 bg-priority-useful rounded flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-black" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        </div>
      ),
    },
    {
      value: 'cancelled',
      label: 'Cancelled',
      description: 'Task has been cancelled and will not be completed',
      color: 'text-text-secondary',
      icon: (
        <div className="w-4 h-4 bg-text-secondary rounded flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      ),
    },
    {
      value: 'completed',
      label: 'Completed',
      description: 'Task has been successfully completed',
      color: 'text-accent',
      icon: (
        <div className="w-4 h-4 bg-accent rounded flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      ),
    },
  ];

  const currentOption = stateOptions.find(option => option.value === currentState);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
    return undefined;
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
    return undefined;
  }, [isOpen]);

  const handleToggle = (): void => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleStateSelect = (newState: TaskState): void => {
    onStateChange(newState);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const buttonClasses = [
    'touch-target',
    'flex',
    'items-center',
    'gap-2',
    'px-3',
    'py-2',
    'bg-bg-card',
    'rounded-button',
    'border',
    'border-border-default',
    'transition-all',
    'duration-200',
    'focus-ring',
    disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-80 cursor-pointer',
    isOpen ? 'ring-2 ring-accent ring-opacity-50' : '',
    className,
  ].join(' ');

  const dropdownClasses = [
    'absolute',
    'top-full',
    'left-0',
    'right-0',
    'mt-1',
    'bg-bg-card',
    'rounded-card',
    'border',
    'border-border-default',
    'shadow-lg',
    'backdrop-blur-glass',
    'z-dropdown',
    'overflow-hidden',
    'animate-scale-in',
  ].join(' ');

  const optionClasses = (_option: StateOption, isSelected: boolean) => [
    'w-full',
    'flex',
    'items-center',
    'gap-3',
    'px-3',
    'py-3',
    'text-left',
    'transition-colors',
    'duration-200',
    'hover:bg-bg-tertiary',
    'focus:bg-bg-tertiary',
    'focus:outline-none',
    isSelected ? 'bg-accent bg-opacity-10' : '',
  ].join(' ');

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        className={buttonClasses}
        onClick={handleToggle}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Current state: ${currentOption?.label}. Click to change state.`}
      >
        {currentOption?.icon}
        <span className={`text-secondary font-medium ${currentOption?.color}`}>
          {currentOption?.label}
        </span>
        <svg
          className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div ref={dropdownRef} className={dropdownClasses} role="listbox">
          {stateOptions.map((option) => {
            const isSelected = option.value === currentState;
            
            return (
              <button
                key={option.value}
                className={optionClasses(option, isSelected)}
                onClick={() => handleStateSelect(option.value)}
                role="option"
                aria-selected={isSelected}
                aria-label={option.description}
              >
                {option.icon}
                <div className="flex-1 min-w-0">
                  <div className={`text-body font-medium ${option.color}`}>
                    {option.label}
                  </div>
                  <div className="text-micro text-text-secondary">
                    {option.description}
                  </div>
                </div>
                {isSelected && (
                  <svg
                    className="w-4 h-4 text-accent flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TaskStateSelector;
