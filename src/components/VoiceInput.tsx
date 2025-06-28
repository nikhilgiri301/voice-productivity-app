import React, { useState } from 'react';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { VoiceCommand } from '../types';
import { Mic, MicOff, Volume2, AlertCircle, X } from 'lucide-react';

interface VoiceInputProps {
  onVoiceCommand: (command: VoiceCommand) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onVoiceCommand,
  isOpen,
  onClose
}) => {
  const [showTranscript, setShowTranscript] = useState(false);
  
  const {
    isListening,
    isSupported,
    transcript,
    confidence,
    error,
    startListening,
    stopListening,
    resetTranscript
  } = useVoiceInput(onVoiceCommand, false);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      setShowTranscript(true);
      startListening();
    }
  };

  const handleSubmitTranscript = () => {
    if (transcript.trim() && onVoiceCommand) {
      const voiceCommand = {
        transcript: transcript.trim(),
        confidence: confidence,
        timestamp: new Date().toISOString()
      };

      onVoiceCommand(voiceCommand);
      handleClose();
    }
  };

  const handleClose = () => {
    if (isListening) {
      stopListening();
    }
    resetTranscript();
    setShowTranscript(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="ios-card p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-ios-purple bg-opacity-10 rounded-ios">
              <Volume2 className="w-5 h-5 text-ios-purple" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              Voice Input
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser Support Check */}
        {!isSupported && (
          <div className="mb-6 p-4 bg-ios-red bg-opacity-10 border border-ios-red border-opacity-20 rounded-ios">
            <div className="flex items-center gap-2 text-ios-red">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm font-medium">Speech Recognition Not Supported</p>
            </div>
            <p className="text-xs text-ios-red mt-1">
              Your browser doesn't support speech recognition. Please use Chrome, Safari, or Edge.
            </p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-ios-red bg-opacity-10 border border-ios-red border-opacity-20 rounded-ios">
            <div className="flex items-center gap-2 text-ios-red">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm font-medium">Error</p>
            </div>
            <p className="text-xs text-ios-red mt-1">{error}</p>
          </div>
        )}

        {/* Voice Input Button */}
        <div className="text-center mb-6">
          <button
            onClick={handleToggleListening}
            disabled={!isSupported}
            className={`
              w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 
              ${isListening 
                ? 'bg-ios-red text-white shadow-lg animate-pulse' 
                : 'bg-ios-blue text-white hover:bg-opacity-90 active:scale-95'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {isListening ? (
              <MicOff className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </button>
          
          <p className="text-sm text-gray-300 mt-3">
            {isListening
              ? 'Recording... Speak freely, tap to stop when done'
              : 'Tap to start voice input (up to 2 minutes)'
            }
          </p>
        </div>

        {/* Transcript Display */}
        {showTranscript && (
          <div className="mb-6">
            <div className="p-4 bg-gray-700 rounded-ios min-h-[80px] border border-gray-600">
              {transcript ? (
                <div>
                  <p className="text-sm text-white mb-2">
                    "{transcript}"
                  </p>
                  {confidence > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        Confidence: {Math.round(confidence * 100)}%
                      </span>
                      <div className="flex-1 bg-gray-600 rounded-full h-1">
                        <div
                          className="bg-ios-green h-1 rounded-full transition-all duration-300"
                          style={{ width: `${confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  {isListening
                    ? 'Speak now...'
                    : 'Your speech will appear here'
                  }
                </p>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-center">
          <h3 className="text-sm font-medium text-white mb-2">
            Voice Commands Examples:
          </h3>
          <div className="text-xs text-gray-300 space-y-1">
            <p>"Schedule coffee with Sarah Tuesday 3pm"</p>
            <p>"Add task: Buy groceries by Friday"</p>
            <p>"Create note: Meeting ideas"</p>
            <p>"Move my dentist appointment to Friday"</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleClose}
            className="py-3 px-4 border border-gray-600 rounded-ios text-gray-300 font-medium hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          {transcript && (
            <>
              <button
                onClick={() => {
                  resetTranscript();
                  setShowTranscript(false);
                }}
                className="py-3 px-4 border border-gray-600 rounded-ios text-gray-300 font-medium hover:bg-gray-700 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={handleSubmitTranscript}
                disabled={!transcript.trim()}
                className="flex-1 py-3 px-4 bg-ios-blue text-white rounded-ios font-medium hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Submit & Process
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
