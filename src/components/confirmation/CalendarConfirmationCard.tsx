import React, { useState } from 'react';
import { ConfirmationCard, ProductivityItem } from '../../types';
import { Calendar, Clock, MapPin, Users, Check, X, Edit, Mic } from 'lucide-react';
import { CalendarForm } from '../forms/CalendarForm';
import { format } from 'date-fns';

interface CalendarConfirmationCardProps {
  card: ConfirmationCard;
  onApprove: (cardId: string) => void;
  onReject: (cardId: string) => void;
  onEdit: (item: Partial<ProductivityItem>) => void;
}

export const CalendarConfirmationCard: React.FC<CalendarConfirmationCardProps> = ({
  card,
  onApprove,
  onReject,
  onEdit
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: card.item.title || '',
    description: card.item.description || '',
    start_time: card.item.start_time || '',
    end_time: card.item.end_time || '',
    location: card.item.location || '',
    attendees: card.item.attendees?.join(', ') || ''
  });

  const formatTime = (dateString?: string) => {
    if (!dateString) return 'Not set';
    try {
      return format(new Date(dateString), 'MMM d, yyyy \'at\' h:mm a');
    } catch {
      return 'Invalid date';
    }
  };

  const handleSaveEdit = () => {
    onEdit({
      ...card.item,
      title: editData.title,
      description: editData.description || undefined,
      start_time: editData.start_time || undefined,
      end_time: editData.end_time || undefined,
      location: editData.location || undefined,
      attendees: editData.attendees ? editData.attendees.split(',').map(a => a.trim()) : undefined
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditData({
      title: card.item.title || '',
      description: card.item.description || '',
      start_time: card.item.start_time || '',
      end_time: card.item.end_time || '',
      location: card.item.location || '',
      attendees: card.item.attendees?.join(', ') || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-ios p-4 border-l-4 border-ios-blue">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-ios-blue bg-opacity-20 rounded-ios">
            <Calendar className="w-4 h-4 text-ios-blue" />
          </div>
          <div>
            <h3 className="font-semibold text-white">
              {card.type === 'create' ? 'New Calendar Event' :
               card.type === 'edit' ? 'Edit Calendar Event' : 'Calendar Event'}
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
              Event Title *
            </label>
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
              className="ios-input"
              placeholder="Event title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Description
            </label>
            <textarea
              value={editData.description}
              onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
              className="ios-input resize-none"
              rows={2}
              placeholder="Description (optional)"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Start Time *
              </label>
              <input
                type="datetime-local"
                value={editData.start_time}
                onChange={(e) => setEditData(prev => ({ ...prev, start_time: e.target.value }))}
                className="ios-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                End Time *
              </label>
              <input
                type="datetime-local"
                value={editData.end_time}
                onChange={(e) => setEditData(prev => ({ ...prev, end_time: e.target.value }))}
                className="ios-input"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Location
            </label>
            <input
              type="text"
              value={editData.location}
              onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
              className="ios-input"
              placeholder="Location (optional)"
            />
          </div>

          {/* Attendees */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Attendees
            </label>
            <input
              type="text"
              value={editData.attendees}
              onChange={(e) => setEditData(prev => ({ ...prev, attendees: e.target.value }))}
              className="ios-input"
              placeholder="Attendees (comma-separated)"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-2 mb-4">
          <h4 className="font-medium text-white">{card.item.title}</h4>

          {card.item.description && (
            <p className="text-sm text-gray-300">{card.item.description}</p>
          )}

          <div className="space-y-1 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3" />
              <span>
                {formatTime(card.item.start_time)}
                {card.item.end_time && ` - ${formatTime(card.item.end_time)}`}
              </span>
            </div>

            {card.item.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                <span>{card.item.location}</span>
              </div>
            )}

            {card.item.attendees && card.item.attendees.length > 0 && (
              <div className="flex items-center gap-2">
                <Users className="w-3 h-3" />
                <span>{card.item.attendees.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <button
              onClick={handleCancelEdit}
              className="flex-1 py-2 px-3 text-sm border border-gray-600 rounded-ios text-gray-300 hover:bg-gray-700 transition-colors"
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
              className="flex items-center justify-center gap-1 py-2 px-3 text-sm border border-gray-600 text-gray-300 rounded-ios hover:bg-gray-700 transition-colors"
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
