import React, { useState, useEffect } from 'react';
import VoiceMicButton, { type VoiceState } from './VoiceMicButton';
import WaveformAnimation from './WaveformAnimation';
import ProcessingState from './ProcessingState';

export interface VoiceInputBarProps {
  isExpanded?: boolean;
  onToggle?: () => void;
  onVoiceStart?: () => void;
  onVoiceStop?: () => void;
  onVoiceCancel?: () => void;
  disabled?: boolean;
  className?: string;
}

const VoiceInputBar: React.FC<VoiceInputBarProps> = ({
  isExpanded = false,
  onToggle,
  onVoiceStart,
  onVoiceStop,
  onVoiceCancel,
  disabled = false,
  className = '',
}) => {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');

  // Simulate voice state changes for demo purposes
  useEffect(() => {
    if (voiceState === 'listening') {
      // Simulate transcript updates
      const phrases = [
        'Create a new task...',
        'Schedule a meeting for tomorrow...',
        'Add a note about the project...',
        'Set a reminder to call John...',
      ];
      
      let currentPhrase = '';
      let phraseIndex = 0;
      let charIndex = 0;
      
      const interval = setInterval(() => {
        const currentPhrase_local = phrases[phraseIndex];
        if (phraseIndex < phrases.length && currentPhrase_local) {
          if (charIndex < currentPhrase_local.length) {
            currentPhrase += currentPhrase_local[charIndex];
            setTranscript(currentPhrase);
            charIndex++;
          } else {
            phraseIndex++;
            charIndex = 0;
            currentPhrase = '';
          }
        } else {
          clearInterval(interval);
          setVoiceState('processing');
          setTimeout(() => {
            setVoiceState('idle');
            setTranscript('');
            onToggle?.();
          }, 2000);
        }
      }, 100);

      return () => clearInterval(interval);
    }
    return undefined;
  }, [voiceState, onToggle]);

  const handleMicClick = (): void => {
    if (disabled) return;

    if (!isExpanded) {
      onToggle?.();
      return;
    }

    switch (voiceState) {
      case 'idle':
        setVoiceState('listening');
        onVoiceStart?.();
        break;
      case 'listening':
        setVoiceState('processing');
        onVoiceStop?.();
        break;
      case 'processing':
        // Cannot interrupt processing
        break;
      case 'error':
        setVoiceState('idle');
        setTranscript('');
        break;
      default:
        break;
    }
  };

  const handleCancel = (): void => {
    setVoiceState('idle');
    setTranscript('');
    onVoiceCancel?.();
    onToggle?.();
  };

  const containerClasses = [
    'fixed',
    'bottom-20', // Above tab bar
    'left-4',
    'right-4',
    'z-fixed',
    'transition-all',
    'duration-300',
    'ease-out',
    className,
  ].join(' ');

  const barClasses = [
    'bg-bg-primary',
    'bg-opacity-95',
    'backdrop-blur-glass',
    'rounded-card',
    'border',
    'border-border-default',
    'shadow-lg',
    'overflow-hidden',
    'transition-all',
    'duration-300',
    'ease-out',
    isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none',
  ].join(' ');

  const contentClasses = [
    'p-4',
    'space-y-4',
  ].join(' ');

  const transcriptClasses = [
    'min-h-12',
    'p-3',
    'bg-bg-card',
    'rounded-button',
    'border',
    'border-border-default',
    'text-body',
    'text-text-primary',
    'transition-all',
    'duration-200',
  ].join(' ');

  const placeholderClasses = [
    'text-text-secondary',
    'italic',
  ].join(' ');

  const controlsClasses = [
    'flex',
    'items-center',
    'justify-between',
  ].join(' ');

  const actionButtonClasses = [
    'touch-target',
    'flex',
    'items-center',
    'justify-center',
    'gap-2',
    'px-4',
    'py-2',
    'rounded-button',
    'text-secondary',
    'font-medium',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-accent',
    'focus:ring-opacity-50',
  ].join(' ');

  const getPlaceholderText = (): string => {
    switch (voiceState) {
      case 'idle':
        return 'Tap the microphone to start speaking...';
      case 'listening':
        return 'Listening... Speak now';
      case 'processing':
        return 'Processing your request...';
      case 'error':
        return 'Error occurred. Tap microphone to try again.';
      default:
        return 'Voice input ready';
    }
  };

  if (!isExpanded) {
    return null;
  }

  return (
    <div className={containerClasses}>
      <div className={barClasses}>
        <div className={contentClasses}>
          {/* Transcript Display */}
          <div className={transcriptClasses}>
            {voiceState === 'processing' ? (
              <ProcessingState
                isActive={true}
                onTimeout={() => {
                  setVoiceState('error');
                  setTimeout(() => {
                    setVoiceState('idle');
                    setTranscript('');
                  }, 3000);
                }}
                onError={(error) => {
                  console.error('Voice processing error:', error);
                  setVoiceState('error');
                }}
              />
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {transcript ? (
                    <span>{transcript}</span>
                  ) : (
                    <span className={placeholderClasses}>
                      {getPlaceholderText()}
                    </span>
                  )}

                  {/* Typing Cursor */}
                  {voiceState === 'listening' && transcript && (
                    <span className="inline-block w-0.5 h-5 bg-accent ml-1 animate-pulse" />
                  )}
                </div>

                {/* Waveform Animation */}
                {voiceState === 'listening' && (
                  <div className="ml-4 flex-shrink-0">
                    <WaveformAnimation
                      isActive={true}
                      barCount={8}
                      height={24}
                      color="rgb(236, 72, 153)" // accent color
                      className="opacity-80"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className={controlsClasses}>
            {/* Cancel Button */}
            <button
              className={`${actionButtonClasses} text-text-secondary hover:text-priority-urgent`}
              onClick={handleCancel}
              disabled={disabled}
              aria-label="Cancel voice input"
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
              <span>Cancel</span>
            </button>

            {/* Microphone Button */}
            <VoiceMicButton
              state={voiceState}
              onActivate={handleMicClick}
              disabled={disabled}
            />

            {/* Done Button */}
            <button
              className={`${actionButtonClasses} text-text-secondary hover:text-accent ${
                !transcript || voiceState !== 'idle' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => {
                // Done functionality will be implemented in Phase 3
                console.log('Voice input done:', transcript);
                handleCancel();
              }}
              disabled={disabled || !transcript || voiceState !== 'idle'}
              aria-label="Submit voice input"
            >
              <span>Done</span>
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>
          </div>

          {/* State Indicator */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 text-micro text-text-secondary">
              {voiceState === 'listening' && (
                <>
                  <div className="w-2 h-2 bg-priority-urgent rounded-full animate-pulse" />
                  <span>Recording</span>
                </>
              )}
              {voiceState === 'processing' && (
                <>
                  <div className="w-2 h-2 bg-priority-important rounded-full animate-spin" />
                  <span>Processing</span>
                </>
              )}
              {voiceState === 'error' && (
                <>
                  <div className="w-2 h-2 bg-priority-urgent rounded-full animate-bounce" />
                  <span>Error</span>
                </>
              )}
              {voiceState === 'idle' && transcript && (
                <>
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  <span>Ready to submit</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceInputBar;
