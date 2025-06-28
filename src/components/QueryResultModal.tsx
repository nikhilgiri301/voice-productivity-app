import React from 'react';
import { ProductivityItem } from '../types';
import { ItemCard } from './cards';
import { X, Search } from 'lucide-react';

interface QueryResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  results: ProductivityItem[];
  onEditItem: (item: ProductivityItem) => void;
  onDeleteItem: (id: string) => void;
  onToggleComplete?: (id: string) => void;
}

export const QueryResultModal: React.FC<QueryResultModalProps> = ({
  isOpen,
  onClose,
  query,
  results,
  onEditItem,
  onDeleteItem,
  onToggleComplete
}) => {
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
            <div>
              <h2 className="text-xl font-semibold text-white">
                Search Results
              </h2>
              <p className="text-sm text-gray-300 mt-1">
                "{query}"
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-ios transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="overflow-y-auto max-h-[70vh] p-6">
          {results.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-300 mb-4">
                Found {results.length} item{results.length !== 1 ? 's' : ''}
              </p>
              {results.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onEdit={onEditItem}
                  onDelete={onDeleteItem}
                  onToggleComplete={onToggleComplete}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                No Results Found
              </h3>
              <p className="text-gray-300">
                No items match your search query. Try rephrasing your request.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-700 bg-gray-900">
          <button
            onClick={onClose}
            className="py-2 px-4 text-sm bg-ios-blue text-white rounded-ios hover:bg-opacity-90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
