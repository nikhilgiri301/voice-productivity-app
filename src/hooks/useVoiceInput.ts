import { useState, useEffect, useCallback, useRef } from 'react';
import { VoiceCommand } from '../types';

interface UseVoiceInputReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  confidence: number;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export const useVoiceInput = (
  onVoiceCommand?: (command: VoiceCommand) => void,
  continuous: boolean = false
): UseVoiceInputReturn => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cumulativeTranscriptRef = useRef<string>('');
  const lastSpeechTimeRef = useRef<number>(Date.now());

  // Check for browser support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      
      const recognition = new SpeechRecognition();
      recognition.continuous = true; // Always use continuous mode for better UX
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      // Make recognition more tolerant of natural speech patterns
      if ('webkitSpeechRecognition' in window) {
        // Chrome-specific settings for better pause tolerance
        (recognition as any).webkitSpeechRecognition = true;
      }

      // Handle speech recognition results with cumulative transcription
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        let resultConfidence = 0;

        // Process all results from the current event
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcriptPart = result[0].transcript;

          if (result.isFinal) {
            finalTranscript += transcriptPart;
            resultConfidence = result[0].confidence;
          } else {
            interimTranscript += transcriptPart;
          }
        }

        // Update last speech time when we get new speech
        if (finalTranscript || interimTranscript) {
          lastSpeechTimeRef.current = Date.now();

          // Clear any existing pause timeout
          if (pauseTimeoutRef.current) {
            clearTimeout(pauseTimeoutRef.current);
            pauseTimeoutRef.current = null;
          }
        }

        // Accumulate final transcripts
        if (finalTranscript) {
          console.log('📝 Final transcript segment:', finalTranscript);

          // Add to cumulative transcript with proper spacing
          if (cumulativeTranscriptRef.current) {
            cumulativeTranscriptRef.current += ' ' + finalTranscript.trim();
          } else {
            cumulativeTranscriptRef.current = finalTranscript.trim();
          }

          console.log('📝 Cumulative transcript:', cumulativeTranscriptRef.current);
        }

        // Display cumulative + interim transcript
        const displayTranscript = cumulativeTranscriptRef.current +
          (interimTranscript ? ' ' + interimTranscript : '');

        setTranscript(displayTranscript);
        setConfidence(resultConfidence);

        // Set up 7-second pause timeout for natural speech breaks
        if (finalTranscript || interimTranscript) {
          pauseTimeoutRef.current = setTimeout(() => {
            console.log('⏸️ 7-second pause detected - continuing to listen...');
            // Don't stop listening, just log the pause
            // User can continue speaking and it will accumulate
          }, 7000);
        }
      };

      // Handle speech recognition start
      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        console.log('Speech recognition started');
      };

      // Handle speech recognition end
      recognition.onend = () => {
        console.log('Speech recognition ended');

        // Only set listening to false if we're not in the middle of processing
        // This prevents unwanted restarts during natural pauses
        setTimeout(() => {
          setIsListening(false);
        }, 100);

        // Clear any pending timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };

      // Handle speech recognition errors
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);

        switch (event.error) {
          case 'no-speech':
            // Don't treat natural pauses as errors - just log and continue
            console.log('Natural pause detected - this is normal during speech');
            // Don't set error or stop listening for natural pauses
            return;
          case 'audio-capture':
            setError('Microphone not accessible. Please check permissions.');
            setIsListening(false);
            break;
          case 'not-allowed':
            setError('Microphone access denied. Please allow microphone access.');
            setIsListening(false);
            break;
          case 'network':
            setError('Network error. Please check your connection.');
            setIsListening(false);
            break;
          case 'service-not-allowed':
            setError('Speech recognition service not allowed.');
            setIsListening(false);
            break;
          default:
            console.log(`Speech recognition event: ${event.error} - continuing...`);
            // Don't treat unknown errors as fatal - just log them
            return;
        }
      };

      // Handle no speech detected - be more tolerant
      recognition.onnomatch = () => {
        console.log('No speech match - this is normal during pauses');
        // Don't set error for no match - natural pauses are expected
      };

      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
      setError('Speech recognition is not supported in this browser.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [continuous, onVoiceCommand]);

  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) {
      setError('Speech recognition is not supported.');
      return;
    }

    if (isListening) {
      return; // Already listening
    }

    try {
      setError(null);
      setTranscript('');
      setConfidence(0);

      // Reset cumulative transcript for new session
      cumulativeTranscriptRef.current = '';
      lastSpeechTimeRef.current = Date.now();

      // Clear any existing pause timeout
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
        pauseTimeoutRef.current = null;
      }

      recognitionRef.current.start();

      // Set a timeout to automatically stop listening after 2 minutes
      timeoutRef.current = setTimeout(() => {
        stopListening();
        setError('2-minute listening timeout reached. Please try again if needed.');
      }, 120000); // 2 minutes
      
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setError('Failed to start speech recognition.');
    }
  }, [isSupported, isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }

    // Clear all timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }

    // Use cumulative transcript as final result
    if (cumulativeTranscriptRef.current) {
      console.log('🎤 Final cumulative transcript:', cumulativeTranscriptRef.current);
      setTranscript(cumulativeTranscriptRef.current);
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setConfidence(0);
    setError(null);
    cumulativeTranscriptRef.current = '';
    lastSpeechTimeRef.current = Date.now();

    // Clear pause timeout
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    confidence,
    error,
    startListening,
    stopListening,
    resetTranscript
  };
};

// Extend the Window interface to include speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }

  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
  }
}
