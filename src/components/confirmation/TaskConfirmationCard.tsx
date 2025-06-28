import React, { useState } from 'react';
import { ConfirmationCard, ProductivityItem, Priority } from '../../types';
import { CheckSquare, Calendar, AlertCircle, Check, X, Edit, Mic } from 'lucide-react';
import { format } from 'date-fns';

interface TaskConfirmationCardProps {
  card: ConfirmationCard;
  onApprove: (cardId: string) => void;
  onReject: (cardId: string) => void;
  onEdit: (item: Partial<ProductivityItem>) => void;
}

export const TaskConfirmationCard: React.FC<TaskConfirmationCardProps> = ({
  card,
  onApprove,
  onReject,
  onEdit
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: card.item.title || '',
    description: card.item.description || '',
    due_date: card.item.due_date || '',
    priority: (card.item.priority as Priority) || 'medium'
  });

  const formatDueDate = (dateString?: string) => {
    if (!dateString) return 'No due date';
    try {
      return format(new Date(dateString), 'MMM d, yyyy \'at\' h:mm a');
    } catch {
      return 'Invalid date';
    }
  };

  const getPriorityColor = (priority?: Priority) => {
    switch (priority) {
      case 'high': return 'text-ios-red bg-ios-red';
      case 'medium': return 'text-ios-orange bg-ios-orange';
      case 'low': return 'text-ios-green bg-ios-green';
      default: return 'text-ios-gray-500 bg-ios-gray-500';
    }
  };

  const handleSaveEdit = () => {
    onEdit({
      ...card.item,
      title: editData.title,
      description: editData.description || undefined,
      due_date: editData.due_date || undefined,
      priority: editData.priority
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditData({
      title: card.item.title || '',
      description: card.item.description || '',
      due_date: card.item.due_date || '',
      priority: (card.item.priority as Priority) || 'medium'
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-ios p-4 border-l-4 border-ios-green">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-ios-green bg-opacity-20 rounded-ios">
            <CheckSquare className="w-4 h-4 text-ios-green" />
          </div>
          <div>
            <h3 className="font-semibold text-white">
              {card.type === 'create' ? 'New Task' :
               card.type === 'edit' ? 'Edit Task' : 'Task'}
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
              Task Title *
            </label>
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
              className="ios-input"
              placeholder="Task title"
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

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Due Date
            </label>
            <input
              type="datetime-local"
              value={editData.due_date}
              onChange={(e) => setEditData(prev => ({ ...prev, due_date: e.target.value }))}
              className="ios-input"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Priority
            </label>
            <select
              value={editData.priority}
              onChange={(e) => setEditData(prev => ({ ...prev, priority: e.target.value as Priority }))}
              className="ios-input"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
        </div>
      ) : (
        <div className="space-y-2 mb-4">
          <h4 className="font-medium text-white">{card.item.title}</h4>

          {card.item.description && (
            <p className="text-sm text-gray-300">{card.item.description}</p>
          )}

          <div className="flex items-center gap-3 text-sm">
            {/* Priority Badge */}
            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-opacity-10 ${getPriorityColor(card.item.priority as Priority)}`}>
              <AlertCircle className="w-3 h-3" />
              {card.item.priority || 'medium'} priority
            </div>

            {/* Due Date */}
            {card.item.due_date && (
              <div className="flex items-center gap-1 text-gray-300">
                <Calendar className="w-3 h-3" />
                <span>{formatDueDate(card.item.due_date)}</span>
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
