import React, { useState } from 'react';
import { ConfirmationCard, ProductivityItem } from '../../types';
import { FileText, Tag, Check, X, Edit, Mic } from 'lucide-react';

interface NoteConfirmationCardProps {
  card: ConfirmationCard;
  onApprove: (cardId: string) => void;
  onReject: (cardId: string) => void;
  onEdit: (item: Partial<ProductivityItem>) => void;
}

export const NoteConfirmationCard: React.FC<NoteConfirmationCardProps> = ({
  card,
  onApprove,
  onReject,
  onEdit
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: card.item.title || '',
    content: card.item.content || '',
    tags: card.item.tags?.join(', ') || ''
  });

  const getContentPreview = () => {
    const content = card.item.content || '';
    return content.length > 100 ? content.substring(0, 100) + '...' : content;
  };

  const handleSaveEdit = () => {
    onEdit({
      ...card.item,
      title: editData.title,
      content: editData.content,
      tags: editData.tags ? editData.tags.split(',').map(t => t.trim()).filter(t => t.length > 0) : undefined
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditData({
      title: card.item.title || '',
      content: card.item.content || '',
      tags: card.item.tags?.join(', ') || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-ios p-4 border-l-4 border-ios-purple">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-ios-purple bg-opacity-20 rounded-ios">
            <FileText className="w-4 h-4 text-ios-purple" />
          </div>
          <div>
            <h3 className="font-semibold text-white">
              {card.type === 'create' ? 'New Note' :
               card.type === 'edit' ? 'Edit Note' : 'Note'}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Mic className="w-3 h-3" />
              <span>Created by voice</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {isEditing ? (
        <div className="space-y-4 mb-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Note Title *
            </label>
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
              className="ios-input"
              placeholder="Note title"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Content *
            </label>
            <textarea
              value={editData.content}
              onChange={(e) => setEditData(prev => ({ ...prev, content: e.target.value }))}
              className="ios-input resize-none"
              rows={4}
              placeholder="Note content"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Tags
            </label>
            <input
              type="text"
              value={editData.tags}
              onChange={(e) => setEditData(prev => ({ ...prev, tags: e.target.value }))}
              className="ios-input"
              placeholder="Tags (comma-separated)"
            />
            <p className="mt-1 text-xs text-gray-400">
              Separate multiple tags with commas
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2 mb-4">
          <h4 className="font-medium text-white">{card.item.title}</h4>

          {card.item.content && (
            <p className="text-sm text-gray-300 whitespace-pre-wrap">
              {getContentPreview()}
            </p>
          )}
          
          {/* Tags */}
          {card.item.tags && card.item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {card.item.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-ios-purple bg-opacity-10 text-ios-purple"
                >
                  <Tag className="w-2.5 h-2.5 mr-1" />
                  {tag}
                </span>
              ))}
              {card.item.tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-ios-gray-100 text-ios-gray-600">
                  +{card.item.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <button
              onClick={handleCancelEdit}
              className="flex-1 py-2 px-3 text-sm border border-ios-gray-300 rounded-ios text-ios-gray-700 hover:bg-ios-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="flex-1 py-2 px-3 text-sm bg-ios-blue text-white rounded-ios hover:bg-opacity-90 transition-colors"
            >
              Save Changes
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onReject(card.id)}
              className="flex items-center justify-center gap-1 py-2 px-3 text-sm border border-ios-red text-ios-red rounded-ios hover:bg-ios-red hover:bg-opacity-10 transition-colors"
            >
              <X className="w-3 h-3" />
              Reject
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center justify-center gap-1 py-2 px-3 text-sm border border-ios-gray-300 text-ios-gray-700 rounded-ios hover:bg-ios-gray-50 transition-colors"
            >
              <Edit className="w-3 h-3" />
              Edit
            </button>
            <button
              onClick={() => onApprove(card.id)}
              className="flex-1 flex items-center justify-center gap-1 py-2 px-3 text-sm bg-ios-green text-white rounded-ios hover:bg-opacity-90 transition-colors"
            >
              <Check className="w-3 h-3" />
              Approve
            </button>
          </>
        )}
      </div>
    </div>
  );
};
