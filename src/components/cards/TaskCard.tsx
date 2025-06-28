import React from 'react';
import { ProductivityItem, Priority } from '../../types';
import { CheckSquare, Square, Calendar, AlertCircle, Edit, Trash2, Mic } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  item: ProductivityItem;
  onEdit: (item: ProductivityItem) => void;
  onDelete: (id: string) => void;
  onToggleComplete?: (id: string) => void;
  onShowLinks?: (item: ProductivityItem) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  item,
  onEdit,
  onDelete,
  onToggleComplete
}) => {
  const formatDueDate = (dateString: string) => {
    const dueDate = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dueDate.toDateString() === today.toDateString()) {
      return `Today at ${format(dueDate, 'h:mm a')}`;
    } else if (dueDate.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${format(dueDate, 'h:mm a')}`;
    } else {
      return format(dueDate, 'MMM d, yyyy \'at\' h:mm a');
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

  const getPriorityLabel = (priority?: Priority) => {
    return priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : 'Medium';
  };

  const isOverdue = () => {
    if (!item.due_date) return false;
    return new Date(item.due_date) < new Date() && !item.completed;
  };

  return (
    <div className={`ios-card p-4 hover:shadow-ios-lg transition-all duration-200 ${
      item.completed ? 'opacity-75' : ''
    } ${isOverdue() ? 'border-l-4 border-ios-red' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          {/* Completion Toggle */}
          <button
            onClick={() => onToggleComplete?.(item.id)}
            className={`mt-0.5 p-1 rounded transition-colors ${
              item.completed 
                ? 'text-ios-green hover:text-ios-green hover:bg-ios-green hover:bg-opacity-10' 
                : 'text-ios-gray-400 hover:text-ios-green hover:bg-ios-green hover:bg-opacity-10'
            }`}
          >
            {item.completed ? (
              <CheckSquare className="w-5 h-5" />
            ) : (
              <Square className="w-5 h-5" />
            )}
          </button>
          
          <div className="flex-1">
            <h3 className={`font-bold truncate ${
              item.completed ? 'text-gray-500 line-through' : 'text-white'
            }`}>
              {item.title}
            </h3>
            
            {/* Priority and Due Date */}
            <div className="flex items-center gap-3 mt-1">
              {/* Priority Badge */}
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-opacity-10 ${getPriorityColor(item.priority)}`}>
                <AlertCircle className="w-3 h-3" />
                {getPriorityLabel(item.priority)}
              </div>
              
              {/* Due Date */}
              {item.due_date && (
                <div className={`flex items-center gap-1 text-xs ${
                  isOverdue() ? 'text-ios-red font-medium' : 'text-ios-gray-600'
                }`}>
                  <Calendar className="w-3 h-3" />
                  <span>{formatDueDate(item.due_date)}</span>
                  {isOverdue() && <span className="font-semibold">OVERDUE</span>}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-1">
          {item.created_via === 'voice' && (
            <div className="p-1 bg-ios-purple bg-opacity-10 rounded">
              <Mic className="w-3 h-3 text-ios-purple" />
            </div>
          )}
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 text-ios-gray-500 hover:text-ios-blue hover:bg-ios-blue hover:bg-opacity-10 rounded transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-1.5 text-ios-gray-500 hover:text-ios-red hover:bg-ios-red hover:bg-opacity-10 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Description */}
      {item.description && (
        <p className={`text-sm mb-3 ml-8 truncate ${
          item.completed ? 'text-ios-gray-400' : 'text-ios-gray-600'
        }`}>
          {item.description}
        </p>
      )}

      {/* Linked Items Indicator */}
      {item.linked_items && item.linked_items.length > 0 && (
        <div className="mt-3 pt-3 border-t border-ios-gray-200 ml-8">
          <span className="text-xs text-ios-gray-500">
            🔗 {item.linked_items.length} linked item{item.linked_items.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
};
