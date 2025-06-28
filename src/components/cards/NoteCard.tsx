import React from 'react';
import { ProductivityItem } from '../../types';
import { FileText, Tag, Edit, Trash2, Mic } from 'lucide-react';
import { format } from 'date-fns';

interface NoteCardProps {
  item: ProductivityItem;
  onEdit: (item: ProductivityItem) => void;
  onDelete: (id: string) => void;
  onShowLinks?: (item: ProductivityItem) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  item,
  onEdit,
  onDelete
}) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy \'at\' h:mm a');
  };

  const getContentPreview = () => {
    if (!item.content) return '';
    return item.content.length > 150 
      ? item.content.substring(0, 150) + '...' 
      : item.content;
  };

  return (
    <div className="ios-card p-4 hover:shadow-ios-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-ios-purple bg-opacity-10 rounded-ios">
            <FileText className="w-4 h-4 text-ios-purple" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white truncate">
              {item.title}
            </h3>
            <p className="text-xs text-gray-400">
              {formatDate(item.created_at)}
            </p>
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

      {/* Content Preview */}
      {item.content && (
        <div className="mb-3">
          <p className="text-sm text-gray-300 whitespace-pre-wrap">
            {getContentPreview()}
          </p>
          {item.content.length > 150 && (
            <button
              onClick={() => onEdit(item)}
              className="text-xs text-ios-blue hover:text-ios-blue hover:underline mt-1"
            >
              Read more
            </button>
          )}
        </div>
      )}

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-ios-purple bg-opacity-10 text-ios-purple"
            >
              <Tag className="w-2.5 h-2.5 mr-1" />
              {tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-ios-gray-100 text-ios-gray-600">
              +{item.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Linked Items Indicator */}
      {item.linked_items && item.linked_items.length > 0 && (
        <div className="mt-3 pt-3 border-t border-ios-gray-200">
          <span className="text-xs text-ios-gray-500">
            🔗 {item.linked_items.length} linked item{item.linked_items.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
};
