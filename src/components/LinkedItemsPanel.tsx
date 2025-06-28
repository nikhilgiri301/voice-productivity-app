import React, { useState, useEffect } from 'react';
import { ProductivityItem } from '../types';
import { LinkingService } from '../lib/linkingService';
import { Link, Plus, X, Calendar, CheckSquare, FileText } from 'lucide-react';

interface LinkedItemsPanelProps {
  item: ProductivityItem;
  allItems: ProductivityItem[];
  onItemClick: (item: ProductivityItem) => void;
  onClose: () => void;
}

export const LinkedItemsPanel: React.FC<LinkedItemsPanelProps> = ({
  item,
  allItems,
  onItemClick,
  onClose
}) => {
  const [linkedItems, setLinkedItems] = useState<ProductivityItem[]>([]);
  const [suggestedItems, setSuggestedItems] = useState<ProductivityItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLinkedItems();
    loadSuggestions();
  }, [item.id]);

  const loadLinkedItems = async () => {
    const linked = await LinkingService.getLinkedItems(item.id);
    setLinkedItems(linked);
    setLoading(false);
  };

  const loadSuggestions = async () => {
    const otherItems = allItems.filter(i => 
      i.id !== item.id && 
      !(item.linked_items || []).includes(i.id)
    );
    
    const suggestions = LinkingService.detectRelationships(item, otherItems);
    const suggestedItemObjects = otherItems.filter(i => suggestions.includes(i.id));
    setSuggestedItems(suggestedItemObjects);
  };

  const handleAddLink = async (targetItem: ProductivityItem) => {
    const success = await LinkingService.createLink(item.id, targetItem.id);
    if (success) {
      setLinkedItems(prev => [...prev, targetItem]);
      setSuggestedItems(prev => prev.filter(i => i.id !== targetItem.id));
    }
  };

  const handleRemoveLink = async (targetItem: ProductivityItem) => {
    const success = await LinkingService.removeLink(item.id, targetItem.id);
    if (success) {
      setLinkedItems(prev => prev.filter(i => i.id !== targetItem.id));
    }
  };

  const getItemIcon = (itemType: string) => {
    switch (itemType) {
      case 'calendar': return <Calendar className="w-4 h-4 text-ios-blue" />;
      case 'task': return <CheckSquare className="w-4 h-4 text-ios-green" />;
      case 'note': return <FileText className="w-4 h-4 text-ios-purple" />;
      default: return <FileText className="w-4 h-4 text-ios-gray-500" />;
    }
  };

  const getItemTypeColor = (itemType: string) => {
    switch (itemType) {
      case 'calendar': return 'border-ios-blue bg-ios-blue';
      case 'task': return 'border-ios-green bg-ios-green';
      case 'note': return 'border-ios-purple bg-ios-purple';
      default: return 'border-ios-gray-500 bg-ios-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-ios-lg border-l border-ios-gray-200 z-40">
        <div className="p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-ios-blue"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-gray-800 shadow-ios-lg border-l border-gray-700 z-40 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-900">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Link className="w-5 h-5 text-ios-blue" />
            <h3 className="font-semibold text-white">Linked Items</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-gray-300">
          Items related to "{item.title}"
        </p>
      </div>

      {/* Current Item */}
      <div className="p-4 border-b border-gray-700">
        <div className={`p-3 rounded-ios border-l-4 ${getItemTypeColor(item.type)} bg-opacity-10`}>
          <div className="flex items-center gap-2 mb-1">
            {getItemIcon(item.type)}
            <span className="text-sm font-medium text-white">Current Item</span>
          </div>
          <p className="text-sm text-gray-300 truncate">{item.title}</p>
        </div>
      </div>

      {/* Linked Items */}
      <div className="p-4">
        <h4 className="font-medium text-white mb-3">
          Linked Items ({linkedItems.length})
        </h4>
        
        {linkedItems.length > 0 ? (
          <div className="space-y-2">
            {linkedItems.map((linkedItem) => (
              <div
                key={linkedItem.id}
                className="p-3 border border-ios-gray-200 rounded-ios hover:bg-ios-gray-50 cursor-pointer group"
                onClick={() => onItemClick(linkedItem)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    {getItemIcon(linkedItem.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white truncate">
                        {linkedItem.title}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">
                        {linkedItem.type}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveLink(linkedItem);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-ios-red hover:bg-ios-red hover:bg-opacity-10 rounded transition-all"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">No linked items</p>
        )}
      </div>

      {/* Suggestions */}
      {suggestedItems.length > 0 && (
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-white">
              Suggested Links ({suggestedItems.length})
            </h4>
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="text-xs text-ios-blue hover:underline"
            >
              {showSuggestions ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {showSuggestions && (
            <div className="space-y-2">
              {suggestedItems.map((suggestedItem) => (
                <div
                  key={suggestedItem.id}
                  className="p-3 border border-ios-gray-200 rounded-ios hover:bg-ios-gray-50 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      {getItemIcon(suggestedItem.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white truncate">
                          {suggestedItem.title}
                        </p>
                        <p className="text-xs text-gray-400 capitalize">
                          {suggestedItem.type}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddLink(suggestedItem)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-ios-green hover:bg-ios-green hover:bg-opacity-10 rounded transition-all"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
