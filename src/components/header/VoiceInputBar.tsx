import React, { useState, useRef, useEffect } from 'react';
import { GlassInput, GlassButton } from '../glass';

interface VoiceInputBarProps {
  onVoiceInput?: (transcript: string) => void;
  onTextInput?: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  showWaveform?: boolean;
  maxRecordingTime?: number; // in seconds
  autoSubmit?: boolean;
}

type RecordingState = 'idle' | 'recording' | 'processing' | 'error';

export const VoiceInputBar: React.FC<VoiceInputBarProps> = ({
  onVoiceInput,
  onTextInput,
  placeholder = 'Type or speak your command...',
  disabled = false,
  className = '',
  style = {},
  showWaveform = true,
  maxRecordingTime = 120, // 2 minutes default
  autoSubmit = false,
}) => {
  const [textInput, setTextInput] = useState('');
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Check if Web Speech API is supported
  const isVoiceSupported = () => {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  };

  // Start voice recording
  const startRecording = async () => {
    try {
      setError(null);
      setRecordingState('recording');
      setRecordingTime(0);

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });

      // Set up audio analysis for waveform
      if (showWaveform) {
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);
        analyserRef.current.fftSize = 256;
        
        // Start audio level monitoring
        monitorAudioLevel();
      }

      // Set up MediaRecorder for fallback
      mediaRecorderRef.current = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        // Here you would typically send the audio to a speech-to-text service
        handleVoiceProcessing(audioBlob);
      };

      mediaRecorderRef.current.start();

      // Start recording timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          if (newTime >= maxRecordingTime) {
            stopRecording();
          }
          return newTime;
        });
      }, 1000);

      // Add haptic feedback if available
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }

    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Microphone access denied or not available');
      setRecordingState('error');
    }
  };

  // Stop voice recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop();
      setRecordingState('processing');
    }

    // Stop all streams
    if (mediaRecorderRef.current?.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }

    // Cleanup audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Clear timers
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setAudioLevel(0);
  };

  // Monitor audio level for waveform visualization
  const monitorAudioLevel = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const updateLevel = () => {
      if (analyserRef.current && recordingState === 'recording') {
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average / 255); // Normalize to 0-1
        
        animationFrameRef.current = requestAnimationFrame(updateLevel);
      }
    };

    updateLevel();
  };

  // Handle voice processing (placeholder for actual speech-to-text)
  const handleVoiceProcessing = async (audioBlob: Blob) => {
    try {
      // This is where you would integrate with a speech-to-text service
      // For now, we'll simulate processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate transcript
      const mockTranscript = 'Voice input received';
      onVoiceInput?.(mockTranscript);
      
      setRecordingState('idle');
      setRecordingTime(0);
    } catch (err) {
      console.error('Error processing voice:', err);
      setError('Failed to process voice input');
      setRecordingState('error');
    }
  };

  // Handle text input
  const handleTextSubmit = () => {
    if (textInput.trim()) {
      onTextInput?.(textInput.trim());
      if (autoSubmit) {
        setTextInput('');
      }
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit();
    }
  };

  // Get microphone button icon based on state
  const getMicrophoneIcon = () => {
    switch (recordingState) {
      case 'recording':
        return '⏹️';
      case 'processing':
        return '⏳';
      case 'error':
        return '❌';
      default:
        return '🎤';
    }
  };

  // Get microphone button variant
  const getMicrophoneVariant = () => {
    switch (recordingState) {
      case 'recording':
        return 'danger' as const;
      case 'processing':
        return 'secondary' as const;
      case 'error':
        return 'danger' as const;
      default:
        return 'primary' as const;
    }
  };

  // Format recording time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className={`voice-input-bar ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
        ...style,
      }}
    >
      {/* Text input field */}
      <GlassInput
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled || recordingState === 'recording'}
        fullWidth
        leftIcon={recordingState === 'recording' ? '🔴' : undefined}
        rightIcon={textInput.trim() ? '📤' : undefined}
        style={{ flex: 1 }}
      />

      {/* Voice recording button */}
      {isVoiceSupported() && (
        <GlassButton
          onClick={recordingState === 'recording' ? stopRecording : startRecording}
          disabled={disabled || recordingState === 'processing'}
          variant={getMicrophoneVariant()}
          size="md"
          loading={recordingState === 'processing'}
          style={{
            minWidth: '48px',
            position: 'relative',
          }}
        >
          {getMicrophoneIcon()}
          
          {/* Recording indicator */}
          {recordingState === 'recording' && showWaveform && (
            <div
              style={{
                position: 'absolute',
                bottom: '-2px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: `${Math.max(20, audioLevel * 40)}px`,
                height: '2px',
                background: 'var(--accent-red)',
                borderRadius: '1px',
                transition: 'width 0.1s ease-out',
              }}
            />
          )}
        </GlassButton>
      )}

      {/* Submit button for text */}
      {textInput.trim() && (
        <GlassButton
          onClick={handleTextSubmit}
          disabled={disabled}
          variant="success"
          size="md"
        >
          📤
        </GlassButton>
      )}

      {/* Recording time display */}
      {recordingState === 'recording' && (
        <div
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--accent-red)',
            fontWeight: 'var(--font-weight-medium)',
            fontFamily: 'var(--font-family-mono)',
            minWidth: '40px',
          }}
        >
          {formatTime(recordingTime)}
        </div>
      )}

      {/* Error display */}
      {error && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '8px',
            padding: '8px 12px',
            background: 'var(--color-error)',
            color: 'white',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--font-size-sm)',
            zIndex: 10,
          }}
        >
          {error}
        </div>
      )}

      {/* CSS-in-JS styles */}
      <style jsx>{`
        .voice-input-bar {
          position: relative;
        }
        
        /* Responsive adjustments */
        @media (max-width: 480px) {
          .voice-input-bar {
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default VoiceInputBar;
