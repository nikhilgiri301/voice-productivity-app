import React, { useState } from 'react';
import { ProductivityItem, ItemType, Priority } from '../types';
import { Search, Filter, X, Calendar, CheckSquare, FileText } from 'lucide-react';

interface SearchFilters {
  query: string;
  type: ItemType | 'all';
  priority: Priority | 'all';
  completed: 'all' | 'completed' | 'pending';
  dateRange: 'all' | 'today' | 'week' | 'month' | 'overdue';
  createdVia: 'all' | 'voice' | 'manual';
  hasLinks: 'all' | 'linked' | 'unlinked';
}

interface AdvancedSearchProps {
  items: ProductivityItem[];
  onResults: (results: ProductivityItem[]) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  items,
  onResults,
  onClose,
  isOpen
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    type: 'all',
    priority: 'all',
    completed: 'all',
    dateRange: 'all',
    createdVia: 'all',
    hasLinks: 'all'
  });

  const [sortBy, setSortBy] = useState<'created_at' | 'title' | 'due_date' | 'priority'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSearch = () => {
    let results = [...items];

    // Text search
    if (filters.query.trim()) {
      const query = filters.query.toLowerCase();
      results = results.filter(item => {
        const searchableText = [
          item.title,
          item.description,
          item.content,
          item.location,
          ...(item.tags || []),
          ...(item.attendees || [])
        ].join(' ').toLowerCase();
        
        return searchableText.includes(query);
      });
    }

    // Type filter
    if (filters.type !== 'all') {
      results = results.filter(item => item.type === filters.type);
    }

    // Priority filter
    if (filters.priority !== 'all') {
      results = results.filter(item => item.priority === filters.priority);
    }

    // Completion filter
    if (filters.completed !== 'all') {
      results = results.filter(item => {
        if (item.type !== 'task') return true;
        return filters.completed === 'completed' ? item.completed : !item.completed;
      });
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      results = results.filter(item => {
        const itemDate = new Date(item.start_time || item.due_date || item.created_at);
        
        switch (filters.dateRange) {
          case 'today':
            return itemDate >= today && itemDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
          case 'week':
            const weekStart = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000);
            const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
            return itemDate >= weekStart && itemDate < weekEnd;
          case 'month':
            const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
            const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1);
            return itemDate >= monthStart && itemDate < monthEnd;
          case 'overdue':
            return item.type === 'task' && item.due_date && new Date(item.due_date) < now && !item.completed;
          default:
            return true;
        }
      });
    }

    // Created via filter
    if (filters.createdVia !== 'all') {
      results = results.filter(item => item.created_via === filters.createdVia);
    }

    // Links filter
    if (filters.hasLinks !== 'all') {
      results = results.filter(item => {
        const hasLinks = item.linked_items && item.linked_items.length > 0;
        return filters.hasLinks === 'linked' ? hasLinks : !hasLinks;
      });
    }

    // Sort results
    results.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'due_date':
          aValue = a.due_date || a.start_time || a.created_at;
          bValue = b.due_date || b.start_time || b.created_at;
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority as Priority] || 0;
          bValue = priorityOrder[b.priority as Priority] || 0;
          break;
        default:
          aValue = a.created_at;
          bValue = b.created_at;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    onResults(results);
  };

  const handleReset = () => {
    setFilters({
      query: '',
      type: 'all',
      priority: 'all',
      completed: 'all',
      dateRange: 'all',
      createdVia: 'all',
      hasLinks: 'all'
    });
    setSortBy('created_at');
    setSortOrder('desc');
    onResults(items);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-ios-lg shadow-ios-lg w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-ios-blue bg-opacity-20 rounded-ios">
              <Search className="w-5 h-5 text-ios-blue" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              Advanced Search
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-ios transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Form */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Text Search */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">
              Search Text
            </label>
            <input
              type="text"
              value={filters.query}
              onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
              className="ios-input"
              placeholder="Search in titles, descriptions, content..."
            />
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Item Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as any }))}
                className="ios-input"
              >
                <option value="all">All Types</option>
                <option value="calendar">Calendar Events</option>
                <option value="task">Tasks</option>
                <option value="note">Notes</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Priority
              </label>
              <select
                value={filters.priority}
                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value as any }))}
                className="ios-input"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Completion Filter */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Completion Status
              </label>
              <select
                value={filters.completed}
                onChange={(e) => setFilters(prev => ({ ...prev, completed: e.target.value as any }))}
                className="ios-input"
              >
                <option value="all">All Items</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
                className="ios-input"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            {/* Created Via Filter */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Created Via
              </label>
              <select
                value={filters.createdVia}
                onChange={(e) => setFilters(prev => ({ ...prev, createdVia: e.target.value as any }))}
                className="ios-input"
              >
                <option value="all">All Methods</option>
                <option value="voice">Voice Input</option>
                <option value="manual">Manual Input</option>
              </select>
            </div>

            {/* Links Filter */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Linked Items
              </label>
              <select
                value={filters.hasLinks}
                onChange={(e) => setFilters(prev => ({ ...prev, hasLinks: e.target.value as any }))}
                className="ios-input"
              >
                <option value="all">All Items</option>
                <option value="linked">Has Links</option>
                <option value="unlinked">No Links</option>
              </select>
            </div>
          </div>

          {/* Sorting */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="ios-input"
              >
                <option value="created_at">Created Date</option>
                <option value="title">Title</option>
                <option value="due_date">Due Date</option>
                <option value="priority">Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Sort Order
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="ios-input"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between p-6 border-t border-gray-700 bg-gray-900">
          <button
            onClick={handleReset}
            className="py-2 px-4 text-sm border border-gray-600 text-gray-300 rounded-ios hover:bg-gray-700 transition-colors"
          >
            Reset Filters
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="py-2 px-4 text-sm border border-gray-600 text-gray-300 rounded-ios hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleSearch();
                onClose();
              }}
              className="py-2 px-4 text-sm bg-ios-blue text-white rounded-ios hover:bg-opacity-90 transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
