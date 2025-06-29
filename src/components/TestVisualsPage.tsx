import React, { useState, useEffect } from 'react';
import { Calendar, CheckSquare, FileText, Mic } from 'lucide-react';
import { GlassCard, GlassButton } from './glass';

// Mock data for visual testing - no functionality

interface TestVisualsPageProps {
  onBack?: () => void;
}

// Form Components adapted for TestVisualsPage styling
interface FormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const NoteFormComponent: React.FC<FormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [] as string[],
    category: 'personal' as 'work' | 'personal'
  });

  const [currentTag, setCurrentTag] = useState('');
  const [titleValid, setTitleValid] = useState(false);
  const [contentValid, setContentValid] = useState(false);

  // Predefined tag suggestions
  const tagSuggestions = ['meeting', 'ideas', 'project', 'review', 'planning', 'research', 'personal', 'work'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData({ ...formData, tags: [...formData.tags, trimmedTag] });
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(currentTag);
    }
  };

  const handleTitleChange = (value: string) => {
    setFormData({ ...formData, title: value });
    setTitleValid(value.trim().length >= 3);
  };

  const handleContentChange = (value: string) => {
    setFormData({ ...formData, content: value });
    setContentValid(value.trim().length >= 10);
  };

  const isFormValid = titleValid && contentValid;

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            padding: '8px',
            background: 'rgba(255, 105, 180, 0.2)',
            borderRadius: '8px',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#FF69B4" strokeWidth="2"/>
              <polyline points="14,2 14,8 20,8" stroke="#FF69B4" strokeWidth="2"/>
              <line x1="16" y1="13" x2="8" y2="13" stroke="#FF69B4" strokeWidth="2"/>
              <line x1="16" y1="17" x2="8" y2="17" stroke="#FF69B4" strokeWidth="2"/>
            </svg>
          </div>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#ffffff',
            margin: 0,
          }}>
            New Note
          </h2>
        </div>
        <button
          onClick={onCancel}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            padding: '6px',
            color: '#8b8b8b',
            cursor: 'pointer',
            fontSize: '18px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Title Field with Validation */}
        <div>
          <label style={{
            display: 'block',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            Title *
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="What's this note about?"
              style={{
                width: '100%',
                padding: '14px 16px',
                paddingRight: '40px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: `1px solid ${titleValid ? 'rgba(52, 199, 89, 0.4)' : 'rgba(255, 255, 255, 0.15)'}`,
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box',
              }}
              required
            />
            {titleValid && (
              <div style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#34C759',
              }}>
                ✓
              </div>
            )}
          </div>
          {formData.title.length > 0 && !titleValid && (
            <div style={{ color: '#8b8b8b', fontSize: '12px', marginTop: '4px' }}>
              Title should be at least 3 characters
            </div>
          )}
        </div>

        {/* Category & Priority Row */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <label style={{
              display: 'block',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '8px'
            }}>
              Category
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['work', 'personal'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat })}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: formData.category === cat ?
                      (cat === 'work' ? 'rgba(138, 43, 226, 0.2)' : 'rgba(0, 206, 209, 0.2)') :
                      'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    color: formData.category === cat ?
                      (cat === 'work' ? '#8A2BE2' : '#00CED1') :
                      '#8b8b8b',
                    fontSize: '12px',
                    fontWeight: formData.category === cat ? '600' : '400',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>


        </div>

        {/* Content Field with Validation */}
        <div>
          <label style={{
            display: 'block',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            Content *
          </label>
          <div style={{ position: 'relative' }}>
            <textarea
              value={formData.content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Start writing your note..."
              rows={6}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: `1px solid ${contentValid ? 'rgba(52, 199, 89, 0.4)' : 'rgba(255, 255, 255, 0.15)'}`,
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical',
                minHeight: '120px',
                lineHeight: '1.5',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box',
              }}
              required
            />
            {contentValid && (
              <div style={{
                position: 'absolute',
                right: '12px',
                top: '12px',
                color: '#34C759',
              }}>
                ✓
              </div>
            )}
          </div>
          {formData.content.length > 0 && !contentValid && (
            <div style={{ color: '#8b8b8b', fontSize: '12px', marginTop: '4px' }}>
              Content should be at least 10 characters
            </div>
          )}
        </div>

        {/* Tags Section */}
        <div>
          <label style={{
            display: 'block',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            Tags
          </label>

          {/* Current Tags */}
          {formData.tags.length > 0 && (
            <div style={{
              display: 'flex',
              gap: '6px',
              marginBottom: '8px',
              flexWrap: 'wrap',
            }}>
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    background: 'rgba(175, 82, 222, 0.2)',
                    color: '#AF52DE',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#AF52DE',
                      cursor: 'pointer',
                      fontSize: '12px',
                      padding: '0',
                      width: '14px',
                      height: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Tag Input */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a tag..."
              style={{
                flex: 1,
                padding: '10px 12px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '12px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <button
              type="button"
              onClick={() => addTag(currentTag)}
              disabled={!currentTag.trim()}
              style={{
                padding: '10px 16px',
                background: currentTag.trim() ? 'rgba(175, 82, 222, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(175, 82, 222, 0.3)',
                borderRadius: '6px',
                color: currentTag.trim() ? '#AF52DE' : '#8b8b8b',
                fontSize: '12px',
                fontWeight: '500',
                cursor: currentTag.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              Add
            </button>
          </div>

          {/* Tag Suggestions */}
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {tagSuggestions
              .filter(tag => !formData.tags.includes(tag) && tag.toLowerCase().includes(currentTag.toLowerCase()))
              .slice(0, 6)
              .map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTag(tag)}
                  style={{
                    padding: '4px 8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#8b8b8b',
                    fontSize: '11px',
                    cursor: 'pointer',
                  }}
                >
                  #{tag}
                </button>
              ))}
          </div>
        </div>

        {/* Linked Artifacts Section */}
        <div>
          <label style={{
            display: 'block',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            Linked Artifacts (optional)
          </label>
          <div style={{
            padding: '12px 16px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            color: '#8b8b8b',
            fontSize: '13px',
            fontStyle: 'italic',
            textAlign: 'center',
          }}>
            To be added later
          </div>
        </div>

        {/* Custom Properties Section */}
        <div>
          <label style={{
            display: 'block',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            Custom Properties
          </label>
          <div style={{
            padding: '12px 16px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            color: '#8b8b8b',
            fontSize: '13px',
            fontStyle: 'italic',
            textAlign: 'center',
          }}>
            To be added later
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '8px',
        }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: '#8b8b8b',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid}
            style={{
              flex: 1,
              padding: '12px',
              background: isFormValid ?
                'linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)' :
                'rgba(255, 255, 255, 0.05)',
              border: 'none',
              borderRadius: '8px',
              color: isFormValid ? '#ffffff' : '#8b8b8b',
              fontSize: '14px',
              fontWeight: '500',
              cursor: isFormValid ? 'pointer' : 'not-allowed',
            }}
          >
            Create Note
          </button>
        </div>
      </form>
    </div>
  );
};

const TaskFormComponent: React.FC<FormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'important' as 'urgent' | 'important' | 'optional',
    category: 'work' as 'work' | 'personal',
    subtasks: [] as string[],
    estimatedTime: '30' as '15' | '30' | '60' | '120'
  });

  const [subtasks, setSubtasks] = useState<Array<{
    id: string;
    title: string;
    description: string;
    dueDate: string;
    estimatedTime: string;
  }>>([]);
  const [subtaskFormData, setSubtaskFormData] = useState({
    title: '',
    description: '',
    estimatedTime: '30'
  });
  const [titleValid, setTitleValid] = useState(false);
  const [showQuickDates, setShowQuickDates] = useState(false);
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showLinkedArtifacts, setShowLinkedArtifacts] = useState(false);
  const [linkedArtifactType, setLinkedArtifactType] = useState<'events' | 'tasks' | 'notes' | null>(null);
  const [selectedQuickDate, setSelectedQuickDate] = useState<'this-week' | 'next-week' | null>(null);
  const [linkedArtifacts, setLinkedArtifacts] = useState<Array<{
    id: string;
    type: 'event' | 'task' | 'note';
    title: string;
  }>>([]);

  // Mock data for linked artifacts
  const mockScheduleItems = [
    { id: '1', title: 'Team Standup Meeting' },
    { id: '2', title: 'Client Presentation' },
    { id: '3', title: 'Project Review' },
  ];

  const mockOtherTasks = [
    { id: '1', title: 'Complete project proposal' },
    { id: '2', title: 'Review design mockups' },
    { id: '3', title: 'Update documentation' },
  ];

  const mockNotes = [
    { id: '1', title: 'Meeting Notes - Q4 Planning' },
    { id: '2', title: 'Research on new features' },
    { id: '3', title: 'Client feedback summary' },
  ];

  // Linked artifacts functions
  const addLinkedArtifact = (item: { id: string; title: string }, type: 'event' | 'task' | 'note') => {
    const newArtifact = {
      id: item.id,
      type,
      title: item.title,
    };
    setLinkedArtifacts([...linkedArtifacts, newArtifact]);
    setShowLinkedArtifacts(false);
    setLinkedArtifactType(null);
  };

  const removeLinkedArtifact = (id: string) => {
    setLinkedArtifacts(linkedArtifacts.filter(artifact => artifact.id !== id));
  };

  // Date navigation functions
  const getDateLabel = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayBefore = new Date(today);
    dayBefore.setDate(today.getDate() - 2);
    const dayAfter = new Date(today);
    dayAfter.setDate(today.getDate() + 2);

    const dateStr = date.toDateString();
    const todayStr = today.toDateString();
    const yesterdayStr = yesterday.toDateString();
    const tomorrowStr = tomorrow.toDateString();
    const dayBeforeStr = dayBefore.toDateString();
    const dayAfterStr = dayAfter.toDateString();

    if (dateStr === todayStr) return 'Today';
    if (dateStr === yesterdayStr) return 'Yesterday';
    if (dateStr === tomorrowStr) return 'Tomorrow';
    if (dateStr === dayBeforeStr) return 'Day Before';
    if (dateStr === dayAfterStr) return 'Day After';

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
    setFormData({ ...formData, due_date: newDate.toISOString().split('T')[0] });
  };

  const getQuickDate = (option: string) => {
    const today = new Date();
    const thisWeek = new Date(today);
    thisWeek.setDate(today.getDate() + (7 - today.getDay())); // End of this week (Sunday)
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    switch (option) {
      case 'this-week':
        return thisWeek.toISOString().split('T')[0];
      case 'next-week':
        return nextWeek.toISOString().split('T')[0];
      default:
        return '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addSubtask = () => {
    if (subtaskFormData.title.trim()) {
      const newSubtask = {
        id: Date.now().toString(),
        title: subtaskFormData.title.trim(),
        description: subtaskFormData.description,
        dueDate: '', // Inherits from main task
        estimatedTime: subtaskFormData.estimatedTime
      };
      setSubtasks([...subtasks, newSubtask]);
      setSubtaskFormData({
        title: '',
        description: '',
        estimatedTime: '30'
      });
      setShowSubtaskForm(false);
    }
  };

  const removeSubtask = (id: string) => {
    setSubtasks(subtasks.filter(subtask => subtask.id !== id));
  };

  const updateSubtask = (id: string, updates: Partial<typeof subtasks[0]>) => {
    setSubtasks(subtasks.map(subtask =>
      subtask.id === id ? { ...subtask, ...updates } : subtask
    ));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSubtask();
    }
  };

  const handleTitleChange = (value: string) => {
    setFormData({ ...formData, title: value });
    setTitleValid(value.trim().length >= 3);
  };

  const isFormValid = titleValid;

  return (
    <div style={{ padding: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            padding: '8px',
            background: 'rgba(52, 199, 89, 0.2)',
            borderRadius: '8px',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 11l3 3 8-8" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.51 0 2.93.37 4.18 1.03" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#ffffff',
            margin: 0,
          }}>
            New Task
          </h2>
        </div>
        <button
          onClick={onCancel}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            padding: '6px',
            color: '#8b8b8b',
            cursor: 'pointer',
            fontSize: '18px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Title Field with Validation */}
        <div>
          <label style={{
            display: 'block',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            Task Title *
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="What needs to be done?"
              style={{
                width: '100%',
                padding: '14px 16px',
                paddingRight: '40px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: `1px solid ${titleValid ? 'rgba(52, 199, 89, 0.4)' : 'rgba(255, 255, 255, 0.15)'}`,
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box',
              }}
              required
            />
            {titleValid && (
              <div style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#34C759',
              }}>
                ✓
              </div>
            )}
          </div>
          {formData.title.length > 0 && !titleValid && (
            <div style={{ color: '#8b8b8b', fontSize: '12px', marginTop: '4px' }}>
              Task title should be at least 3 characters
            </div>
          )}
        </div>

        {/* Priority & Category Row */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1 }}>
            <label style={{
              display: 'block',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '8px'
            }}>
              Priority
            </label>
            <div style={{ display: 'flex', gap: '4px' }}>
              {([
                { key: 'urgent', label: 'Urgent', color: '#FF3B30' },
                { key: 'important', label: 'Important', color: '#FF8C00' },
                { key: 'optional', label: 'Optional', color: '#DAA520' }
              ] as const).map((priority) => (
                <button
                  key={priority.key}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: priority.key })}
                  style={{
                    flex: 1,
                    padding: '10px 6px',
                    background: formData.priority === priority.key ?
                      priority.color :
                      'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    color: formData.priority === priority.key ? '#ffffff' : '#8b8b8b',
                    fontSize: '12px',
                    fontWeight: formData.priority === priority.key ? '600' : '400',
                    cursor: 'pointer',
                    textAlign: 'center',
                    textTransform: 'capitalize',
                  }}
                >
                  {priority.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <label style={{
              display: 'block',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '8px'
            }}>
              Category
            </label>
            <div style={{ display: 'flex', gap: '4px' }}>
              {(['work', 'personal'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat })}
                  style={{
                    flex: 1,
                    padding: '10px 8px',
                    background: formData.category === cat ?
                      (cat === 'work' ? 'rgba(138, 43, 226, 0.2)' : 'rgba(0, 206, 209, 0.2)') :
                      'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    color: formData.category === cat ?
                      (cat === 'work' ? '#8A2BE2' : '#00CED1') :
                      '#8b8b8b',
                    fontSize: '12px',
                    fontWeight: formData.category === cat ? '600' : '400',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Due Date Section */}
        <div>
          <label style={{
            display: 'block',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            Due Date
          </label>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Date Navigation */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              flex: 1,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              padding: '4px 12px'
            }}>
              <button
                type="button"
                onClick={() => navigateDate('prev')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8b8b8b',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{
                  width: '0',
                  height: '0',
                  borderTop: '6px solid transparent',
                  borderBottom: '6px solid transparent',
                  borderRight: '8px solid #8b8b8b',
                }}></div>
              </button>

              <button
                type="button"
                onClick={() => setShowCalendar(true)}
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  textAlign: 'center',
                  padding: '4px 8px',
                }}
              >
                {getDateLabel(selectedDate)}
              </button>

              <button
                type="button"
                onClick={() => navigateDate('next')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8b8b8b',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{
                  width: '0',
                  height: '0',
                  borderTop: '6px solid transparent',
                  borderBottom: '6px solid transparent',
                  borderLeft: '8px solid #8b8b8b',
                }}></div>
              </button>
            </div>

            {/* Quick Week Options */}
            <button
              type="button"
              onClick={() => {
                setFormData({ ...formData, due_date: getQuickDate('this-week') });
                setSelectedQuickDate('this-week');
              }}
              style={{
                padding: '8px 12px',
                background: selectedQuickDate === 'this-week' ?
                  'rgba(52, 199, 89, 0.2)' :
                  'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                color: selectedQuickDate === 'this-week' ? '#34C759' : '#8b8b8b',
                fontSize: '11px',
                fontWeight: selectedQuickDate === 'this-week' ? '600' : '400',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              This Week
            </button>

            <button
              type="button"
              onClick={() => {
                setFormData({ ...formData, due_date: getQuickDate('next-week') });
                setSelectedQuickDate('next-week');
              }}
              style={{
                padding: '8px 12px',
                background: selectedQuickDate === 'next-week' ?
                  'rgba(52, 199, 89, 0.2)' :
                  'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                color: selectedQuickDate === 'next-week' ? '#34C759' : '#8b8b8b',
                fontSize: '11px',
                fontWeight: selectedQuickDate === 'next-week' ? '600' : '400',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Next Week
            </button>
          </div>

          {/* Calendar Modal */}
          {showCalendar && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1001,
            }}>
              <div style={{
                background: '#1a1a2e',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '20px',
              }}>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => {
                    setFormData({ ...formData, due_date: e.target.value });
                    setSelectedDate(new Date(e.target.value));
                    setShowCalendar(false);
                  }}
                  style={{
                    width: '200px',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
                <div style={{ marginTop: '12px', textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => setShowCalendar(false)}
                    style={{
                      padding: '8px 16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: '#ffffff',
                      cursor: 'pointer',
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Description Field */}
        <div>
          <label style={{
            display: 'block',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Add more details about this task..."
            rows={3}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none',
              resize: 'vertical',
              lineHeight: '1.4',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Linked Artifacts Section */}
        <div>
          <label style={{
            display: 'block',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            Linked Artifacts (optional)
          </label>

          {/* Current Linked Artifacts */}
          {linkedArtifacts.length > 0 && (
            <div style={{
              marginBottom: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '8px',
              padding: '12px',
            }}>
              {linkedArtifacts.map((artifact) => (
                <div
                  key={`${artifact.type}-${artifact.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: linkedArtifacts.indexOf(artifact) < linkedArtifacts.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '12px',
                      color: artifact.type === 'event' ? '#007AFF' : artifact.type === 'task' ? '#34C759' : '#FF69B4',
                      background: `rgba(${artifact.type === 'event' ? '0, 122, 255' : artifact.type === 'task' ? '52, 199, 89' : '255, 105, 180'}, 0.2)`,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      textTransform: 'capitalize',
                    }}>
                      {artifact.type}
                    </span>
                    <span style={{
                      color: '#ffffff',
                      fontSize: '13px',
                    }}>
                      {artifact.title}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLinkedArtifact(artifact.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#8b8b8b',
                      cursor: 'pointer',
                      fontSize: '16px',
                      padding: '4px',
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Linked Artifact Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => {
                setLinkedArtifactType('events');
                setShowLinkedArtifacts(true);
              }}
              style={{
                flex: 1,
                padding: '8px 12px',
                background: 'rgba(0, 122, 255, 0.1)',
                border: '1px dashed rgba(0, 122, 255, 0.3)',
                borderRadius: '6px',
                color: '#007AFF',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              + Events
            </button>
            <button
              type="button"
              onClick={() => {
                setLinkedArtifactType('tasks');
                setShowLinkedArtifacts(true);
              }}
              style={{
                flex: 1,
                padding: '8px 12px',
                background: 'rgba(52, 199, 89, 0.1)',
                border: '1px dashed rgba(52, 199, 89, 0.3)',
                borderRadius: '6px',
                color: '#34C759',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              + Tasks
            </button>
            <button
              type="button"
              onClick={() => {
                setLinkedArtifactType('notes');
                setShowLinkedArtifacts(true);
              }}
              style={{
                flex: 1,
                padding: '8px 12px',
                background: 'rgba(255, 105, 180, 0.1)',
                border: '1px dashed rgba(255, 105, 180, 0.3)',
                borderRadius: '6px',
                color: '#FF69B4',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              + Notes
            </button>
          </div>

          {/* Linked Artifacts Modal */}
          {showLinkedArtifacts && linkedArtifactType && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1001,
              padding: '20px',
            }}>
              <div style={{
                background: '#1a1a2e',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                maxWidth: '400px',
                width: '100%',
                padding: '24px',
                maxHeight: '500px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <h3 style={{
                  color: '#ffffff',
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: '0 0 20px 0',
                }}>
                  Link {linkedArtifactType === 'events' ? 'Schedule Items' : linkedArtifactType === 'tasks' ? 'Tasks' : 'Notes'}
                </h3>

                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  marginBottom: '16px',
                }}>
                  {(linkedArtifactType === 'events' ? mockScheduleItems :
                    linkedArtifactType === 'tasks' ? mockOtherTasks :
                    mockNotes).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => addLinkedArtifact(item, linkedArtifactType === 'events' ? 'event' : linkedArtifactType === 'tasks' ? 'task' : 'note')}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '14px',
                        cursor: 'pointer',
                        marginBottom: '8px',
                        textAlign: 'left',
                      }}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowLinkedArtifacts(false);
                    setLinkedArtifactType(null);
                  }}
                  style={{
                    padding: '10px 20px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Estimated Time Section */}
        <div>
          <label style={{
            display: 'block',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            Estimated Time
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {([
              { key: '15', label: '15 min' },
              { key: '30', label: '30 min' },
              { key: '60', label: '1 hour' },
              { key: '120', label: '2 hours' }
            ] as const).map((time) => (
              <button
                key={time.key}
                type="button"
                onClick={() => setFormData({ ...formData, estimatedTime: time.key })}
                style={{
                  flex: 1,
                  padding: '10px 8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: formData.estimatedTime === time.key ?
                    '2px solid rgba(255, 255, 255, 0.4)' :
                    '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: formData.estimatedTime === time.key ? '600' : '400',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                {time.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subtasks Section */}
        <div>
          <label style={{
            display: 'block',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            Subtasks
          </label>

          {/* Current Subtasks */}
          {subtasks.length > 0 && (
            <div style={{
              marginBottom: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '8px',
              padding: '12px',
            }}>
              {subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '8px 0',
                    borderBottom: subtasks.indexOf(subtask) < subtasks.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                  }}
                >
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '3px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    marginTop: '2px',
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: '500',
                      marginBottom: '4px',
                    }}>
                      {subtask.title}
                    </div>
                    {subtask.description && (
                      <div style={{
                        color: '#8b8b8b',
                        fontSize: '12px',
                        marginBottom: '4px',
                      }}>
                        {subtask.description}
                      </div>
                    )}
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      fontSize: '11px',
                      color: '#8b8b8b',
                    }}>
                      {subtask.dueDate && <span>📅 {subtask.dueDate}</span>}
                      {subtask.estimatedTime && <span>⏱️ {subtask.estimatedTime}m</span>}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSubtask(subtask.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#8b8b8b',
                      cursor: 'pointer',
                      fontSize: '16px',
                      padding: '4px',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '4px',
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Subtask Button */}
          <button
            type="button"
            onClick={() => setShowSubtaskForm(true)}
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(52, 199, 89, 0.1)',
              border: '1px dashed rgba(52, 199, 89, 0.3)',
              borderRadius: '8px',
              color: '#34C759',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            + Add Subtask
          </button>

          {/* Subtask Form Modal */}
          {showSubtaskForm && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1001,
              padding: '20px',
            }}>
              <div style={{
                background: '#1a1a2e',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                maxWidth: '400px',
                width: '100%',
                padding: '24px',
              }}>
                <h3 style={{
                  color: '#ffffff',
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: '0 0 20px 0',
                }}>
                  Add Subtask
                </h3>

                {/* Subtask Title */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '8px'
                  }}>
                    Title *
                  </label>
                  <input
                    type="text"
                    value={subtaskFormData.title}
                    onChange={(e) => setSubtaskFormData({ ...subtaskFormData, title: e.target.value })}
                    placeholder="What needs to be done?"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>



                {/* Description */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '8px'
                  }}>
                    Description (optional)
                  </label>
                  <textarea
                    value={subtaskFormData.description}
                    onChange={(e) => setSubtaskFormData({ ...subtaskFormData, description: e.target.value })}
                    placeholder="Add more details..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Estimated Time */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '8px'
                  }}>
                    Estimated Time (optional)
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {([
                      { key: '15', label: '15 min' },
                      { key: '30', label: '30 min' },
                      { key: '60', label: '1 hour' },
                      { key: '120', label: '2 hours' }
                    ] as const).map((time) => (
                      <button
                        key={time.key}
                        type="button"
                        onClick={() => setSubtaskFormData({ ...subtaskFormData, estimatedTime: time.key })}
                        style={{
                          flex: 1,
                          padding: '8px 6px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: subtaskFormData.estimatedTime === time.key ?
                            '2px solid rgba(255, 255, 255, 0.4)' :
                            '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '6px',
                          color: '#ffffff',
                          fontSize: '11px',
                          fontWeight: subtaskFormData.estimatedTime === time.key ? '600' : '400',
                          cursor: 'pointer',
                          textAlign: 'center',
                        }}
                      >
                        {time.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSubtaskForm(false);
                      setSubtaskFormData({
                        title: '',
                        description: '',
                        estimatedTime: '30'
                      });
                    }}
                    style={{
                      padding: '10px 20px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      color: '#8b8b8b',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={addSubtask}
                    disabled={!subtaskFormData.title.trim()}
                    style={{
                      padding: '10px 20px',
                      background: subtaskFormData.title.trim() ? 'rgba(52, 199, 89, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(52, 199, 89, 0.3)',
                      borderRadius: '6px',
                      color: subtaskFormData.title.trim() ? '#34C759' : '#8b8b8b',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: subtaskFormData.title.trim() ? 'pointer' : 'not-allowed',
                    }}
                  >
                    Add Subtask
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Custom Properties Section */}
        <div>
          <label style={{
            display: 'block',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            Custom Properties
          </label>
          <div style={{
            padding: '12px 16px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            color: '#8b8b8b',
            fontSize: '13px',
            fontStyle: 'italic',
            textAlign: 'center',
          }}>
            To be added later
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '8px',
        }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: '#8b8b8b',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid}
            style={{
              flex: 1,
              padding: '12px',
              background: isFormValid ?
                'linear-gradient(135deg, #34C759 0%, #30D158 100%)' :
                'rgba(255, 255, 255, 0.05)',
              border: 'none',
              borderRadius: '8px',
              color: isFormValid ? '#ffffff' : '#8b8b8b',
              fontSize: '14px',
              fontWeight: '500',
              cursor: isFormValid ? 'pointer' : 'not-allowed',
            }}
          >
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
};

const CalendarFormComponent: React.FC<FormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'work' as 'work' | 'personal' | 'family' | 'custom',
    customCategory: '',
    start_date: '',
    start_time: '',
    duration: '60' as '15' | '30' | '45' | '60' | '90' | '120' | 'custom',
    end_time: '',
    location: '',
    isVirtual: false,
    meetingLink: '',
    attendees: [] as string[],
    recurring: 'none' as 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly',
    recurringEnd: ''
  });

  const [titleValid, setTitleValid] = useState(false);
  const [currentAttendee, setCurrentAttendee] = useState('');
  const [showRecurring, setShowRecurring] = useState(false);
  const [linkedArtifacts, setLinkedArtifacts] = useState<Array<{
    id: string;
    type: 'task' | 'note';
    title: string;
  }>>([]);
  const [showLinkedArtifacts, setShowLinkedArtifacts] = useState(false);
  const [linkedArtifactType, setLinkedArtifactType] = useState<'tasks' | 'notes' | null>(null);
  const [selectedTimeBucket, setSelectedTimeBucket] = useState('Morning');
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Time bucket system from main app
  const timeBuckets = [
    {
      label: 'Morning',
      times: ['6:00', '6:30', '7:00', '7:30', '8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30']
    },
    {
      label: 'Afternoon',
      times: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30']
    },
    {
      label: 'Evening',
      times: ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30']
    },
    {
      label: 'Night',
      times: ['0:00', '0:30', '1:00', '1:30', '2:00', '2:30', '3:00', '3:30', '4:00', '4:30', '5:00', '5:30']
    }
  ];

  // Mock data for linked artifacts
  const mockTasks = [
    { id: '1', title: 'Prepare presentation slides' },
    { id: '2', title: 'Review quarterly reports' },
    { id: '3', title: 'Send follow-up emails' },
  ];

  const mockNotes = [
    { id: '1', title: 'Meeting agenda template' },
    { id: '2', title: 'Client requirements notes' },
    { id: '3', title: 'Project timeline overview' },
  ];

  // Helper functions
  const handleTitleChange = (value: string) => {
    setFormData({ ...formData, title: value });
    setTitleValid(value.trim().length >= 3);
  };

  const calculateEndTime = (startDate: string, startTime: string, duration: string) => {
    if (!startDate || !startTime || duration === 'custom') return '';

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const durationMinutes = parseInt(duration);
    const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60000);

    return endDateTime.toTimeString().slice(0, 5);
  };

  const handleDurationChange = (newDuration: string) => {
    setFormData({
      ...formData,
      duration: newDuration as any,
      end_time: newDuration !== 'custom' ? calculateEndTime(formData.start_date, formData.start_time, newDuration) : formData.end_time
    });
  };

  const addAttendee = (email: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    if (trimmedEmail && !formData.attendees.includes(trimmedEmail) && trimmedEmail.includes('@')) {
      setFormData({ ...formData, attendees: [...formData.attendees, trimmedEmail] });
      setCurrentAttendee('');
    }
  };

  const removeAttendee = (emailToRemove: string) => {
    setFormData({ ...formData, attendees: formData.attendees.filter(email => email !== emailToRemove) });
  };

  const addLinkedArtifact = (item: { id: string; title: string }, type: 'task' | 'note') => {
    const newArtifact = { id: item.id, type, title: item.title };
    setLinkedArtifacts([...linkedArtifacts, newArtifact]);
    setShowLinkedArtifacts(false);
    setLinkedArtifactType(null);
  };

  const removeLinkedArtifact = (id: string) => {
    setLinkedArtifacts(linkedArtifacts.filter(artifact => artifact.id !== id));
  };

  const generateMeetingLink = () => {
    const meetingId = Math.random().toString(36).substring(2, 15);
    setFormData({ ...formData, meetingLink: `https://meet.example.com/${meetingId}` });
  };

  const isFormValid = titleValid && formData.start_date && formData.start_time;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            padding: '8px',
            background: 'rgba(0, 122, 255, 0.2)',
            borderRadius: '8px',
          }}>
            <Calendar style={{ width: '20px', height: '20px', color: '#007AFF' }} />
          </div>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#ffffff',
            margin: 0,
          }}>
            New Event
          </h2>
        </div>
        <button
          onClick={onCancel}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '6px',
            padding: '8px',
            color: '#ffffff',
            cursor: 'pointer',
            fontSize: '18px',
          }}
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Title Field with Validation */}
        <div>
          <label style={{
            display: 'block',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            Event Title *
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="What's this event about?"
              style={{
                width: '100%',
                padding: '14px 16px',
                paddingRight: '40px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: `1px solid ${titleValid ? 'rgba(52, 199, 89, 0.4)' : 'rgba(255, 255, 255, 0.15)'}`,
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box',
              }}
              required
            />
            {titleValid && (
              <div style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#34C759',
              }}>
                ✓
              </div>
            )}
          </div>
          {formData.title.length > 0 && !titleValid && (
            <div style={{ color: '#8b8b8b', fontSize: '12px', marginTop: '4px' }}>
              Title should be at least 3 characters
            </div>
          )}
        </div>

        {/* Category Section */}
        <div>
          <label style={{
            display: 'block',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            Category
          </label>
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['work', 'personal', 'family'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setFormData({ ...formData, category: cat });
                  setShowCustomCategory(false);
                }}
                style={{
                  flex: 1,
                  padding: '10px 8px',
                  background: formData.category === cat ?
                    (cat === 'work' ? 'rgba(138, 43, 226, 0.2)' :
                     cat === 'personal' ? 'rgba(0, 206, 209, 0.2)' :
                     'rgba(255, 149, 0, 0.2)') :
                    'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: formData.category === cat ?
                    (cat === 'work' ? '#8A2BE2' :
                     cat === 'personal' ? '#00CED1' :
                     '#FF9500') :
                    '#8b8b8b',
                  fontSize: '12px',
                  fontWeight: formData.category === cat ? '600' : '400',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {cat}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setFormData({ ...formData, category: 'custom' });
                setShowCustomCategory(true);
              }}
              style={{
                flex: 1,
                padding: '10px 8px',
                background: formData.category === 'custom' ?
                  'rgba(255, 255, 255, 0.2)' :
                  'rgba(255, 255, 255, 0.05)',
                border: formData.category === 'custom' ?
                  '1px dashed rgba(255, 255, 255, 0.4)' :
                  '1px dashed rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                color: formData.category === 'custom' ? '#ffffff' : '#8b8b8b',
                fontSize: '12px',
                fontWeight: formData.category === 'custom' ? '600' : '400',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
              }}
            >
              + Custom
            </button>
          </div>

          {/* Custom Category Input */}
          {showCustomCategory && formData.category === 'custom' && (
            <div style={{ marginTop: '8px' }}>
              <input
                type="text"
                value={formData.customCategory}
                onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                placeholder="Enter custom category name"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          )}
        </div>

        {/* Date & Recurrence Section - Task Form Style */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Date Navigation (from Task Form) */}
          <div style={{ flex: 1 }}>
            <label style={{
              display: 'block',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '8px'
            }}>
              Date *
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              padding: '4px 12px'
            }}>
              <button
                type="button"
                onClick={() => {
                  const currentDate = formData.start_date ? new Date(formData.start_date) : new Date();
                  const newDate = new Date(currentDate);
                  newDate.setDate(currentDate.getDate() - 1);
                  setFormData({ ...formData, start_date: newDate.toISOString().split('T')[0] });
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8b8b8b',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{
                  width: '0',
                  height: '0',
                  borderTop: '6px solid transparent',
                  borderBottom: '6px solid transparent',
                  borderRight: '8px solid #8b8b8b',
                }}></div>
              </button>

              <button
                type="button"
                onClick={() => setShowCalendar(true)}
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  textAlign: 'center',
                  padding: '4px 8px',
                }}
              >
                {formData.start_date ? (() => {
                  const date = new Date(formData.start_date);
                  const today = new Date();
                  const tomorrow = new Date(today);
                  tomorrow.setDate(today.getDate() + 1);
                  const yesterday = new Date(today);
                  yesterday.setDate(today.getDate() - 1);

                  if (date.toDateString() === today.toDateString()) return 'Today';
                  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
                  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                })() : 'Select Date'}
              </button>

              <button
                type="button"
                onClick={() => {
                  const currentDate = formData.start_date ? new Date(formData.start_date) : new Date();
                  const newDate = new Date(currentDate);
                  newDate.setDate(currentDate.getDate() + 1);
                  setFormData({ ...formData, start_date: newDate.toISOString().split('T')[0] });
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8b8b8b',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{
                  width: '0',
                  height: '0',
                  borderTop: '6px solid transparent',
                  borderBottom: '6px solid transparent',
                  borderLeft: '8px solid #8b8b8b',
                }}></div>
              </button>
            </div>
          </div>

          {/* Recurrence Dropdown */}
          <div style={{ flex: 1 }}>
            <label style={{
              display: 'block',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '8px'
            }}>
              Recurrence
            </label>
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setShowRecurring(!showRecurring)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: formData.recurring !== 'none' ? '#ffffff' : '#8b8b8b',
                  fontSize: '13px',
                  fontWeight: formData.recurring !== 'none' ? '600' : '400',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                }}
              >
                <span>{formData.recurring === 'none' ? 'No Repeat' :
                       formData.recurring === 'daily' ? 'Daily' :
                       formData.recurring === 'weekly' ? 'Weekly' :
                       formData.recurring === 'biweekly' ? 'Bi-weekly' :
                       formData.recurring === 'monthly' ? 'Monthly' :
                       formData.recurring === 'quarterly' ? 'Quarterly' : 'No Repeat'}</span>
                <div style={{
                  width: '0',
                  height: '0',
                  borderLeft: '4px solid transparent',
                  borderRight: '4px solid transparent',
                  borderTop: showRecurring ? 'none' : '6px solid #8b8b8b',
                  borderBottom: showRecurring ? '6px solid #8b8b8b' : 'none',
                }}></div>
              </button>

              {/* Recurrence Dropdown Options */}
              {showRecurring && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: '#1a1a2e',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  marginTop: '4px',
                  zIndex: 1000,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                }}>
                  {([
                    { key: 'none', label: 'No Repeat' },
                    { key: 'daily', label: 'Daily' },
                    { key: 'weekly', label: 'Weekly' },
                    { key: 'biweekly', label: 'Bi-weekly' },
                    { key: 'monthly', label: 'Monthly' },
                    { key: 'quarterly', label: 'Quarterly' }
                  ] as const).map((option, index) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, recurring: option.key as any });
                        setShowRecurring(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: formData.recurring === option.key ? 'rgba(0, 122, 255, 0.2)' : 'transparent',
                        border: 'none',
                        borderBottom: index < 5 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                        color: formData.recurring === option.key ? '#007AFF' : '#ffffff',
                        fontSize: '12px',
                        fontWeight: formData.recurring === option.key ? '600' : '400',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                      onMouseEnter={(e) => {
                        if (formData.recurring !== option.key) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (formData.recurring !== option.key) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Time Selection with Direct Input */}
        <div>
          <div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'end' }}>
            <div style={{ flex: 1 }}>
              <label style={{
                display: 'block',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px'
              }}>
                Start Time *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      start_time: e.target.value,
                      end_time: formData.duration !== 'custom' ? calculateEndTime(formData.start_date, e.target.value, formData.duration) : formData.end_time
                    });
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 12px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowTimePicker(!showTimePicker)}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#8b8b8b',
                    cursor: 'pointer',
                    fontSize: '16px',
                    padding: '4px',
                  }}
                >
                  🕐
                </button>
              </div>
            </div>
          </div>

          {/* Quick Time Options (Collapsible) */}
          {showTimePicker && (
            <div style={{
              marginTop: '8px',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
            }}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                {timeBuckets.map((bucket) => (
                  <button
                    key={bucket.label}
                    type="button"
                    onClick={() => setSelectedTimeBucket(bucket.label)}
                    style={{
                      flex: 1,
                      padding: '6px 8px',
                      background: selectedTimeBucket === bucket.label ?
                        'rgba(0, 122, 255, 0.2)' :
                        'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '4px',
                      color: selectedTimeBucket === bucket.label ? '#007AFF' : '#8b8b8b',
                      fontSize: '10px',
                      fontWeight: selectedTimeBucket === bucket.label ? '600' : '400',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    {bucket.label}
                  </button>
                ))}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '4px'
              }}>
                {timeBuckets
                  .find(bucket => bucket.label === selectedTimeBucket)
                  ?.times.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          start_time: time,
                          end_time: formData.duration !== 'custom' ? calculateEndTime(formData.start_date, time, formData.duration) : formData.end_time
                        });
                        setShowTimePicker(false);
                      }}
                      style={{
                        padding: '6px 4px',
                        background: formData.start_time === time ?
                          'rgba(52, 199, 89, 0.2)' :
                          'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                        color: formData.start_time === time ? '#34C759' : '#8b8b8b',
                        fontSize: '10px',
                        fontWeight: formData.start_time === time ? '600' : '400',
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      {time}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Duration Quick Select */}
          <label style={{
            display: 'block',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: '500',
            marginBottom: '6px'
          }}>
            Duration
          </label>
          <div style={{ display: 'flex', gap: '4px' }}>
            {([
              { key: '15', label: '15m' },
              { key: '30', label: '30m' },
              { key: '60', label: '1h' },
              { key: '120', label: '2h' },
              { key: 'custom', label: 'Custom' }
            ] as const).map((dur) => (
              <button
                key={dur.key}
                type="button"
                onClick={() => handleDurationChange(dur.key)}
                style={{
                  flex: 1,
                  padding: '8px 4px',
                  background: formData.duration === dur.key ?
                    'rgba(0, 122, 255, 0.2)' :
                    'rgba(255, 255, 255, 0.05)',
                  border: formData.duration === dur.key ?
                    '2px solid rgba(0, 122, 255, 0.4)' :
                    '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: formData.duration === dur.key ? '#007AFF' : '#8b8b8b',
                  fontSize: '11px',
                  fontWeight: formData.duration === dur.key ? '600' : '400',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                {dur.label}
              </button>
            ))}
          </div>

          {/* Custom End Time (only if custom duration selected) */}
          {formData.duration === 'custom' && (
            <div style={{ marginTop: '12px' }}>
              <label style={{
                display: 'block',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: '500',
                marginBottom: '6px'
              }}>
                End Time
              </label>
              <input
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          )}
          </div>
        </div>

        {/* Description Field */}
        <div>
          <label style={{
            display: 'block',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            Description (optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Add event description, agenda, or notes..."
            rows={3}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none',
              resize: 'vertical',
              lineHeight: '1.4',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Location Section - Simplified */}
        <div>
          <label style={{
            display: 'block',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            Location (optional)
          </label>

          {/* Simplified Toggle */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isVirtual: false, meetingLink: '' })}
              style={{
                padding: '6px 12px',
                background: !formData.isVirtual ?
                  'rgba(0, 122, 255, 0.2)' :
                  'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                color: !formData.isVirtual ? '#007AFF' : '#8b8b8b',
                fontSize: '11px',
                fontWeight: !formData.isVirtual ? '600' : '400',
                cursor: 'pointer',
              }}
            >
              📍 In-Person
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isVirtual: true })}
              style={{
                padding: '6px 12px',
                background: formData.isVirtual ?
                  'rgba(0, 122, 255, 0.2)' :
                  'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                color: formData.isVirtual ? '#007AFF' : '#8b8b8b',
                fontSize: '11px',
                fontWeight: formData.isVirtual ? '600' : '400',
                cursor: 'pointer',
              }}
            >
              💻 Virtual
            </button>
          </div>

          {/* Location Input or Meeting Link */}
          {!formData.isVirtual ? (
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Conference room, address, or venue"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="url"
                value={formData.meetingLink}
                onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                placeholder="Meeting link (auto-generated if empty)"
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={generateMeetingLink}
                style={{
                  padding: '12px 16px',
                  background: 'rgba(0, 122, 255, 0.1)',
                  border: '1px dashed rgba(0, 122, 255, 0.3)',
                  borderRadius: '8px',
                  color: '#007AFF',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Generate
              </button>
            </div>
          )}
        </div>

        {/* Enhanced Attendees Management */}
        <div>
          <label style={{
            display: 'block',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            Attendees (optional)
          </label>

          {/* Current Attendees List */}
          {formData.attendees.length > 0 && (
            <div style={{
              marginBottom: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '8px',
              padding: '12px',
            }}>
              {formData.attendees.map((email, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 0',
                    borderBottom: index < formData.attendees.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'rgba(0, 122, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      color: '#007AFF',
                      fontWeight: '600',
                    }}>
                      {email.charAt(0).toUpperCase()}
                    </span>
                    <span style={{
                      color: '#ffffff',
                      fontSize: '13px',
                    }}>
                      {email}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttendee(email)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#8b8b8b',
                      cursor: 'pointer',
                      fontSize: '16px',
                      padding: '4px',
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Attendee Input */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="email"
              value={currentAttendee}
              onChange={(e) => setCurrentAttendee(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addAttendee(currentAttendee);
                }
              }}
              placeholder="Enter attendee email address"
              style={{
                flex: 1,
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <button
              type="button"
              onClick={() => addAttendee(currentAttendee)}
              disabled={!currentAttendee.trim() || !currentAttendee.includes('@')}
              style={{
                padding: '12px 16px',
                background: currentAttendee.trim() && currentAttendee.includes('@') ?
                  'rgba(0, 122, 255, 0.2)' :
                  'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: currentAttendee.trim() && currentAttendee.includes('@') ? '#007AFF' : '#8b8b8b',
                fontSize: '12px',
                fontWeight: '500',
                cursor: currentAttendee.trim() && currentAttendee.includes('@') ? 'pointer' : 'not-allowed',
                whiteSpace: 'nowrap',
              }}
            >
              Add
            </button>
          </div>

          {formData.attendees.length > 0 && (
            <div style={{
              marginTop: '8px',
              padding: '8px 12px',
              background: 'rgba(0, 122, 255, 0.05)',
              border: '1px solid rgba(0, 122, 255, 0.2)',
              borderRadius: '6px',
              fontSize: '12px',
              color: '#8b8b8b',
            }}>
              📧 {formData.attendees.length} attendee{formData.attendees.length !== 1 ? 's' : ''} will receive calendar invites
            </div>
          )}
        </div>

        {/* Recurring Events Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <label style={{
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '500',
            }}>
              Recurring Event
            </label>
            <button
              type="button"
              onClick={() => setShowRecurring(!showRecurring)}
              style={{
                border: 'none',
                color: '#8b8b8b',
                cursor: 'pointer',
                fontSize: '12px',
                padding: '4px 8px',
                borderRadius: '4px',
                background: 'rgba(255, 255, 255, 0.05)',
              }}
            >
              {showRecurring ? 'Hide' : 'Add'}
            </button>
          </div>

          {showRecurring && (
            <div style={{
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              marginBottom: '16px',
            }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                {([
                  { key: 'none', label: 'No Repeat' },
                  { key: 'daily', label: 'Daily' },
                  { key: 'weekly', label: 'Weekly' },
                  { key: 'monthly', label: 'Monthly' }
                ] as const).map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setFormData({ ...formData, recurring: option.key })}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      background: formData.recurring === option.key ?
                        'rgba(0, 122, 255, 0.2)' :
                        'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      color: formData.recurring === option.key ? '#007AFF' : '#8b8b8b',
                      fontSize: '11px',
                      fontWeight: formData.recurring === option.key ? '600' : '400',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {formData.recurring !== 'none' && (
                <div>
                  <label style={{
                    display: 'block',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: '500',
                    marginBottom: '6px'
                  }}>
                    Repeat Until (optional)
                  </label>
                  <input
                    type="date"
                    value={formData.recurringEnd}
                    onChange={(e) => setFormData({ ...formData, recurringEnd: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Linked Artifacts Section */}
        <div>
          <label style={{
            display: 'block',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            Linked Artifacts (optional)
          </label>

          {/* Current Linked Artifacts */}
          {linkedArtifacts.length > 0 && (
            <div style={{
              marginBottom: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '8px',
              padding: '12px',
            }}>
              {linkedArtifacts.map((artifact) => (
                <div
                  key={`${artifact.type}-${artifact.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: linkedArtifacts.indexOf(artifact) < linkedArtifacts.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '12px',
                      color: artifact.type === 'task' ? '#34C759' : '#FF69B4',
                      background: `rgba(${artifact.type === 'task' ? '52, 199, 89' : '255, 105, 180'}, 0.2)`,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      textTransform: 'capitalize',
                    }}>
                      {artifact.type}
                    </span>
                    <span style={{
                      color: '#ffffff',
                      fontSize: '13px',
                    }}>
                      {artifact.title}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLinkedArtifact(artifact.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#8b8b8b',
                      cursor: 'pointer',
                      fontSize: '16px',
                      padding: '4px',
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Linked Artifact Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => {
                setLinkedArtifactType('tasks');
                setShowLinkedArtifacts(true);
              }}
              style={{
                flex: 1,
                padding: '8px 12px',
                background: 'rgba(52, 199, 89, 0.1)',
                border: '1px dashed rgba(52, 199, 89, 0.3)',
                borderRadius: '6px',
                color: '#34C759',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              + Tasks
            </button>
            <button
              type="button"
              onClick={() => {
                setLinkedArtifactType('notes');
                setShowLinkedArtifacts(true);
              }}
              style={{
                flex: 1,
                padding: '8px 12px',
                background: 'rgba(255, 105, 180, 0.1)',
                border: '1px dashed rgba(255, 105, 180, 0.3)',
                borderRadius: '6px',
                color: '#FF69B4',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              + Notes
            </button>
          </div>
        </div>

        {/* Custom Properties Section */}
        <div>
          <label style={{
            display: 'block',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            Custom Properties
          </label>
          <div style={{
            padding: '12px 16px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            color: '#8b8b8b',
            fontSize: '13px',
            fontStyle: 'italic',
            textAlign: 'center',
          }}>
            To be added later
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '14px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid}
            style={{
              flex: 1,
              padding: '14px',
              background: isFormValid ?
                'linear-gradient(135deg, #007AFF 0%, #0056CC 100%)' :
                'rgba(255, 255, 255, 0.05)',
              border: 'none',
              borderRadius: '8px',
              color: isFormValid ? '#ffffff' : '#8b8b8b',
              fontSize: '14px',
              fontWeight: '600',
              cursor: isFormValid ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
            }}
          >
            {isFormValid ? '✓ Create Event' : 'Create Event'}
          </button>
        </div>

        {/* Linked Artifacts Modal */}
        {showLinkedArtifacts && linkedArtifactType && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001,
            padding: '20px',
          }}>
            <div style={{
              background: '#1a1a2e',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              maxWidth: '400px',
              width: '100%',
              padding: '24px',
              maxHeight: '500px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <h3 style={{
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: '600',
                margin: '0 0 20px 0',
              }}>
                Link {linkedArtifactType === 'tasks' ? 'Tasks' : 'Notes'}
              </h3>

              <div style={{
                flex: 1,
                overflowY: 'auto',
                marginBottom: '16px',
              }}>
                {(linkedArtifactType === 'tasks' ? mockTasks : mockNotes).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => addLinkedArtifact(item, linkedArtifactType === 'tasks' ? 'task' : 'note')}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '14px',
                      cursor: 'pointer',
                      marginBottom: '8px',
                      textAlign: 'left',
                      transition: 'background 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }}
                  >
                    {item.title}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowLinkedArtifacts(false);
                  setLinkedArtifactType(null);
                }}
                style={{
                  padding: '10px 20px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Calendar Modal */}
        {showCalendar && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001,
            padding: '20px',
          }}>
            <div style={{
              background: '#1a1a2e',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '24px',
              maxWidth: '300px',
              width: '100%',
            }}>
              <h3 style={{
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: '600',
                margin: '0 0 16px 0',
              }}>
                Select Date
              </h3>

              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => {
                  setFormData({ ...formData, start_date: e.target.value });
                  setShowCalendar(false);
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  marginBottom: '16px',
                }}
              />

              <button
                type="button"
                onClick={() => setShowCalendar(false)}
                style={{
                  width: '100%',
                  padding: '10px 20px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export const TestVisualsPage: React.FC<TestVisualsPageProps> = ({ onBack }) => {
  // Add consistent scrollbar styling to prevent layout shifts
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .consistent-scroll {
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
      }
      .consistent-scroll::-webkit-scrollbar {
        width: 8px;
      }
      .consistent-scroll::-webkit-scrollbar-track {
        background: transparent;
      }
      .consistent-scroll::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 4px;
      }
      .consistent-scroll::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.5);
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  // Tab state persistence - remember user's last active tab
  const [activeTab, setActiveTab] = useState<'schedule' | 'tasks' | 'notes'>(() => {
    const savedTab = localStorage.getItem('activeTab');
    return (savedTab as 'schedule' | 'tasks' | 'notes') || 'schedule';
  });

  // Save tab state when it changes
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  // Set focus to the active tab on initial load
  useEffect(() => {
    updateFocus(activeTab);
  }, []); // Run only once on mount

  // Form modal state
  const [activeForm, setActiveForm] = useState<'calendar' | 'task' | 'note' | null>(null);

  // Filter state for tasks
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedDueDates, setSelectedDueDates] = useState<string[]>([]);

  // Form handlers
  const handleFormSubmit = (data: any) => {
    console.log('Form submitted:', data);
    setActiveForm(null);
  };

  const handleFormCancel = () => {
    setActiveForm(null);
  };

  // Filter toggle functions
  const togglePriorityFilter = (priority: string) => {
    setSelectedPriorities(prev =>
      prev.includes(priority)
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    );
  };

  const toggleDueDateFilter = (dueDate: string) => {
    setSelectedDueDates(prev =>
      prev.includes(dueDate)
        ? prev.filter(d => d !== dueDate)
        : [...prev, dueDate]
    );
  };

  const clearPriorityFilters = () => setSelectedPriorities([]);
  const clearDueDateFilters = () => setSelectedDueDates([]);

  // Handle "Hi Nikhil" home button click
  const handleHomeClick = () => {
    const defaultTab = localStorage.getItem('defaultHomeTab') as 'schedule' | 'tasks' | 'notes' || 'schedule';
    setActiveTab(defaultTab);
  };

  // Mobile swipe navigation
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Refs for tab buttons to manage focus
  const scheduleButtonRef = React.useRef<HTMLButtonElement>(null);
  const tasksButtonRef = React.useRef<HTMLButtonElement>(null);
  const notesButtonRef = React.useRef<HTMLButtonElement>(null);

  // Function to update focus to match active tab
  const updateFocus = (tab: 'schedule' | 'tasks' | 'notes') => {
    const buttonRefs = {
      schedule: scheduleButtonRef,
      tasks: tasksButtonRef,
      notes: notesButtonRef,
    };

    // Remove focus from all buttons first
    Object.values(buttonRefs).forEach(ref => ref.current?.blur());

    // Focus the active tab button
    setTimeout(() => {
      buttonRefs[tab].current?.focus();
    }, 0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe || isRightSwipe) {
      const tabs: ('schedule' | 'tasks' | 'notes')[] = ['schedule', 'tasks', 'notes'];
      const currentIndex = tabs.indexOf(activeTab);

      // Sequential navigation without rotation
      if (isLeftSwipe && currentIndex < tabs.length - 1) {
        // Swipe left = move to next tab (right direction)
        const newTab = tabs[currentIndex + 1];
        setActiveTab(newTab);
        updateFocus(newTab);
      } else if (isRightSwipe && currentIndex > 0) {
        // Swipe right = move to previous tab (left direction)
        const newTab = tabs[currentIndex - 1];
        setActiveTab(newTab);
        updateFocus(newTab);
      }
      // If at the ends, do nothing (no rotation)
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1a1a2e',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '20px',
    }}>
      {/* iPhone 16 Pro Max Container */}
      <div style={{
        width: '430px',
        height: '932px',
        background: '#1a1a2e',
        borderRadius: '40px',
        border: '8px solid #2a2a3e',
        boxShadow: '0 0 30px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Dynamic Island */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '126px',
          height: '37px',
          background: '#000000',
          borderRadius: '19px',
          zIndex: 1000,
        }}></div>

        {/* App Content Container */}
        <div
          className="consistent-scroll"
          style={{
          width: '100%',
          height: '100%',
          paddingTop: '60px', // Account for Dynamic Island
          paddingBottom: '34px', // Account for home indicator
          paddingLeft: '8px',
          paddingRight: '8px',
          overflow: 'auto',
          background: '#1a1a2e',
          scrollbarGutter: 'stable', // Reserve space for scrollbar
        }}>
          {/* Header */}
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              padding: '16px 8px',
              marginBottom: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '16px',
        }}>
          {/* Menu Icon */}
          <div style={{
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            marginTop: '2px',
          }}>
            <div style={{
              width: '18px',
              height: '14px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div style={{ width: '100%', height: '2px', background: '#ffffff', borderRadius: '1px' }}></div>
              <div style={{ width: '100%', height: '2px', background: '#ffffff', borderRadius: '1px' }}></div>
              <div style={{ width: '100%', height: '2px', background: '#ffffff', borderRadius: '1px' }}></div>
            </div>
          </div>

          {/* Center Content */}
          <div style={{ textAlign: 'center', flex: 1 }}>
            <h1
              onClick={handleHomeClick}
              style={{
                fontSize: '28px',
                fontWeight: '600',
                color: '#ffffff',
                margin: '0 0 4px 0',
                letterSpacing: '-0.5px',
                cursor: 'pointer',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Hi Nikhil
            </h1>
            <p style={{
              color: '#8b8b8b',
              margin: 0,
              fontSize: '14px',
              fontWeight: '400',
            }}>
              Saturday, June 28, 2025
            </p>
          </div>

          {/* Profile Icon */}
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            marginTop: '2px',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="#ffffff" strokeWidth="2"/>
              <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="#ffffff" strokeWidth="2"/>
            </svg>
          </div>
        </div>
          
        {/* Voice Input Bar with Action Icons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '12px',
          width: '100%',
        }}>
          {/* Voice Input Bar - extends to icons minus gap */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            padding: '10px 8px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            width: 'calc(100% - 150px)', // 3 icons (38px each) + 2 gaps (6px) + final gap (6px) + container padding (32px) = 150px
            height: '38px', // Match icon height
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxSizing: 'border-box',
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#4CAF50',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="#ffffff"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="19" x2="12" y2="23" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
                <line x1="8" y1="23" x2="16" y2="23" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Speak to instruct"
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#b0b0b0',
                fontSize: '14px',
                flex: 1,
                fontWeight: '400',
              }}
            />
          </div>

          {/* Action Icons - fixed width for 3 icons */}
          <div style={{
            display: 'flex',
            gap: '6px',
            width: '126px', // 3 icons (38px each) + 2 gaps (6px each) = 126px
            justifyContent: 'flex-end',
          }}>
            {/* Calendar Icon */}
            <button
              onClick={() => setActiveForm('calendar')}
              style={{
                background: 'rgba(0, 122, 255, 0.15)',
                border: '1px solid rgba(0, 122, 255, 0.3)',
                borderRadius: '8px',
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 122, 255, 0.25)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 122, 255, 0.15)'}
            >
              <Calendar style={{ width: '16px', height: '16px', color: '#007AFF' }} />
            </button>

            {/* Task Icon */}
            <button
              onClick={() => setActiveForm('task')}
              style={{
                background: 'rgba(52, 199, 89, 0.15)',
                border: '1px solid rgba(52, 199, 89, 0.3)',
                borderRadius: '8px',
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(52, 199, 89, 0.25)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(52, 199, 89, 0.15)'}
            >
              <CheckSquare style={{ width: '16px', height: '16px', color: '#34C759' }} />
            </button>

            {/* Note Icon */}
            <button
              onClick={() => setActiveForm('note')}
              style={{
                background: 'rgba(255, 105, 180, 0.15)',
                border: '1px solid rgba(255, 105, 180, 0.3)',
                borderRadius: '8px',
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(175, 82, 222, 0.25)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(175, 82, 222, 0.15)'}
            >
              <FileText style={{ width: '16px', height: '16px', color: '#AF52DE' }} />
            </button>
          </div>
        </div>
        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '4px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          padding: '4px',
          marginBottom: '8px',
        }}>
          <button
            ref={scheduleButtonRef}
            onClick={() => setActiveTab('schedule')}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '6px',
              border: activeTab === 'schedule' ? '2px solid #007AFF' : 'none',
              background: activeTab === 'schedule' ? 'rgba(0, 122, 255, 0.2)' : 'transparent',
              color: activeTab === 'schedule' ? '#ffffff' : '#8b8b8b',
              fontSize: '14px',
              fontWeight: activeTab === 'schedule' ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textTransform: 'capitalize',
              outline: 'none',
            }}
          >
            Schedule
          </button>
          <button
            ref={tasksButtonRef}
            onClick={() => setActiveTab('tasks')}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '6px',
              border: activeTab === 'tasks' ? '2px solid #34C759' : 'none',
              background: activeTab === 'tasks' ? 'rgba(52, 199, 89, 0.2)' : 'transparent',
              color: activeTab === 'tasks' ? '#ffffff' : '#8b8b8b',
              fontSize: '14px',
              fontWeight: activeTab === 'tasks' ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textTransform: 'capitalize',
              outline: 'none',
            }}
          >
            Tasks
          </button>
          <button
            ref={notesButtonRef}
            onClick={() => setActiveTab('notes')}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '6px',
              border: activeTab === 'notes' ? '2px solid #FF69B4' : 'none',
              background: activeTab === 'notes' ? 'rgba(255, 105, 180, 0.2)' : 'transparent',
              color: activeTab === 'notes' ? '#ffffff' : '#8b8b8b',
              fontSize: '14px',
              fontWeight: activeTab === 'notes' ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textTransform: 'capitalize',
              outline: 'none',
            }}
          >
            Notes
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div
        className="consistent-scroll"
        style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            padding: '8px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            flex: 1,
            overflow: 'auto',
          }}>
        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div>
            {/* Date Navigation */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                {/* Left Arrow */}
                <button style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div style={{
                    width: '0',
                    height: '0',
                    borderTop: '6px solid transparent',
                    borderBottom: '6px solid transparent',
                    borderRight: '8px solid #ffffff',
                  }}></div>
                </button>

                {/* Date Section */}
                <div style={{ textAlign: 'center' }}>
                  <h2 style={{
                    color: '#ffffff',
                    fontSize: '18px',
                    fontWeight: '600',
                    margin: '0 0 2px 0',
                  }}>
                    Today
                  </h2>
                  <span style={{
                    color: '#8b8b8b',
                    fontSize: '14px',
                    fontWeight: '400',
                  }}>
                    28-Jun
                  </span>
                </div>

                {/* Right Arrow */}
                <button style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div style={{
                    width: '0',
                    height: '0',
                    borderTop: '6px solid transparent',
                    borderBottom: '6px solid transparent',
                    borderLeft: '8px solid #ffffff',
                  }}></div>
                </button>
              </div>

              <div style={{
                display: 'flex',
                gap: '4px',
                alignItems: 'center',
              }}>
                <button style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  color: '#ffffff',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: '500',
                }}>Work</button>
                <button style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  color: '#ffffff',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: '500',
                }}>Personal</button>
                <button style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  color: '#ffffff',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: '500',
                }}>Family</button>

                {/* Spacer */}
                <div style={{ flex: 1 }}></div>

                {/* Custom Filter Button - Compact */}
                <button style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  color: '#8b8b8b',
                  fontSize: '12px',
                  fontWeight: '400',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18M7 12h10m-7 6h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Schedule Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Team Standup Card */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden',
              }}>
                <div style={{
                  minWidth: '70px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}>
                  <div style={{
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '600',
                    lineHeight: '1.2',
                  }}>09:00</div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <div style={{
                      width: '0',
                      height: '0',
                      borderLeft: '3px solid transparent',
                      borderRight: '3px solid transparent',
                      borderTop: '5px solid #8b8b8b',
                    }}></div>
                    <span style={{
                      color: '#8b8b8b',
                      fontSize: '12px',
                      fontWeight: '400',
                    }}>1h 30m</span>
                  </div>
                  <div style={{
                    color: '#8b8b8b',
                    fontSize: '16px',
                    fontWeight: '400',
                  }}>10:30</div>
                </div>
                <div style={{
                  flex: 1,
                  minWidth: 0,
                  maxWidth: 'calc(100% - 120px)',
                }}>
                  <h3 style={{
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '600',
                    margin: '0 0 4px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%',
                  }}>
                    Team Standup
                  </h3>
                  <p style={{
                    color: '#8b8b8b',
                    fontSize: '14px',
                    margin: '0 0 8px 0',
                    fontWeight: '400',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%',
                  }}>
                    Weekly team sync and planning session
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    width: '100%',
                    overflow: 'hidden',
                  }}>
                    <span style={{
                      background: '#d4a853',
                      color: '#000000',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                    }}>
                      3 PREP TASKS
                    </span>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '4px',
                  minWidth: '24px',
                  width: '24px',
                  flexShrink: 0,
                  alignSelf: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: '#8b8b8b' }}>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Time Gap */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                paddingLeft: '82px',
                margin: '4px 0',
              }}>
                <span style={{
                  color: '#8b8b8b',
                  fontSize: '12px',
                  fontWeight: '400',
                }}>
                  Free
                </span>
                <div style={{
                  width: '2px',
                  height: '20px',
                  background: 'repeating-linear-gradient(to bottom, #8b8b8b 0, #8b8b8b 3px, transparent 3px, transparent 6px)',
                }}></div>
                <span style={{
                  color: '#8b8b8b',
                  fontSize: '12px',
                  fontWeight: '400',
                }}>
                  3 hours 30 minutes
                </span>
              </div>

              {/* Client Presentation Card */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden',
              }}>
                <div style={{
                  minWidth: '70px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}>
                  <div style={{
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '600',
                    lineHeight: '1.2',
                  }}>14:00</div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <div style={{
                      width: '0',
                      height: '0',
                      borderLeft: '3px solid transparent',
                      borderRight: '3px solid transparent',
                      borderTop: '5px solid #8b8b8b',
                    }}></div>
                    <span style={{
                      color: '#8b8b8b',
                      fontSize: '12px',
                      fontWeight: '400',
                    }}>1h</span>
                  </div>
                  <div style={{
                    color: '#8b8b8b',
                    fontSize: '16px',
                    fontWeight: '400',
                  }}>15:00</div>
                </div>
                <div style={{
                  flex: 1,
                  minWidth: 0,
                  maxWidth: 'calc(100% - 120px)',
                }}>
                  <h3 style={{
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '600',
                    margin: '0 0 4px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%',
                  }}>
                    Client Presentation
                  </h3>
                  <p style={{
                    color: '#8b8b8b',
                    fontSize: '14px',
                    margin: '0 0 8px 0',
                    fontWeight: '400',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%',
                  }}>
                    Q4 project proposal presentation
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    width: '100%',
                    overflow: 'hidden',
                  }}>
                    <span style={{
                      background: '#d4a853',
                      color: '#000000',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                    }}>
                      2 PREP TASKS
                    </span>
                    <span style={{
                      background: '#8b5cf6',
                      color: '#ffffff',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                    }}>
                      TRAVEL
                    </span>
                    <span style={{
                      color: '#8b8b8b',
                      fontSize: '10px',
                      fontWeight: '500',
                      whiteSpace: 'nowrap',
                    }}>
                      +1
                    </span>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '4px',
                  minWidth: '24px',
                  width: '24px',
                  flexShrink: 0,
                  alignSelf: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: '#8b8b8b' }}>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Time Gap */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                paddingLeft: '82px',
                margin: '4px 0',
              }}>
                <span style={{
                  color: '#8b8b8b',
                  fontSize: '12px',
                  fontWeight: '400',
                }}>
                  Free
                </span>
                <div style={{
                  width: '2px',
                  height: '20px',
                  background: 'repeating-linear-gradient(to bottom, #8b8b8b 0, #8b8b8b 3px, transparent 3px, transparent 6px)',
                }}></div>
                <span style={{
                  color: '#8b8b8b',
                  fontSize: '12px',
                  fontWeight: '400',
                }}>
                  1 hour 30 minutes
                </span>
              </div>

              {/* Design Review Card */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden',
              }}>
                <div style={{
                  minWidth: '70px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}>
                  <div style={{
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '600',
                    lineHeight: '1.2',
                  }}>16:30</div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <div style={{
                      width: '0',
                      height: '0',
                      borderLeft: '3px solid transparent',
                      borderRight: '3px solid transparent',
                      borderTop: '5px solid #8b8b8b',
                    }}></div>
                    <span style={{
                      color: '#8b8b8b',
                      fontSize: '12px',
                      fontWeight: '400',
                    }}>1h</span>
                  </div>
                  <div style={{
                    color: '#8b8b8b',
                    fontSize: '16px',
                    fontWeight: '400',
                  }}>17:30</div>
                </div>
                <div style={{
                  flex: 1,
                  minWidth: 0,
                  maxWidth: 'calc(100% - 120px)',
                }}>
                  <h3 style={{
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '600',
                    margin: '0 0 4px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%',
                  }}>
                    Design Review
                  </h3>
                  <p style={{
                    color: '#8b8b8b',
                    fontSize: '14px',
                    margin: '0 0 8px 0',
                    fontWeight: '400',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%',
                  }}>
                    Review new interface mockups with design team
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    width: '100%',
                    overflow: 'hidden',
                  }}>
                    <span style={{
                      background: '#ef4444',
                      color: '#ffffff',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                    }}>
                      URGENT
                    </span>
                    <span style={{
                      background: '#10b981',
                      color: '#ffffff',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                    }}>
                      1 POST TASK
                    </span>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '4px',
                  minWidth: '24px',
                  width: '24px',
                  flexShrink: 0,
                  alignSelf: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: '#8b8b8b' }}>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div>
            {/* Date Navigation & Priority Filters - Matching Schedule Layout */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                {/* Left Arrow */}
                <button style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div style={{
                    width: '0',
                    height: '0',
                    borderTop: '6px solid transparent',
                    borderBottom: '6px solid transparent',
                    borderRight: '8px solid #ffffff',
                  }}></div>
                </button>

                {/* Date Section */}
                <div style={{ textAlign: 'center' }}>
                  <h2 style={{
                    color: '#ffffff',
                    fontSize: '18px',
                    fontWeight: '600',
                    margin: '0 0 2px 0',
                  }}>
                    Today
                  </h2>
                  <span style={{
                    color: '#8b8b8b',
                    fontSize: '14px',
                    fontWeight: '400',
                  }}>
                    28-Jun
                  </span>
                </div>

                {/* Right Arrow */}
                <button style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div style={{
                    width: '0',
                    height: '0',
                    borderTop: '6px solid transparent',
                    borderBottom: '6px solid transparent',
                    borderLeft: '8px solid #ffffff',
                  }}></div>
                </button>
              </div>

              <div style={{
                display: 'flex',
                gap: '4px',
                alignItems: 'center',
              }}>
                <button style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  color: '#ffffff',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: '500',
                }}>Urgent</button>
                <button style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  color: '#ffffff',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: '500',
                }}>Important</button>
                <button style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  color: '#ffffff',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: '500',
                }}>Optional</button>

                {/* Custom Filter Button - Same as Schedule */}
                <button style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  color: '#8b8b8b',
                  fontSize: '12px',
                  fontWeight: '400',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18M7 12h10m-7 6h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Date-Wise Task Segmentation */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* Today's Tasks Section */}
              <div>
                <h3 style={{
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0 0 12px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  📅 Today's Tasks
                  <span style={{
                    background: 'rgba(52, 199, 89, 0.2)',
                    color: '#34C759',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                  }}>
                    3
                  </span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Today Task 1 */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '8px',
                    padding: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}>
                    <input
                      type="checkbox"
                      style={{
                        width: '18px',
                        height: '18px',
                        accentColor: '#4CAF50',
                        marginTop: '2px',
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{
                        color: '#ffffff',
                        fontSize: '16px',
                        fontWeight: '500',
                        margin: '0 0 4px 0',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        Prepare presentation slides
                      </h3>
                      <p style={{
                        color: '#8b8b8b',
                        fontSize: '14px',
                        fontWeight: '400',
                        margin: '0 0 8px 0',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        Create slides for quarterly review meeting
                      </p>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}>
                        <span style={{
                          background: '#ef4444',
                          color: '#ffffff',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                        }}>
                          URGENT
                        </span>
                        <span style={{
                          color: '#8b8b8b',
                          fontSize: '12px',
                        }}>
                          Due today
                        </span>
                        <span style={{
                          color: '#ef4444',
                          fontSize: '12px',
                          fontWeight: '500',
                        }}>
                          by 14:00
                        </span>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      padding: '4px',
                      minWidth: '24px',
                      width: '24px',
                      flexShrink: 0,
                      alignSelf: 'center',
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: '#8b8b8b' }}>
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>

                  {/* Today Task 2 */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '8px',
                    padding: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}>
                    <input
                      type="checkbox"
                      style={{
                        width: '18px',
                        height: '18px',
                        accentColor: '#4CAF50',
                        marginTop: '2px',
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{
                        color: '#ffffff',
                        fontSize: '16px',
                        fontWeight: '500',
                        margin: '0 0 4px 0',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        Review team standup agenda
                      </h3>
                      <p style={{
                        color: '#8b8b8b',
                        fontSize: '14px',
                        fontWeight: '400',
                        margin: '0 0 8px 0',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        Prepare talking points for team meeting
                      </p>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}>
                        <span style={{
                          background: '#ff8c00',
                          color: '#ffffff',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                        }}>
                          IMPORTANT
                        </span>
                        <span style={{
                          color: '#8b8b8b',
                          fontSize: '12px',
                        }}>
                          Due today
                        </span>
                        <span style={{
                          color: '#ff8c00',
                          fontSize: '12px',
                          fontWeight: '500',
                        }}>
                          by 09:00
                        </span>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      padding: '4px',
                      minWidth: '24px',
                      width: '24px',
                      flexShrink: 0,
                      alignSelf: 'center',
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: '#8b8b8b' }}>
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Other Pending Tasks Section */}
              <div>
                <h3 style={{
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0 0 12px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  📋 Other Pending Tasks
                  <span style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#8b8b8b',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                  }}>
                    5
                  </span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Other Task 1 */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '8px',
                    padding: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}>
                    <input
                      type="checkbox"
                      style={{
                        width: '18px',
                        height: '18px',
                        accentColor: '#4CAF50',
                        marginTop: '2px',
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{
                        color: '#ffffff',
                        fontSize: '16px',
                        fontWeight: '500',
                        margin: '0 0 4px 0',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        Update project documentation
                      </h3>
                      <p style={{
                        color: '#8b8b8b',
                        fontSize: '14px',
                        fontWeight: '400',
                        margin: '0 0 8px 0',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        Review and update API documentation
                      </p>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}>
                        <span style={{
                          background: '#ffd700',
                          color: '#000000',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                        }}>
                          OPTIONAL
                        </span>
                        <span style={{
                          color: '#8b8b8b',
                          fontSize: '12px',
                        }}>
                          Due tomorrow
                        </span>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      padding: '4px',
                      minWidth: '24px',
                      width: '24px',
                      flexShrink: 0,
                      alignSelf: 'center',
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: '#8b8b8b' }}>
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>

                  {/* Other Task 2 */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '8px',
                    padding: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}>
                    <input
                      type="checkbox"
                      style={{
                        width: '18px',
                        height: '18px',
                        accentColor: '#4CAF50',
                        marginTop: '2px',
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{
                        color: '#ffffff',
                        fontSize: '16px',
                        fontWeight: '500',
                        margin: '0 0 4px 0',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        Schedule client follow-up
                      </h3>
                      <p style={{
                        color: '#8b8b8b',
                        fontSize: '14px',
                        fontWeight: '400',
                        margin: '0 0 8px 0',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        Follow up on project proposal feedback
                      </p>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}>
                        <span style={{
                          background: '#ff8c00',
                          color: '#ffffff',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                        }}>
                          IMPORTANT
                        </span>
                        <span style={{
                          color: '#8b8b8b',
                          fontSize: '12px',
                        }}>
                          Due next week
                        </span>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      padding: '4px',
                      minWidth: '24px',
                      width: '24px',
                      flexShrink: 0,
                      alignSelf: 'center',
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: '#8b8b8b' }}>
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div>
            {/* Notes List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* COPIED Note 1 - Q4 Planning Meeting Notes */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '500',
                    margin: '0 0 4px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    Q4 Planning Meeting Notes
                  </h3>
                  <p style={{
                    color: '#8b8b8b',
                    fontSize: '14px',
                    fontWeight: '400',
                    margin: '0 0 8px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    Strategic objectives, budget allocations, team restructuring plans, and quarterly milestone reviews
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                  }}>
                    <span style={{
                      color: '#8b8b8b',
                      fontSize: '12px',
                      fontWeight: '400',
                    }}>
                      2h ago
                    </span>
                    <span style={{
                      background: '#3b82f6',
                      color: '#ffffff',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                    }}>
                      Meeting
                    </span>
                    <span style={{
                      background: '#8b5cf6',
                      color: '#ffffff',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                    }}>
                      Planning
                    </span>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '4px',
                  minWidth: '24px',
                  width: '24px',
                  flexShrink: 0,
                  alignSelf: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: '#8b8b8b' }}>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* COPIED Note 2 - Product Ideas Brainstorm */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '500',
                    margin: '0 0 4px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    Product Ideas Brainstorm
                  </h3>
                  <p style={{
                    color: '#8b8b8b',
                    fontSize: '14px',
                    fontWeight: '400',
                    margin: '0 0 8px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    Voice-first interface concepts, AI integration possibilities, user feedback analysis from recent surveys
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                  }}>
                    <span style={{
                      color: '#8b8b8b',
                      fontSize: '12px',
                      fontWeight: '400',
                    }}>
                      Yesterday
                    </span>
                    <span style={{
                      background: '#10b981',
                      color: '#ffffff',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                    }}>
                      Ideas
                    </span>
                    <span style={{
                      background: '#3b82f6',
                      color: '#ffffff',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                    }}>
                      Product
                    </span>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '4px',
                  minWidth: '24px',
                  width: '24px',
                  flexShrink: 0,
                  alignSelf: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: '#8b8b8b' }}>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* COPIED Note 3 - Research on Competitor Analysis */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '500',
                    margin: '0 0 4px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    Research on Competitor Analysis
                  </h3>
                  <p style={{
                    color: '#8b8b8b',
                    fontSize: '14px',
                    fontWeight: '400',
                    margin: '0 0 8px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    Market positioning studies, feature comparison matrices, pricing analysis, and user experience benchmarks
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                  }}>
                    <span style={{
                      color: '#8b8b8b',
                      fontSize: '12px',
                      fontWeight: '400',
                    }}>
                      3 days ago
                    </span>
                    <span style={{
                      background: '#f59e0b',
                      color: '#000000',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                    }}>
                      Research
                    </span>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '4px',
                  minWidth: '24px',
                  width: '24px',
                  flexShrink: 0,
                  alignSelf: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: '#8b8b8b' }}>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}





            </div>
          </div>
        </div>

        {/* Home Indicator */}
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '134px',
          height: '5px',
          background: '#ffffff',
          borderRadius: '3px',
          opacity: 0.3,
        }}></div>

        {/* Form Modal */}
      {activeForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}
        onClick={handleFormCancel}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#1a1a2e',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              scrollbarGutter: 'stable',
            }}
            className="consistent-scroll"
          >
            {activeForm === 'note' && <NoteFormComponent onSubmit={handleFormSubmit} onCancel={handleFormCancel} />}
            {activeForm === 'task' && <TaskFormComponent onSubmit={handleFormSubmit} onCancel={handleFormCancel} />}
            {activeForm === 'calendar' && <CalendarFormComponent onSubmit={handleFormSubmit} onCancel={handleFormCancel} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestVisualsPage;
