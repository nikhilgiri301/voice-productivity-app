import React, { useState, useEffect } from 'react';
import { ProductivityItem, ItemType, VoiceCommand, ConfirmationCard } from '../types';
import { ItemCard } from './cards';
import { CalendarForm, TaskForm, NoteForm } from './forms';
import { VoiceInput } from './VoiceInput';
import { ConfirmationModal } from './confirmation/ConfirmationModal';
import { QueryResultModal } from './QueryResultModal';
import { LinkedItemsPanel } from './LinkedItemsPanel';
import { AdvancedSearch } from './AdvancedSearch';
import { LoadingSpinner, SkeletonList } from './LoadingSpinner';
import { NetworkStatus } from './NetworkStatus';
import { DatabaseService } from '../lib/supabase';
import { GeminiService } from '../lib/gemini';
import { LinkingService } from '../lib/linkingService';
import { Plus, Calendar, CheckSquare, FileText, Mic, Link, Search } from 'lucide-react';
import { format } from 'date-fns';
import { format } from 'date-fns';

interface DashboardProps {
  userId?: string;
}

type FormType = ItemType | null;

export const Dashboard: React.FC<DashboardProps> = ({ userId = '00000000-0000-0000-0000-000000000000' }) => {
  const [items, setItems] = useState<ProductivityItem[]>([]);
  const [todaysItems, setTodaysItems] = useState<ProductivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeForm, setActiveForm] = useState<FormType>(null);
  const [editingItem, setEditingItem] = useState<ProductivityItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [confirmationCards, setConfirmationCards] = useState<ConfirmationCard[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  const [voiceConfidence, setVoiceConfidence] = useState<number>(0);
  const [draftData, setDraftData] = useState<any>(null);
  const [operationLoading, setOperationLoading] = useState<string | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<{[key: string]: number}>({});
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(Date.now());
  const [refreshTimeouts, setRefreshTimeouts] = useState<NodeJS.Timeout[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState<boolean>(false);
  const [queryResults, setQueryResults] = useState<ProductivityItem[]>([]);
  const [showQueryResults, setShowQueryResults] = useState(false);
  const [lastQuery, setLastQuery] = useState('');
  const [selectedItemForLinks, setSelectedItemForLinks] = useState<ProductivityItem | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filteredItems, setFilteredItems] = useState<ProductivityItem[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Load items on component mount
  useEffect(() => {
    console.log('Dashboard mounted with userId:', userId);
    console.log('Browser compatibility check:', {
      userAgent: navigator.userAgent,
      speechRecognition: !!(window.SpeechRecognition || window.webkitSpeechRecognition),
      localStorage: !!window.localStorage,
      fetch: !!window.fetch
    });

    // Always load dummy data for visual testing
    console.log('Loading dummy data for visual testing...');
    addDummyData();

    // Also try to load from database
    loadItems();
    loadTodaysItems();

    // Set up real-time subscription with comprehensive debugging
    const subscription = DatabaseService.subscribeToItems(userId, (payload) => {
      console.log('🔄 Real-time update received:', payload);
      console.log('🔄 Event type:', payload.eventType);
      console.log('🔄 New record:', payload.new);
      console.log('🔄 Old record:', payload.old);

      // Multiple refresh strategies
      setTimeout(async () => {
        console.log('🔄 Strategy 1: Immediate refresh');
        await loadItems();
        await loadTodaysItems();
      }, 100);

      setTimeout(async () => {
        console.log('🔄 Strategy 2: Delayed refresh');
        await loadItems();
        await loadTodaysItems();
      }, 1000);

      setTimeout(async () => {
        console.log('🔄 Strategy 3: Final refresh');
        await loadItems();
        await loadTodaysItems();
      }, 2000);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  // Update filtered items when items change
  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  // Update today's items when selectedDate changes
  useEffect(() => {
    if (items.length > 0) {
      loadTodaysItems(selectedDate);
    }
  }, [selectedDate, items]);

  const clearPendingRefreshes = () => {
    refreshTimeouts.forEach(timeout => clearTimeout(timeout));
    setRefreshTimeouts([]);
  };

  const forceRefresh = async (reason: string = 'manual') => {
    console.log(`🔄 FORCE REFRESH triggered by: ${reason}`);
    setRefreshTrigger(prev => prev + 1);
    setLastRefreshTime(Date.now());

    try {
      await Promise.all([loadItems(), loadTodaysItems()]);
      console.log('✅ Force refresh completed successfully');
    } catch (error) {
      console.error('❌ Force refresh failed:', error);
    }
  };

  const debouncedRefresh = (reason: string, delay: number = 500) => {
    // Clear any pending refreshes to prevent multiple simultaneous refreshes
    clearPendingRefreshes();

    console.log(`🔄 DEBOUNCED REFRESH scheduled: ${reason} (${delay}ms)`);

    const timeout = setTimeout(async () => {
      await forceRefresh(reason);
      setRefreshTimeouts(prev => prev.filter(t => t !== timeout));
    }, delay);

    setRefreshTimeouts(prev => [...prev, timeout]);
  };

  const loadItems = async () => {
    console.log('📥 Loading items for user:', userId);
    const { data, error } = await DatabaseService.getItems(userId);
    console.log('📥 Database response:', { data, error, count: data?.length });
    if (data && !error) {
      setItems(data);
      setFilteredItems(data); // Also update filtered items
      console.log('✅ Items loaded successfully:', data.length, 'items');
    } else {
      console.error('❌ Error loading items:', error);
    }
    setLoading(false);
  };

  const loadTodaysItems = async (date: Date = selectedDate) => {
    console.log('📅 Loading items for date:', date.toDateString());

    // Filter items for the selected date
    const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dateEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

    const dateItems = items.filter(item => {
      if (item.type === 'calendar' && item.start_time) {
        const itemDate = new Date(item.start_time);
        return itemDate >= dateStart && itemDate < dateEnd;
      }
      if (item.type === 'task' && item.due_date) {
        const itemDate = new Date(item.due_date);
        return itemDate >= dateStart && itemDate < dateEnd;
      }
      return false;
    });

    setTodaysItems(dateItems);
    console.log('📅 Found', dateItems.length, 'items for', date.toDateString());
  };

  const handleDateNavigation = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
    loadTodaysItems(newDate);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
    loadTodaysItems(date);
  };

  const addDummyData = async () => {
    console.log('Adding dummy data for visual testing...');

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dummyItems = [
      // 2 Calendar Events/Meetings
      {
        id: 'meeting-1',
        type: 'calendar' as const,
        title: 'Team Weekly Standup',
        description: 'Weekly team sync to discuss progress and blockers',
        start_time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0).toISOString(),
        end_time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 30).toISOString(),
        location: 'Conference Room B',
        attendees: ['Alex', 'Jordan', 'Sam'],
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_via: 'manual' as const
      },
      {
        id: 'meeting-2',
        type: 'calendar' as const,
        title: 'Client Strategy Session',
        description: 'Quarterly planning meeting with key client stakeholders',
        start_time: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 14, 0).toISOString(),
        end_time: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 15, 30).toISOString(),
        location: 'Zoom Meeting Room',
        attendees: ['Client Lead', 'Project Manager'],
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_via: 'manual' as const
      },

      // 2 Tasks
      {
        id: 'task-1',
        type: 'task' as const,
        title: 'Complete project proposal',
        description: 'Finalize the Q1 project proposal document and send for review',
        due_date: today.toISOString(),
        priority: 'high' as const,
        completed: false,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_via: 'manual' as const
      },
      {
        id: 'task-2',
        type: 'task' as const,
        title: 'Schedule annual health checkup',
        description: 'Call doctor office to book routine physical examination',
        due_date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'medium' as const,
        completed: false,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_via: 'manual' as const
      },

      // 2 Notes
      {
        id: 'note-1',
        type: 'note' as const,
        title: 'Project Ideas Brainstorm',
        content: 'Innovative project concepts for next quarter:\n\n• AI-powered customer service chatbot\n• Mobile app for team collaboration\n• Automated reporting dashboard\n• User experience optimization study\n\nNext steps: Research feasibility and create detailed proposals',
        tags: ['projects', 'innovation', 'planning'],
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_via: 'manual' as const
      },
      {
        id: 'note-2',
        type: 'note' as const,
        title: 'Learning Goals 2024',
        content: 'Professional development objectives:\n\n1. Master advanced data analysis techniques\n2. Complete cloud architecture certification\n3. Improve public speaking skills\n4. Learn a new programming language (Python or Go)\n\nResources: Online courses, workshops, mentorship program',
        tags: ['learning', 'goals', 'career-development'],
        user_id: userId,
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
        updated_at: new Date().toISOString(),
        created_via: 'manual' as const
      }
    ];

    // Add dummy items to local state immediately for visual testing
    console.log('Setting dummy items:', dummyItems.length);
    setItems(dummyItems);
    setFilteredItems(dummyItems); // Also set filtered items!

    // Filter today's items
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const todayItems = dummyItems.filter(item => {
      if (item.type === 'calendar' && item.start_time) {
        const itemDate = new Date(item.start_time);
        return itemDate >= todayStart && itemDate < todayEnd;
      }
      if (item.type === 'task' && item.due_date) {
        const itemDate = new Date(item.due_date);
        return itemDate >= todayStart && itemDate < todayEnd;
      }
      return false;
    });

    setTodaysItems(todayItems);
    console.log('Dummy data added:', dummyItems.length, 'total items,', todayItems.length, 'today items');
  };

  const handleSaveDraft = () => {
    // Save current form data as draft to localStorage
    if (draftData) {
      const drafts = JSON.parse(localStorage.getItem('organizer_drafts') || '{}');
      drafts[activeForm || 'unknown'] = draftData;
      localStorage.setItem('organizer_drafts', JSON.stringify(drafts));
      console.log('Draft saved:', draftData);
    }
  };

  const handleCreateItem = async (type: ItemType, formData: any) => {
    const startTime = performance.now();
    setIsSubmitting(true);
    setOperationLoading(`Creating ${type}...`);

    const newItem: Omit<ProductivityItem, 'id' | 'created_at' | 'updated_at'> = {
      type,
      title: formData.title,
      description: formData.description || undefined,
      user_id: userId,
      created_via: 'manual',

      // Type-specific fields
      ...(type === 'calendar' && {
        start_time: formData.start_time,
        end_time: formData.end_time,
        location: formData.location || undefined,
        attendees: formData.attendees ? formData.attendees.split(',').map((a: string) => a.trim()) : undefined,
      }),

      ...(type === 'task' && {
        due_date: formData.due_date || undefined,
        priority: formData.priority,
        completed: false,
      }),

      ...(type === 'note' && {
        content: formData.content,
        tags: formData.tags ? formData.tags.split(',').map((t: string) => t.trim()) : undefined,
      }),
    };

    const { data, error } = await DatabaseService.createItem(newItem);

    if (data && !error) {
      console.log('✅ Item created successfully:', data);

      // Clear draft after successful creation
      const drafts = JSON.parse(localStorage.getItem('organizer_drafts') || '{}');
      delete drafts[type];
      localStorage.setItem('organizer_drafts', JSON.stringify(drafts));

      // Create the item object with proper ID from database
      const createdItem = {
        ...newItem,
        id: data.id || data[0]?.id || Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Force immediate UI update
      setItems(prev => {
        const updated = [...prev, createdItem];
        console.log('📝 Updated items state:', updated.length, 'items');
        return updated;
      });

      setFilteredItems(prev => {
        const updated = [...prev, createdItem];
        console.log('🔍 Updated filtered items:', updated.length, 'items');
        return updated;
      });

      // Also update today's items if applicable
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      let shouldAddToToday = false;
      if (type === 'calendar' && newItem.start_time) {
        const itemDate = new Date(newItem.start_time);
        shouldAddToToday = itemDate >= todayStart && itemDate < todayEnd;
      } else if (type === 'task' && newItem.due_date) {
        const itemDate = new Date(newItem.due_date);
        shouldAddToToday = itemDate >= todayStart && itemDate < todayEnd;
      }

      if (shouldAddToToday) {
        setTodaysItems(prev => {
          const updated = [...prev, createdItem];
          console.log('📅 Updated today\'s items:', updated.length, 'items');
          return updated;
        });
      }

      setActiveForm(null);
      setDraftData(null);

      // Optimized refresh strategy - single debounced refresh
      console.log('🔄 OPTIMIZED refresh for ADD operation...');
      debouncedRefresh('create-operation', 300);

    } else {
      console.error('❌ Error creating item:', error);
      alert('Error creating item: ' + error);
    }

    // Performance tracking
    const endTime = performance.now();
    const duration = endTime - startTime;
    setPerformanceMetrics(prev => ({
      ...prev,
      [`create_${type}`]: duration
    }));
    console.log(`⏱️ Create ${type} took ${duration.toFixed(2)}ms`);

    setIsSubmitting(false);
    setOperationLoading(null);
  };

  const handleUpdateItem = async (formData: any) => {
    if (!editingItem) return;

    const startTime = performance.now();
    setIsSubmitting(true);
    setOperationLoading(`Updating ${editingItem.type}...`);

    const updates: Partial<ProductivityItem> = {
      title: formData.title,
      description: formData.description || undefined,

      // Type-specific updates
      ...(editingItem.type === 'calendar' && {
        start_time: formData.start_time,
        end_time: formData.end_time,
        location: formData.location || undefined,
        attendees: formData.attendees ? formData.attendees.split(',').map((a: string) => a.trim()) : undefined,
      }),

      ...(editingItem.type === 'task' && {
        due_date: formData.due_date || undefined,
        priority: formData.priority,
      }),

      ...(editingItem.type === 'note' && {
        content: formData.content,
        tags: formData.tags ? formData.tags.split(',').map((t: string) => t.trim()) : undefined,
      }),
    };

    // Optimistic update - update UI immediately
    const updatedItem = { ...editingItem, ...updates, updated_at: new Date().toISOString() };
    setItems(prev => prev.map(item => item.id === editingItem.id ? updatedItem : item));
    setFilteredItems(prev => prev.map(item => item.id === editingItem.id ? updatedItem : item));
    setTodaysItems(prev => prev.map(item => item.id === editingItem.id ? updatedItem : item));

    const { data, error } = await DatabaseService.updateItem(editingItem.id, updates);

    if (data && !error) {
      console.log('✅ Item updated successfully:', data);

      setEditingItem(null);
      setActiveForm(null);

      // Optimized refresh strategy - single debounced refresh
      console.log('🔄 OPTIMIZED refresh for EDIT operation...');
      debouncedRefresh('edit-operation', 300);

    } else {
      console.error('❌ Error updating item:', error);
      alert('Error updating item: ' + error);
      // Revert optimistic update on error
      setItems(prev => prev.map(item => item.id === editingItem.id ? editingItem : item));
      setFilteredItems(prev => prev.map(item => item.id === editingItem.id ? editingItem : item));
      setTodaysItems(prev => prev.map(item => item.id === editingItem.id ? editingItem : item));
    }

    // Performance tracking
    const endTime = performance.now();
    const duration = endTime - startTime;
    setPerformanceMetrics(prev => ({
      ...prev,
      [`update_${editingItem.type}`]: duration
    }));
    console.log(`⏱️ Update ${editingItem.type} took ${duration.toFixed(2)}ms`);

    setIsSubmitting(false);
    setOperationLoading(null);
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const startTime = performance.now();
    setOperationLoading('Deleting item...');

    // Update UI immediately for instant feedback
    setItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      console.log('🗑️ Deleted item from items state:', updated.length, 'remaining');
      return updated;
    });

    setFilteredItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      console.log('🗑️ Deleted item from filtered items:', updated.length, 'remaining');
      return updated;
    });

    setTodaysItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      console.log('🗑️ Deleted item from today\'s items:', updated.length, 'remaining');
      return updated;
    });

    const { data, error } = await DatabaseService.deleteItem(id);

    if (error) {
      console.error('❌ Error deleting item:', error);
      alert('Error deleting item: ' + error);
      // Reload items to revert the optimistic update
      loadItems();
      loadTodaysItems();
    } else {
      console.log('✅ Item deleted successfully');
      // Force refresh to ensure UI is updated
      setTimeout(async () => {
        console.log('🔄 Force refreshing after delete...');
        await loadItems();
        await loadTodaysItems();
      }, 300);
    }

    // Performance tracking
    const endTime = performance.now();
    const duration = endTime - startTime;
    setPerformanceMetrics(prev => ({
      ...prev,
      delete_item: duration
    }));
    console.log(`⏱️ Delete item took ${duration.toFixed(2)}ms`);

    setOperationLoading(null);
  };

  const handleToggleComplete = async (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item || item.type !== 'task') return;

    // Update local state immediately for instant UI feedback
    const updatedItem = { ...item, completed: !item.completed };
    setItems(prev => prev.map(i => i.id === id ? updatedItem : i));
    setFilteredItems(prev => prev.map(i => i.id === id ? updatedItem : i));
    setTodaysItems(prev => prev.map(i => i.id === id ? updatedItem : i));

    const { data, error } = await DatabaseService.updateItem(id, {
      completed: !item.completed
    });

    if (error) {
      console.error('Error toggling task completion:', error);
      alert('Error updating task: ' + error);
      // Revert local state on error
      setItems(prev => prev.map(i => i.id === id ? item : i));
      setFilteredItems(prev => prev.map(i => i.id === id ? item : i));
      setTodaysItems(prev => prev.map(i => i.id === id ? item : i));
    }
  };

  const handleEditItem = (item: ProductivityItem) => {
    setEditingItem(item);
    setActiveForm(item.type);
  };

  const handleCancelForm = () => {
    setActiveForm(null);
    setEditingItem(null);
  };

  const handleVoiceCommand = async (command: VoiceCommand) => {
    console.log('Voice command received:', command);
    setShowVoiceInput(false);

    // Show processing state immediately
    setIsProcessingVoice(true);

    // Store transcript and confidence for display in confirmation modal
    setVoiceTranscript(command.transcript);
    setVoiceConfidence(command.confidence);

    try {
      console.log('🤖 Starting AI processing...');
      const startTime = performance.now();

      // Process the voice command with Gemini AI
      const result = await GeminiService.processVoiceCommand(
        command.transcript,
        command.confidence,
        items
      );

      const endTime = performance.now();
      console.log(`🤖 AI processing completed in ${(endTime - startTime).toFixed(2)}ms`);

      if (result.error) {
        alert(`Error processing voice command: ${result.error}`);
        return;
      }

      console.log('AI processing result:', result);

      // Handle different operation types
      if (result.operation === 'query') {
        // For query operations, search existing items and show results
        const searchResults = await searchItems(result.items[0]?.title || command.transcript);
        setQueryResults(searchResults);
        setLastQuery(command.transcript);
        setShowQueryResults(true);
      } else if (result.operation === 'edit') {
        // For edit operations, show confirmation cards like creates
        await handleEditOperations(result.items);
      } else if (result.operation === 'delete') {
        // For delete operations, show confirmation cards like creates
        await handleDeleteOperations(result.items);
      } else {
        // For create operations, show confirmation cards
        const cards: ConfirmationCard[] = result.items.map((item, index) => ({
          id: `card-${Date.now()}-${index}`,
          type: result.operation as any,
          item: {
            ...item,
            user_id: userId,
            created_via: 'voice',
            ai_confidence: result.confidence
          },
          approved: false,
          rejected: false
        }));

        setConfirmationCards(cards);
        setShowConfirmation(true);
      }

    } catch (error) {
      console.error('❌ Error processing voice command:', error);
      alert('Error processing voice command. Please try again.');
    } finally {
      // Always hide processing state
      setIsProcessingVoice(false);
    }
  };

  const handleApproveCard = async (cardId: string) => {
    const card = confirmationCards.find(c => c.id === cardId);
    if (!card) return;

    try {
      if (card.type === 'create') {
        // Handle create operations
        await handleCreateApproval(card);
      } else if (card.type === 'edit') {
        // Handle edit operations
        await handleEditApproval(card);
      } else if (card.type === 'delete') {
        // Handle delete operations
        await handleDeleteApproval(card);
      }
    } catch (error) {
      console.error('Error approving card:', error);
      alert('Error processing request. Please try again.');
    }
  };

  const handleCreateApproval = async (card: ConfirmationCard) => {
    // Create the item in the database
      const newItem: Omit<ProductivityItem, 'id' | 'created_at' | 'updated_at'> = {
        type: card.item.type!,
        title: card.item.title!,
        description: card.item.description,
        user_id: userId,
        created_via: 'voice',
        ai_confidence: card.item.ai_confidence,

        // Type-specific fields
        ...(card.item.type === 'calendar' && {
          start_time: card.item.start_time,
          end_time: card.item.end_time,
          location: card.item.location,
          attendees: card.item.attendees,
        }),

        ...(card.item.type === 'task' && {
          due_date: card.item.due_date,
          priority: card.item.priority,
          completed: false,
        }),

        ...(card.item.type === 'note' && {
          content: card.item.content || card.item.description || card.item.title || 'Voice note content',
          tags: card.item.tags,
        }),
      };

      const { data, error } = await DatabaseService.createItem(newItem);

      if (data && !error) {
        console.log('✅ Voice item created successfully:', data);

        // Mark card as approved
        setConfirmationCards(prev => {
          const updatedCards = prev.map(c => c.id === cardId ? { ...c, approved: true } : c);

          // Check if this was the last pending card
          const pendingCards = updatedCards.filter(c => !c.approved && !c.rejected);

          if (pendingCards.length === 0) {
            // Auto-close modal if no more pending cards
            console.log('🔄 Auto-closing confirmation modal - all cards processed');
            setTimeout(() => {
              setShowConfirmation(false);
              setConfirmationCards([]);
            }, 1000); // Small delay to show the success state
          }

          return updatedCards;
        });

        // AGGRESSIVE refresh strategy for voice operations
        console.log('🔄 AGGRESSIVE refresh for VOICE operation...');

        // Update local state immediately for instant UI update
        const createdItem = {
          ...newItem,
          id: data.id || data[0]?.id || Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        setItems(prev => [...prev, createdItem]);
        setFilteredItems(prev => [...prev, createdItem]);

        // Also update today's items if applicable
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        let shouldAddToToday = false;
        if (newItem.type === 'calendar' && newItem.start_time) {
          const itemDate = new Date(newItem.start_time);
          shouldAddToToday = itemDate >= todayStart && itemDate < todayEnd;
        } else if (newItem.type === 'task' && newItem.due_date) {
          const itemDate = new Date(newItem.due_date);
          shouldAddToToday = itemDate >= todayStart && itemDate < todayEnd;
        }

        if (shouldAddToToday) {
          setTodaysItems(prev => [...prev, createdItem]);
        }

        // Optimized refresh strategy - single debounced refresh
        console.log('🔄 OPTIMIZED refresh for VOICE operation...');
        debouncedRefresh('voice-operation', 300);

        // Auto-detect and suggest links for the new item
        const suggestions = LinkingService.detectRelationships(data, items);
        if (suggestions.length > 0) {
          // Auto-link if confidence is high, otherwise just suggest
          for (const suggestionId of suggestions.slice(0, 2)) { // Limit to 2 auto-links
            await LinkingService.createLink(data.id, suggestionId);
          }
        }
      } else {
        console.error('❌ Error creating voice item:', error);
        alert('Error creating item: ' + error);
      }
  };

  const handleEditApproval = async (card: ConfirmationCard) => {
    if (!card.originalItem) return;

    console.log('✏️ Approving edit for:', card.originalItem.title);

    // Extract updates from the card
    const updates: Partial<ProductivityItem> = {
      title: card.item.title,
      description: card.item.description || undefined,

      // Type-specific updates
      ...(card.item.type === 'calendar' && {
        start_time: card.item.start_time,
        end_time: card.item.end_time,
        location: card.item.location || undefined,
        attendees: card.item.attendees,
      }),

      ...(card.item.type === 'task' && {
        due_date: card.item.due_date || undefined,
        priority: card.item.priority,
        completed: card.item.completed,
      }),

      ...(card.item.type === 'note' && {
        content: card.item.content || card.item.description || card.item.title || 'Voice note content',
        tags: card.item.tags,
      }),
    };

    const { data, error } = await DatabaseService.updateItem(card.originalItem.id, updates);

    if (data && !error) {
      console.log('✅ Item updated successfully via voice:', data);

      // Mark card as approved
      setConfirmationCards(prev => {
        const updatedCards = prev.map(c => c.id === card.id ? { ...c, approved: true } : c);

        // Check if this was the last pending card
        const pendingCards = updatedCards.filter(c => !c.approved && !c.rejected);

        if (pendingCards.length === 0) {
          // Auto-close modal if no more pending cards
          console.log('🔄 Auto-closing confirmation modal - all edit cards processed');
          setTimeout(() => {
            setShowConfirmation(false);
            setConfirmationCards([]);
          }, 1000);
        }

        return updatedCards;
      });

      // Optimized refresh
      debouncedRefresh('voice-edit-operation', 300);
    } else {
      console.error('❌ Error updating voice item:', error);
      alert('Error updating item: ' + error);
    }
  };

  const handleDeleteApproval = async (card: ConfirmationCard) => {
    if (!card.originalItem) return;

    console.log('🗑️ Approving delete for:', card.originalItem.title);

    const { data, error } = await DatabaseService.deleteItem(card.originalItem.id);

    if (data && !error) {
      console.log('✅ Item deleted successfully via voice:', card.originalItem.title);

      // Mark card as approved
      setConfirmationCards(prev => {
        const updatedCards = prev.map(c => c.id === card.id ? { ...c, approved: true } : c);

        // Check if this was the last pending card
        const pendingCards = updatedCards.filter(c => !c.approved && !c.rejected);

        if (pendingCards.length === 0) {
          // Auto-close modal if no more pending cards
          console.log('🔄 Auto-closing confirmation modal - all delete cards processed');
          setTimeout(() => {
            setShowConfirmation(false);
            setConfirmationCards([]);
          }, 1000);
        }

        return updatedCards;
      });

      // Optimized refresh
      debouncedRefresh('voice-delete-operation', 300);
    } else {
      console.error('❌ Error deleting voice item:', error);
      alert('Error deleting item: ' + error);
    }
  };

  const handleRejectCard = (cardId: string) => {
    setConfirmationCards(prev =>
      prev.map(c => c.id === cardId ? { ...c, rejected: true } : c)
    );
  };

  const handleEditCard = (cardId: string, updatedItem: Partial<ConfirmationCard['item']>) => {
    setConfirmationCards(prev =>
      prev.map(c => c.id === cardId ? { ...c, item: { ...c.item, ...updatedItem } } : c)
    );
  };

  const handleApproveAll = async () => {
    const pendingCards = confirmationCards.filter(c => !c.approved && !c.rejected);
    const createdItems: ProductivityItem[] = [];

    // Create all items first
    for (const card of pendingCards) {
      const newItem: Omit<ProductivityItem, 'id' | 'created_at' | 'updated_at'> = {
        type: card.item.type!,
        title: card.item.title!,
        description: card.item.description,
        user_id: userId,
        created_via: 'voice',
        ai_confidence: card.item.ai_confidence,

        // Type-specific fields
        ...(card.item.type === 'calendar' && {
          start_time: card.item.start_time,
          end_time: card.item.end_time,
          location: card.item.location,
          attendees: card.item.attendees,
        }),

        ...(card.item.type === 'task' && {
          due_date: card.item.due_date,
          priority: card.item.priority,
          completed: false,
        }),

        ...(card.item.type === 'note' && {
          content: card.item.content || card.item.description || card.item.title || 'Voice note content',
          tags: card.item.tags,
        }),
      };

      const { data, error } = await DatabaseService.createItem(newItem);

      if (data && !error) {
        createdItems.push(data);
        // Mark card as approved
        setConfirmationCards(prev =>
          prev.map(c => c.id === card.id ? { ...c, approved: true } : c)
        );
      }
    }

    // If multiple items were created from the same voice command, link them
    if (createdItems.length > 1) {
      await LinkingService.autoLinkVoiceItems(createdItems);
    }

    // Auto-close modal after approve all
    console.log('🔄 Auto-closing confirmation modal - approve all completed');
    setTimeout(() => {
      setShowConfirmation(false);
      setConfirmationCards([]);
    }, 1000);
  };

  const handleRejectAll = () => {
    setConfirmationCards(prev =>
      prev.map(c => c.approved ? c : { ...c, rejected: true })
    );
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setConfirmationCards([]);
  };

  const searchItems = async (query: string): Promise<ProductivityItem[]> => {
    if (!query.trim()) return [];

    console.log('🔍 Searching for:', query);

    const searchTerms = query.toLowerCase()
      .split(' ')
      .filter(term => term.length > 1) // Filter out single characters
      .filter(term => !['the', 'and', 'or', 'a', 'an', 'to', 'for', 'with', 'my', 'i', 'me'].includes(term)); // Filter common words

    console.log('🔍 Search terms:', searchTerms);

    const results = items.map(item => {
      // Create searchable text for each item
      const searchableFields = {
        title: item.title || '',
        description: item.description || '',
        content: item.content || '',
        location: item.location || '',
        tags: (item.tags || []).join(' '),
        attendees: (item.attendees || []).join(' ')
      };

      const allText = Object.values(searchableFields).join(' ').toLowerCase();

      let score = 0;
      let matchedTerms = 0;

      // Score each search term
      for (const term of searchTerms) {
        let termScore = 0;

        // Exact title match (highest priority)
        if (searchableFields.title.toLowerCase().includes(term)) {
          termScore += 10;
          if (searchableFields.title.toLowerCase() === term) {
            termScore += 20; // Exact title match
          }
        }

        // Description match
        if (searchableFields.description.toLowerCase().includes(term)) {
          termScore += 5;
        }

        // Content match
        if (searchableFields.content.toLowerCase().includes(term)) {
          termScore += 3;
        }

        // Location match
        if (searchableFields.location.toLowerCase().includes(term)) {
          termScore += 7;
        }

        // Tags match
        if (searchableFields.tags.toLowerCase().includes(term)) {
          termScore += 8;
        }

        // Attendees match
        if (searchableFields.attendees.toLowerCase().includes(term)) {
          termScore += 6;
        }

        if (termScore > 0) {
          matchedTerms++;
          score += termScore;
        }
      }

      // Boost score if multiple terms match
      if (matchedTerms > 1) {
        score *= (1 + (matchedTerms - 1) * 0.5);
      }

      // Boost score for recent items
      const daysSinceCreated = (Date.now() - new Date(item.created_at).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceCreated < 7) {
        score *= 1.2;
      }

      return { item, score, matchedTerms };
    })
    .filter(result => result.score > 0) // Only include items with matches
    .sort((a, b) => b.score - a.score) // Sort by relevance score
    .map(result => {
      console.log(`🔍 Match: "${result.item.title}" (score: ${result.score.toFixed(1)}, terms: ${result.matchedTerms})`);
      return result.item;
    });

    console.log(`🔍 Found ${results.length} results`);
    return results;
  };

  const handleEditOperations = async (editItems: any[]) => {
    // For edit operations, try to find matching existing items
    for (const editItem of editItems) {
      let matchingItems: ProductivityItem[] = [];

      // Handle bulk edit patterns
      if (editItem.title?.toLowerCase().includes('all')) {
        if (editItem.title.toLowerCase().includes('overdue')) {
          const now = new Date();
          matchingItems = items.filter(item =>
            item.type === 'task' &&
            item.due_date &&
            new Date(item.due_date) < now &&
            !item.completed
          );
        } else if (editItem.title.toLowerCase().includes('task')) {
          matchingItems = items.filter(item => item.type === 'task');
        } else if (editItem.title.toLowerCase().includes('today')) {
          matchingItems = todaysItems;
        }
      } else {
        matchingItems = await searchItems(editItem.title || '');
      }

      if (matchingItems.length === 0) {
        alert(`No items found matching "${editItem.title}".`);
        continue;
      }

      // Create confirmation cards for each matching item
      for (const matchingItem of matchingItems) {
        const editCard: ConfirmationCard = {
          id: `edit-${Date.now()}-${matchingItem.id}`,
          type: 'edit',
          item: {
            ...editItem,
            id: matchingItem.id,
            type: matchingItem.type,
            user_id: userId,
            created_via: 'voice'
          },
          originalItem: matchingItem,
          approved: false,
          rejected: false
        };

        setConfirmationCards(prev => [...prev, editCard]);
      }

      console.log(`🔧 Created edit confirmation cards for ${matchingItems.length} items`);
    }

    // Show confirmation modal if we have cards
    if (confirmationCards.length > 0) {
      setShowConfirmation(true);
    }
  };

  const handleDeleteOperations = async (deleteItems: any[]) => {
    console.log('🗑️ Processing delete operations:', deleteItems);

    const deleteCards: ConfirmationCard[] = [];
    let allMatchingItems: ProductivityItem[] = [];

    for (const deleteItem of deleteItems) {
      let matchingItems: ProductivityItem[] = [];

      // Handle bulk delete patterns
      if (deleteItem.title?.toLowerCase().includes('all')) {
        if (deleteItem.title.toLowerCase().includes('today')) {
          matchingItems = todaysItems;
        } else if (deleteItem.title.toLowerCase().includes('meeting')) {
          matchingItems = items.filter(item =>
            item.type === 'calendar' &&
            item.title.toLowerCase().includes('meeting')
          );
        } else if (deleteItem.title.toLowerCase().includes('task')) {
          matchingItems = items.filter(item => item.type === 'task');
        } else if (deleteItem.title.toLowerCase().includes('note')) {
          matchingItems = items.filter(item => item.type === 'note');
        }
      } else {
        matchingItems = await searchItems(deleteItem.title || '');
      }

      console.log(`🗑️ Found ${matchingItems.length} items matching "${deleteItem.title}"`);
      allMatchingItems = [...allMatchingItems, ...matchingItems];
    }

    // Remove duplicates
    const uniqueItems = allMatchingItems.filter((item, index, self) =>
      index === self.findIndex(i => i.id === item.id)
    );

    if (uniqueItems.length === 0) {
      alert('No items found matching your criteria.');
      return;
    }

    // Create confirmation cards for each item to delete
    for (const item of uniqueItems) {
      const deleteCard: ConfirmationCard = {
        id: `delete-${Date.now()}-${item.id}`,
        type: 'delete',
        item: {
          ...item,
          created_via: 'voice'
        },
        originalItem: item,
        approved: false,
        rejected: false
      };

      deleteCards.push(deleteCard);
    }

    console.log(`🗑️ Created ${deleteCards.length} delete confirmation cards`);
    setConfirmationCards(deleteCards);
    setShowConfirmation(true);
  };

  const getFormInitialData = () => {
    if (!editingItem) return {};
    
    switch (editingItem.type) {
      case 'calendar':
        return {
          title: editingItem.title,
          description: editingItem.description,
          start_time: editingItem.start_time,
          end_time: editingItem.end_time,
          location: editingItem.location,
          attendees: editingItem.attendees?.join(', '),
        };
      case 'task':
        return {
          title: editingItem.title,
          description: editingItem.description,
          due_date: editingItem.due_date,
          priority: editingItem.priority,
        };
      case 'note':
        return {
          title: editingItem.title,
          content: editingItem.content,
          tags: editingItem.tags?.join(', '),
        };
      default:
        return {};
    }
  };

  const renderForm = () => {
    const initialData = getFormInitialData();
    
    switch (activeForm) {
      case 'calendar':
        return (
          <CalendarForm
            onSubmit={(data) => editingItem ? handleUpdateItem(data) : handleCreateItem('calendar', data)}
            onCancel={handleCancelForm}
            initialData={initialData}
            isLoading={isSubmitting}
          />
        );
      case 'task':
        return (
          <TaskForm
            onSubmit={(data) => editingItem ? handleUpdateItem(data) : handleCreateItem('task', data)}
            onCancel={handleCancelForm}
            initialData={initialData}
            isLoading={isSubmitting}
          />
        );
      case 'note':
        return (
          <NoteForm
            onSubmit={(data) => editingItem ? handleUpdateItem(data) : handleCreateItem('note', data)}
            onCancel={handleCancelForm}
            initialData={initialData}
            isLoading={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 dark">
        <NetworkStatus />
        <LoadingSpinner
          fullScreen
          text="Loading your organizer..."
          size="lg"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 dark">
      <NetworkStatus />
      {/* Header */}
      <div className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Personal Organizer</h1>
              <p className="text-gray-300 mt-1">
                {format(new Date(), 'EEEE, MMMM d, yyyy')}
              </p>
              <p className="text-xs text-gray-500">
                Last refresh: {new Date(lastRefreshTime).toLocaleTimeString()} | Items: {items.length}
              </p>
            </div>
            
            {/* Quick Add Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => forceRefresh('manual-button')}
                className="p-2 text-yellow-400 hover:bg-yellow-400 hover:bg-opacity-10 rounded-ios transition-colors"
                title="Force Refresh Data"
              >
                🔄
              </button>
              <button
                onClick={() => setShowAdvancedSearch(true)}
                className="p-2 text-ios-gray-600 hover:bg-ios-gray-100 rounded-ios transition-colors"
                title="Advanced Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveForm('calendar')}
                className="p-2 text-ios-blue hover:bg-ios-blue hover:bg-opacity-10 rounded-ios transition-colors"
                title="Add Calendar Event"
              >
                <Calendar className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveForm('task')}
                className="p-2 text-ios-green hover:bg-ios-green hover:bg-opacity-10 rounded-ios transition-colors"
                title="Add Task"
              >
                <CheckSquare className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveForm('note')}
                className="p-2 text-ios-purple hover:bg-ios-purple hover:bg-opacity-10 rounded-ios transition-colors"
                title="Add Note"
              >
                <FileText className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Form Modal */}
        {activeForm && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                // Save as draft before closing
                handleSaveDraft();
                setActiveForm(null);
              }
            }}
          >
            <div className="w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto">
              {renderForm()}
            </div>
          </div>
        )}

        {/* Voice Input Modal */}
        <VoiceInput
          isOpen={showVoiceInput}
          onClose={() => setShowVoiceInput(false)}
          onVoiceCommand={handleVoiceCommand}
        />

        {/* Confirmation Modal */}
        <ConfirmationModal
          cards={confirmationCards}
          isOpen={showConfirmation}
          onClose={handleCloseConfirmation}
          onApprove={handleApproveCard}
          onReject={handleRejectCard}
          onEdit={handleEditCard}
          onApproveAll={handleApproveAll}
          onRejectAll={handleRejectAll}
          transcript={voiceTranscript}
          confidence={voiceConfidence}
        />

        {/* Query Results Modal */}
        <QueryResultModal
          isOpen={showQueryResults}
          onClose={() => setShowQueryResults(false)}
          query={lastQuery}
          results={queryResults}
          onEditItem={handleEditItem}
          onDeleteItem={handleDeleteItem}
          onToggleComplete={handleToggleComplete}
        />

        {/* Search Results Section (only show when search is active) */}
        {isSearchActive && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                Search Results ({filteredItems.length} items found)
              </h2>
              <button
                onClick={() => {
                  setIsSearchActive(false);
                  setFilteredItems(items);
                }}
                className="text-sm text-ios-blue hover:underline"
              >
                Clear Search
              </button>
            </div>
            {filteredItems.length > 0 ? (
              <div className="space-y-3">
                {filteredItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                    onToggleComplete={handleToggleComplete}
                    onShowLinks={(item) => setSelectedItemForLinks(item)}
                  />
                ))}
              </div>
            ) : (
              <div className="ios-card p-6 text-center">
                <p className="text-gray-300">No items match your search criteria</p>
                <button
                  onClick={() => {
                    setIsSearchActive(false);
                    setFilteredItems(items);
                  }}
                  className="text-ios-blue hover:underline text-sm mt-2"
                >
                  Show all items
                </button>
              </div>
            )}
          </div>
        )}

        {/* Only show regular sections when search is NOT active */}
        {!isSearchActive && (
          <>
            {/* Section 1: Schedule with Date Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              Schedule
            </h2>

            {/* Date Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDateNavigation('prev')}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-ios transition-colors"
                title="Previous Day"
              >
                ←
              </button>

              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="px-4 py-2 text-white bg-gray-700 hover:bg-gray-600 rounded-ios transition-colors relative"
                title="Select Date"
              >
                {format(selectedDate, 'EEEE, MMMM d')}
                {showDatePicker && (
                  <div className="absolute top-full right-0 mt-2 p-4 bg-gray-800 border border-gray-600 rounded-ios shadow-lg z-50">
                    <input
                      type="date"
                      value={format(selectedDate, 'yyyy-MM-dd')}
                      onChange={(e) => handleDateSelect(new Date(e.target.value))}
                      className="ios-input text-sm"
                    />
                  </div>
                )}
              </button>

              <button
                onClick={() => handleDateNavigation('next')}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-ios transition-colors"
                title="Next Day"
              >
                →
              </button>
            </div>
          </div>
          {todaysItems.filter(item => item.type === 'calendar').length > 0 ? (
            <div className="space-y-3">
              {todaysItems
                .filter(item => item.type === 'calendar')
                .sort((a, b) => {
                  // Sort by start_time chronologically
                  if (!a.start_time && !b.start_time) return 0;
                  if (!a.start_time) return 1;
                  if (!b.start_time) return -1;
                  return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
                })
                .map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                    onToggleComplete={handleToggleComplete}
                    onShowLinks={(item) => setSelectedItemForLinks(item)}
                  />
                ))}
            </div>
          ) : (
            <div className="ios-card p-6 text-center">
              <p className="text-gray-300">No meetings scheduled for today</p>
              <button
                onClick={() => setActiveForm('calendar')}
                className="text-ios-blue hover:underline text-sm mt-2"
              >
                Add a meeting
              </button>
            </div>
          )}
        </div>

        {/* Section 2: Tasks/To-dos */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              Tasks & To-dos ({items.filter(item => item.type === 'task').length})
            </h2>
          </div>
          {items.filter(item => item.type === 'task').length > 0 ? (
            <div className="space-y-3">
              {items
                .filter(item => item.type === 'task')
                .sort((a, b) => {
                  // Smart sorting: due_date first, then priority
                  const priorityOrder = { high: 3, medium: 2, low: 1 };

                  // Group 1: Tasks with due dates (sort by due date, then priority)
                  // Group 2: Tasks without due dates (sort by priority only)

                  const aHasDueDate = !!a.due_date;
                  const bHasDueDate = !!b.due_date;

                  // If one has due date and other doesn't, prioritize the one with due date
                  if (aHasDueDate && !bHasDueDate) return -1;
                  if (!aHasDueDate && bHasDueDate) return 1;

                  // Both have due dates: sort by due date first, then priority
                  if (aHasDueDate && bHasDueDate) {
                    const dateComparison = new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime();
                    if (dateComparison !== 0) return dateComparison;

                    // Same due date: sort by priority
                    const aPriority = priorityOrder[a.priority || 'medium'];
                    const bPriority = priorityOrder[b.priority || 'medium'];
                    return bPriority - aPriority;
                  }

                  // Neither has due date: sort by priority only
                  const aPriority = priorityOrder[a.priority || 'medium'];
                  const bPriority = priorityOrder[b.priority || 'medium'];
                  return bPriority - aPriority;
                })
                .map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                    onToggleComplete={handleToggleComplete}
                    onShowLinks={(item) => setSelectedItemForLinks(item)}
                  />
                ))}
            </div>
          ) : (
            <div className="ios-card p-6 text-center">
              <p className="text-gray-300">No tasks created yet</p>
              <button
                onClick={() => setActiveForm('task')}
                className="text-ios-blue hover:underline text-sm mt-2"
              >
                Add a task
              </button>
            </div>
          )}
        </div>

        {/* Section 3: Notes */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              Notes ({items.filter(item => item.type === 'note').length})
            </h2>
          </div>
          {items.filter(item => item.type === 'note').length > 0 ? (
            <div className="space-y-3">
              {items
                .filter(item => item.type === 'note')
                .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
                .map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                    onToggleComplete={handleToggleComplete}
                    onShowLinks={(item) => setSelectedItemForLinks(item)}
                  />
                ))}
            </div>
          ) : (
            <div className="ios-card p-6 text-center">
              <p className="text-gray-300">No notes created yet</p>
              <button
                onClick={() => setActiveForm('note')}
                className="text-ios-blue hover:underline text-sm mt-2"
              >
                Add a note
              </button>
            </div>
          )}
        </div>

        {/* Quick Add Section (only show if no items exist) */}
        {items.length === 0 && (
          <div className="ios-card p-8 text-center">
            <div className="mb-4">
              <Plus className="w-12 h-12 text-ios-gray-300 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              Welcome to your Personal Organizer
            </h3>
            <p className="text-gray-300 mb-4">
              Start by creating your first calendar event, task, or note
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setActiveForm('calendar')}
                className="ios-button"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Add Event
              </button>
              <button
                onClick={() => setActiveForm('task')}
                className="ios-button"
              >
                <CheckSquare className="w-4 h-4 mr-2" />
                Add Task
              </button>
              <button
                onClick={() => setActiveForm('note')}
                className="ios-button"
              >
                <FileText className="w-4 h-4 mr-2" />
                Add Note
              </button>
            </div>
          </div>
        )}
          </>
        )}
      </div>

      {/* Loading Overlay */}
      {operationLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-ios p-6 flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-ios-blue"></div>
            <span className="text-white font-medium">{operationLoading}</span>
          </div>
        </div>
      )}

      {/* Voice Processing Overlay */}
      {isProcessingVoice && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-ios p-8 max-w-md mx-4 text-center border border-gray-600">
            <div className="mb-4">
              <div className="animate-pulse">
                <div className="w-16 h-16 bg-ios-blue bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  🤖
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Processing Your Voice Command
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                AI is analyzing your request and preparing suggestions...
              </p>
            </div>

            {/* Animated dots */}
            <div className="flex justify-center gap-1">
              <div className="w-2 h-2 bg-ios-blue rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="w-2 h-2 bg-ios-blue rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="w-2 h-2 bg-ios-blue rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>

            {/* Transcript preview */}
            {voiceTranscript && (
              <div className="mt-6 p-3 bg-gray-700 rounded-ios">
                <p className="text-xs text-gray-400 mb-1">Your command:</p>
                <p className="text-sm text-white italic">"{voiceTranscript}"</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Advanced Search Modal */}
      <AdvancedSearch
        items={items}
        isOpen={showAdvancedSearch}
        onClose={() => {
          setShowAdvancedSearch(false);
          setIsSearchActive(false);
          setFilteredItems(items);
        }}
        onResults={(results) => {
          setFilteredItems(results);
          setIsSearchActive(true);
        }}
      />

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => setShowVoiceInput(true)}
          className="w-14 h-14 bg-ios-blue text-white rounded-full shadow-ios-lg hover:shadow-xl transition-all duration-200 active:scale-95 flex items-center justify-center"
          title="Voice Input"
        >
          <Mic className="w-6 h-6" />
        </button>
      </div>

      {/* Linked Items Panel */}
      {selectedItemForLinks && (
        <LinkedItemsPanel
          item={selectedItemForLinks}
          allItems={items}
          onItemClick={(item) => {
            setSelectedItemForLinks(null);
            handleEditItem(item);
          }}
          onClose={() => setSelectedItemForLinks(null)}
        />
      )}
    </div>
  );
};
