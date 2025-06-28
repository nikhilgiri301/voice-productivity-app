import React from 'react';
import { ProductivityItem } from '../../types';
import { Calendar, Clock, MapPin, Users, Edit, Trash2, Mic, Link } from 'lucide-react';
import { format } from 'date-fns';

interface CalendarCardProps {
  item: ProductivityItem;
  onEdit: (item: ProductivityItem) => void;
  onDelete: (id: string) => void;
  onShowLinks?: (item: ProductivityItem) => void;
}

export const CalendarCard: React.FC<CalendarCardProps> = ({
  item,
  onEdit,
  onDelete,
  onShowLinks
}) => {
  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'h:mm a');
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    const itemDate = new Date(dateString);
    return today.toDateString() === itemDate.toDateString();
  };

  const getDuration = () => {
    if (!item.start_time || !item.end_time) return '';
    const start = new Date(item.start_time);
    const end = new Date(item.end_time);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours === 0) {
      return `${diffMinutes}m`;
    } else if (diffMinutes === 0) {
      return `${diffHours}h`;
    } else {
      return `${diffHours}h ${diffMinutes}m`;
    }
  };

  const getAttendeesList = () => {
    if (!item.attendees || item.attendees.length === 0) return null;
    return item.attendees.join(', ');
  };

  return (
    <div className="ios-card p-4 hover:shadow-ios-lg transition-shadow duration-200">
      {/* Two-Column Layout */}
      <div className="flex items-start justify-between mb-3">
        {/* Left Column: Time Information */}
        <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
          <div className="p-2 bg-ios-blue bg-opacity-20 rounded-ios">
            <Calendar className="w-4 h-4 text-ios-blue" />
          </div>
          <div className="text-sm text-gray-300 font-mono">
            {item.start_time && (
              <div className="flex flex-col">
                <span className="text-white font-semibold">{formatTime(item.start_time)}</span>
                <span className="text-gray-400">↓ {getDuration()}</span>
                <span className="text-white font-semibold">{item.end_time && formatTime(item.end_time)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Event Details */}
        <div className="flex-1 ml-4 min-w-0">
          <h3 className="font-bold text-white text-lg leading-tight mb-1">
            {item.title}
          </h3>
          {item.description && (
            <p className="text-sm text-gray-300 leading-relaxed">
              {item.description}
            </p>
          )}
          {item.start_time && !isToday(item.start_time) && (
            <p className="text-xs text-gray-400 mt-1">
              📅 {formatDate(item.start_time)}
            </p>
          )}
          {item.location && (
            <p className="text-xs text-gray-400 mt-1">
              📍 {item.location}
            </p>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-1">
          {item.created_via === 'voice' && (
            <div className="p-1 bg-ios-purple bg-opacity-10 rounded">
              <Mic className="w-3 h-3 text-ios-purple" />
            </div>
          )}
          {onShowLinks && (
            <button
              onClick={() => onShowLinks(item)}
              className="p-1.5 text-ios-gray-500 hover:text-ios-purple hover:bg-ios-purple hover:bg-opacity-10 rounded transition-colors"
              title="Show linked items"
            >
              <Link className="w-4 h-4" />
            </button>
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
        <p className="text-sm text-ios-gray-600 mb-3 truncate">
          {item.description}
        </p>
      )}

      {/* Location */}
      {item.location && (
        <div className="flex items-center gap-2 text-sm text-ios-gray-600 mb-2">
          <MapPin className="w-3 h-3" />
          <span className="line-clamp-1">{item.location}</span>
        </div>
      )}

      {/* Attendees */}
      {item.attendees && item.attendees.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-ios-gray-600">
          <Users className="w-3 h-3" />
          <span className="line-clamp-1">
            {item.attendees.length === 1 
              ? `1 attendee: ${getAttendeesList()}`
              : `${item.attendees.length} attendees: ${getAttendeesList()}`
            }
          </span>
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
