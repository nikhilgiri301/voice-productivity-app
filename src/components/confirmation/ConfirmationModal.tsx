import React from 'react';
import { ConfirmationCard as ConfirmationCardType } from '../../types';
import { ConfirmationCard } from './ConfirmationCard';
import { X, CheckCircle, AlertCircle, Volume2 } from 'lucide-react';

interface ConfirmationModalProps {
  cards: ConfirmationCardType[];
  isOpen: boolean;
  onClose: () => void;
  onApprove: (cardId: string) => void;
  onReject: (cardId: string) => void;
  onEdit: (cardId: string, item: Partial<ConfirmationCardType['item']>) => void;
  onApproveAll: () => void;
  onRejectAll: () => void;
  transcript?: string;
  confidence?: number;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  cards,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onEdit,
  onApproveAll,
  onRejectAll,
  transcript,
  confidence
}) => {
  if (!isOpen || cards.length === 0) return null;

  const approvedCount = cards.filter(card => card.approved).length;
  const rejectedCount = cards.filter(card => card.rejected).length;
  const pendingCount = cards.filter(card => !card.approved && !card.rejected).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-ios-lg shadow-ios-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Voice Command Results
            </h2>
            <p className="text-sm text-gray-300 mt-1">
              Review and approve the items created from your voice command
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-ios transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Voice Transcript */}
        {transcript && (
          <div className="px-6 py-4 bg-gray-700 border-b border-gray-600">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-ios-purple bg-opacity-20 rounded-ios">
                <Volume2 className="w-4 h-4 text-ios-purple" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-white mb-2">
                  Voice Transcript
                </h3>
                <div className="bg-gray-800 rounded-ios p-3 border border-gray-600">
                  <p className="text-gray-200 text-sm leading-relaxed">
                    "{transcript}"
                  </p>
                  {confidence && confidence > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-400">
                        Confidence: {Math.round(confidence * 100)}%
                      </span>
                      <div className="flex-1 bg-gray-600 rounded-full h-1 max-w-[100px]">
                        <div
                          className="bg-ios-green h-1 rounded-full transition-all duration-300"
                          style={{ width: `${confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Summary */}
        <div className="px-6 py-4 bg-gray-700 border-b border-gray-600">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-ios-green" />
              <span className="text-gray-300">
                {approvedCount} approved
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-ios-orange" />
              <span className="text-gray-300">
                {pendingCount} pending
              </span>
            </div>
            <div className="flex items-center gap-2">
              <X className="w-4 h-4 text-ios-red" />
              <span className="text-gray-300">
                {rejectedCount} rejected
              </span>
            </div>
          </div>
        </div>

        {/* Cards List */}
        <div className="overflow-y-auto max-h-[50vh] p-6">
          <div className="space-y-4">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`transition-opacity duration-200 ${
                  card.approved || card.rejected ? 'opacity-60' : 'opacity-100'
                }`}
              >
                <ConfirmationCard
                  card={card}
                  onApprove={onApprove}
                  onReject={onReject}
                  onEdit={onEdit}
                />
                
                {/* Status Indicator */}
                {(card.approved || card.rejected) && (
                  <div className="mt-2 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      card.approved 
                        ? 'bg-ios-green bg-opacity-10 text-ios-green' 
                        : 'bg-ios-red bg-opacity-10 text-ios-red'
                    }`}>
                      {card.approved ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          Approved
                        </>
                      ) : (
                        <>
                          <X className="w-3 h-3" />
                          Rejected
                        </>
                      )}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-600 bg-gray-700">
          <div className="text-sm text-gray-300">
            {pendingCount > 0 ? (
              `${pendingCount} item${pendingCount !== 1 ? 's' : ''} pending review`
            ) : (
              'All items have been reviewed'
            )}
          </div>

          <div className="flex gap-3">
            {pendingCount > 0 && (
              <>
                <button
                  onClick={onRejectAll}
                  className="py-2 px-4 text-sm border border-ios-red text-ios-red rounded-ios hover:bg-ios-red hover:bg-opacity-10 transition-colors"
                >
                  Reject All
                </button>
                <button
                  onClick={onApproveAll}
                  className="py-2 px-4 text-sm bg-ios-green text-white rounded-ios hover:bg-opacity-90 transition-colors"
                >
                  Approve All
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="py-2 px-4 text-sm bg-ios-blue text-white rounded-ios hover:bg-opacity-90 transition-colors"
            >
              {pendingCount > 0 ? 'Close' : 'Done'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
