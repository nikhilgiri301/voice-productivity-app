import React, { useEffect, useState } from 'react';

export interface ProcessingStateProps {
  isActive?: boolean;
  onTimeout?: () => void;
  onError?: (error: string) => void;
  timeoutDuration?: number;
  className?: string;
}

const ProcessingState: React.FC<ProcessingStateProps> = ({
  isActive = false,
  onTimeout,
  onError: _onError,
  timeoutDuration = 10000, // 10 seconds default
  className = '',
}) => {
  const [progress, setProgress] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Handle timeout and progress tracking
  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      setTimeElapsed(0);
      return undefined;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min((elapsed / timeoutDuration) * 100, 100);
      
      setProgress(progressPercent);
      setTimeElapsed(elapsed);

      // Check for timeout
      if (elapsed >= timeoutDuration) {
        clearInterval(interval);
        onTimeout?.();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, timeoutDuration, onTimeout]);

  const getProcessingMessage = (): string => {
    if (timeElapsed < 2000) {
      return 'Processing your request...';
    } else if (timeElapsed < 5000) {
      return 'Analyzing speech...';
    } else if (timeElapsed < 8000) {
      return 'Understanding context...';
    } else {
      return 'Almost done...';
    }
  };

  const containerClasses = [
    'flex',
    'flex-col',
    'items-center',
    'justify-center',
    'space-y-4',
    'transition-opacity',
    'duration-300',
    isActive ? 'opacity-100' : 'opacity-0',
    className,
  ].join(' ');

  const spinnerClasses = [
    'relative',
    'w-12',
    'h-12',
    'rounded-full',
    'border-4',
    'border-border-default',
    'border-t-accent',
    'animate-spin',
  ].join(' ');

  const progressRingClasses = [
    'absolute',
    'inset-0',
    'w-12',
    'h-12',
    'rounded-full',
    'border-4',
    'border-transparent',
    'border-t-priority-important',
    'transition-transform',
    'duration-100',
  ].join(' ');

  const messageClasses = [
    'text-secondary',
    'text-text-secondary',
    'text-center',
    'font-medium',
    'animate-pulse',
  ].join(' ');

  const progressBarClasses = [
    'w-32',
    'h-1',
    'bg-bg-tertiary',
    'rounded-full',
    'overflow-hidden',
  ].join(' ');

  const progressFillClasses = [
    'h-full',
    'bg-accent',
    'transition-all',
    'duration-100',
    'ease-out',
  ].join(' ');

  const dotsClasses = [
    'flex',
    'space-x-1',
  ].join(' ');

  const dotClasses = (index: number) => [
    'w-2',
    'h-2',
    'bg-accent',
    'rounded-full',
    'animate-bounce',
    `animation-delay-${index * 200}`,
  ].join(' ');

  if (!isActive) {
    return null;
  }

  return (
    <div className={containerClasses} role="status" aria-live="polite">
      {/* Main Spinner */}
      <div className="relative">
        <div className={spinnerClasses} />
        
        {/* Progress Ring */}
        <div 
          className={progressRingClasses}
          style={{
            transform: `rotate(${(progress / 100) * 360}deg)`,
          }}
        />
        
        {/* Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-accent"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
      </div>

      {/* Processing Message */}
      <div className={messageClasses}>
        {getProcessingMessage()}
      </div>

      {/* Animated Dots */}
      <div className={dotsClasses}>
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={dotClasses(index)}
            style={{
              animationDelay: `${index * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className={progressBarClasses}>
        <div
          className={progressFillClasses}
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      {/* Time Indicator */}
      <div className="text-micro text-text-secondary">
        {Math.ceil((timeoutDuration - timeElapsed) / 1000)}s remaining
      </div>

      {/* Warning for slow processing */}
      {timeElapsed > 7000 && (
        <div className="flex items-center gap-2 text-micro text-priority-important">
          <svg
            className="w-3 h-3"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>Taking longer than usual...</span>
        </div>
      )}
    </div>
  );
};

export default ProcessingState;
