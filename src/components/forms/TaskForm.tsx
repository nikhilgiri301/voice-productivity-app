import React, { useState } from 'react';
import { TaskFormData, Priority } from '../../types';
import { CheckSquare, Calendar, AlertCircle } from 'lucide-react';

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  initialData?: Partial<TaskFormData>;
  isLoading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onCancel,
  initialData = {},
  isLoading = false
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: initialData.title || '',
    description: initialData.description || '',
    due_date: initialData.due_date || '',
    priority: initialData.priority || 'medium'
  });

  const [errors, setErrors] = useState<Partial<TaskFormData>>({});
  const [showDueDate, setShowDueDate] = useState<boolean>(!!initialData.due_date);
  const [showDueTime, setShowDueTime] = useState<boolean>(!!initialData.due_date && initialData.due_date.includes('T'));
  const [eodOption, setEodOption] = useState<'eod' | 'cob' | 'custom'>('eod');
  const [dueDate, setDueDate] = useState<string>(
    initialData.due_date ? initialData.due_date.split('T')[0] : ''
  );
  const [dueTime, setDueTime] = useState<string>(
    initialData.due_date && initialData.due_date.includes('T')
      ? initialData.due_date.split('T')[1].substring(0, 5)
      : '17:00'
  );

  const validateForm = (): boolean => {
    const newErrors: Partial<TaskFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Construct due_date based on selections
      let finalDueDate = '';

      if (showDueDate && dueDate) {
        if (showDueTime) {
          // Both date and time specified
          finalDueDate = `${dueDate}T${dueTime}:00`;
        } else {
          // Only date specified - use EOD/COB
          const endTime = eodOption === 'cob' ? '18:00:00' : '23:59:00';
          finalDueDate = `${dueDate}T${endTime}`;
        }
      } else if (showDueTime) {
        // Only time specified - use today's date
        const today = new Date().toISOString().split('T')[0];
        finalDueDate = `${today}T${dueTime}:00`;
      }

      // Convert to ISO string if we have a date
      if (finalDueDate) {
        const localDate = new Date(finalDueDate);
        finalDueDate = localDate.toISOString();
      }

      const submitData = {
        ...formData,
        due_date: finalDueDate
      };

      console.log('📋 Task submission:', {
        showDueDate,
        showDueTime,
        dueDate,
        dueTime,
        eodOption,
        finalDueDate: submitData.due_date
      });

      onSubmit(submitData);
    }
  };

  const handleInputChange = (field: keyof TaskFormData, value: string | Priority) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'text-ios-red bg-ios-red';
      case 'medium': return 'text-ios-orange bg-ios-orange';
      case 'low': return 'text-ios-green bg-ios-green';
      default: return 'text-ios-gray-500 bg-ios-gray-500';
    }
  };

  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4" />;
      case 'medium': return <AlertCircle className="w-4 h-4" />;
      case 'low': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="ios-card p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-ios-green bg-opacity-20 rounded-ios">
            <CheckSquare className="w-5 h-5 text-ios-green" />
          </div>
          <h2 className="text-xl font-semibold text-white">
            {initialData.title ? 'Edit Task' : 'New Task'} <span className="text-xs text-ios-green">(Optimized)</span>
          </h2>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-ios transition-colors"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
            Task Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`ios-input ${errors.title ? 'border-ios-red focus:ring-ios-red' : ''}`}
            placeholder="Enter task title"
            disabled={isLoading}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-ios-red">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="ios-input resize-none"
            rows={3}
            placeholder="Add task description (optional)"
            disabled={isLoading}
          />
        </div>

        {/* Independent Date & Time Controls */}
        <div className="space-y-4">
          {/* Date Control */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-white">
                <Calendar className="w-4 h-4 inline mr-1" />
                Due Date
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowDueDate(!showDueDate);
                  if (!showDueDate) setDueDate('');
                }}
                className={`px-3 py-1 text-xs rounded-ios transition-colors ${
                  showDueDate
                    ? 'bg-ios-blue text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {showDueDate ? 'Remove Date' : 'Add Date'}
              </button>
            </div>

            {showDueDate && (
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="ios-input"
                disabled={isLoading}
              />
            )}
          </div>

          {/* Time Control */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-white">
                🕐 Due Time
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowDueTime(!showDueTime);
                  if (!showDueTime) setDueTime('17:00');
                }}
                className={`px-3 py-1 text-xs rounded-ios transition-colors ${
                  showDueTime
                    ? 'bg-ios-green text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {showDueTime ? 'Remove Time' : 'Add Time'}
              </button>
            </div>

            {showDueTime && (
              <div className="space-y-3">
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="ios-input"
                  disabled={isLoading}
                />

                {/* EOD/COB Options (only show if date is set but time is not) */}
                {showDueDate && !showDueTime && (
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Or use preset:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setEodOption('eod')}
                        className={`p-2 text-xs rounded-ios transition-colors ${
                          eodOption === 'eod'
                            ? 'bg-ios-purple text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        EOD (11:59 PM)
                      </button>
                      <button
                        type="button"
                        onClick={() => setEodOption('cob')}
                        className={`p-2 text-xs rounded-ios transition-colors ${
                          eodOption === 'cob'
                            ? 'bg-ios-purple text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        COB (6:00 PM)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Status Display */}
          <div className="p-3 bg-gray-700 rounded-ios">
            <p className="text-sm text-gray-300">
              {!showDueDate && !showDueTime && '📝 No deadline - complete anytime'}
              {showDueDate && !showDueTime && `📅 Due by ${eodOption === 'cob' ? 'COB' : 'EOD'} on ${dueDate || 'selected date'}`}
              {!showDueDate && showDueTime && `⏰ Due today at ${dueTime}`}
              {showDueDate && showDueTime && `📅⏰ Due ${dueDate} at ${dueTime}`}
            </p>
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-white mb-3">
            Priority Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['high', 'medium', 'low'] as Priority[]).map((priority) => (
              <button
                key={priority}
                type="button"
                onClick={() => handleInputChange('priority', priority)}
                className={`
                  p-3 rounded-ios border-2 transition-all duration-200 flex flex-col items-center gap-2
                  ${formData.priority === priority 
                    ? `border-current ${getPriorityColor(priority)} bg-opacity-10` 
                    : 'border-ios-gray-200 text-ios-gray-600 hover:border-ios-gray-300'
                  }
                `}
                disabled={isLoading}
              >
                <div className={`${formData.priority === priority ? '' : 'text-ios-gray-400'}`}>
                  {getPriorityIcon(priority)}
                </div>
                <span className="text-sm font-medium capitalize">
                  {priority}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-4 border border-ios-gray-300 rounded-ios text-ios-gray-700 font-medium hover:bg-ios-gray-50 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 ios-button disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : (initialData.title ? 'Update Task' : 'Create Task')}
          </button>
        </div>
      </form>
    </div>
  );
};
