import React from 'react';

export type VoiceState = 'idle' | 'listening' | 'processing' | 'error';

export interface VoiceMicButtonProps {
  state?: VoiceState;
  onActivate?: () => void;
  disabled?: boolean;
  className?: string;
}

const VoiceMicButton: React.FC<VoiceMicButtonProps> = ({
  state = 'idle',
  onActivate,
  disabled = false,
  className = '',
}) => {
  const handleClick = (): void => {
    if (!disabled && onActivate) {
      onActivate();
    }
  };

  const getButtonClasses = (): string => {
    const baseClasses = [
      'touch-target',
      'relative',
      'flex',
      'items-center',
      'justify-center',
      'w-12',
      'h-12',
      'rounded-full',
      'transition-all',
      'duration-200',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-accent',
      'focus:ring-opacity-50',
      'overflow-hidden',
    ];

    const stateClasses = {
      idle: [
        'bg-accent',
        'text-white',
        'hover:bg-opacity-90',
        'active:scale-95',
        'shadow-lg',
        'hover:shadow-xl',
      ],
      listening: [
        'bg-priority-urgent',
        'text-white',
        'animate-recording-pulse',
        'shadow-lg',
        'ring-4',
        'ring-priority-urgent',
        'ring-opacity-30',
      ],
      processing: [
        'bg-priority-important',
        'text-white',
        'shadow-lg',
      ],
      error: [
        'bg-priority-urgent',
        'text-white',
        'shadow-lg',
        'animate-pulse',
      ],
    };

    const disabledClasses = disabled
      ? ['opacity-50', 'cursor-not-allowed']
      : ['cursor-pointer'];

    return [
      ...baseClasses,
      ...stateClasses[state],
      ...disabledClasses,
      className,
    ].join(' ');
  };

  const getMicrophoneIcon = (): React.ReactNode => {
    if (state === 'processing') {
      return (
        <svg
          className="w-6 h-6 animate-spin"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      );
    }

    if (state === 'error') {
      return (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      );
    }

    // Default microphone icon for idle and listening states
    return (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
        />
      </svg>
    );
  };

  const getStateLabel = (): string => {
    switch (state) {
      case 'idle':
        return 'Tap to speak';
      case 'listening':
        return 'Listening...';
      case 'processing':
        return 'Processing...';
      case 'error':
        return 'Error - Try again';
      default:
        return 'Voice input';
    }
  };

  const getAriaLabel = (): string => {
    if (disabled) return 'Voice input disabled';
    
    switch (state) {
      case 'idle':
        return 'Start voice input';
      case 'listening':
        return 'Voice input active - speak now';
      case 'processing':
        return 'Processing voice input';
      case 'error':
        return 'Voice input error - tap to retry';
      default:
        return 'Voice input button';
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Microphone Button */}
      <button
        className={getButtonClasses()}
        onClick={handleClick}
        disabled={disabled}
        aria-label={getAriaLabel()}
        type="button"
      >
        {getMicrophoneIcon()}
        
        {/* Listening Animation Ring */}
        {state === 'listening' && (
          <div className="absolute inset-0 rounded-full border-2 border-white border-opacity-30 animate-ping" />
        )}
      </button>

      {/* State Label */}
      <div className="mt-2 text-center">
        <span className="text-micro text-text-secondary font-medium">
          {getStateLabel()}
        </span>
      </div>

      {/* Visual State Indicator */}
      {state !== 'idle' && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
          <div
            className={[
              'w-2',
              'h-2',
              'rounded-full',
              state === 'listening' ? 'bg-priority-urgent animate-pulse' : '',
              state === 'processing' ? 'bg-priority-important animate-spin' : '',
              state === 'error' ? 'bg-priority-urgent animate-bounce' : '',
            ].join(' ')}
          />
        </div>
      )}
    </div>
  );
};

export default VoiceMicButton;
