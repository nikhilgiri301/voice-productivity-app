import React, { useState } from 'react';
import { CalendarFormData } from '../../types';
import { Calendar, Clock, MapPin, Users, Plus, Minus } from 'lucide-react';

interface CalendarFormProps {
  onSubmit: (data: CalendarFormData) => void;
  onCancel: () => void;
  initialData?: Partial<CalendarFormData>;
  isLoading?: boolean;
  hideButtons?: boolean;
}

export const CalendarForm: React.FC<CalendarFormProps> = ({
  onSubmit,
  onCancel,
  initialData = {},
  isLoading = false,
  hideButtons = false
}) => {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<CalendarFormData>({
    title: initialData.title || '',
    description: initialData.description || '',
    start_time: initialData.start_time || '',
    end_time: initialData.end_time || '',
    location: initialData.location || '',
    attendees: initialData.attendees || ''
  });

  const [errors, setErrors] = useState<Partial<CalendarFormData>>({});
  const [selectedDate, setSelectedDate] = useState(today);
  const [startHour, setStartHour] = useState('09');
  const [startMinute, setStartMinute] = useState('00');
  const [duration, setDuration] = useState(60); // minutes

  const validateForm = (): boolean => {
    const newErrors: Partial<CalendarFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.start_time) {
      newErrors.start_time = 'Start time is required';
    }

    if (!formData.end_time) {
      newErrors.end_time = 'End time is required';
    }

    if (formData.start_time && formData.end_time) {
      const startDate = new Date(formData.start_time);
      const endDate = new Date(formData.end_time);
      
      if (endDate <= startDate) {
        newErrors.end_time = 'End time must be after start time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Parse date components properly to avoid timezone conversion issues
      const [year, month, day] = selectedDate.split('-').map(Number);
      const hour = parseInt(startHour);
      const minute = parseInt(startMinute);

      // Create date in local timezone
      const startDate = new Date(year, month - 1, day, hour, minute);
      const endDate = new Date(startDate.getTime() + duration * 60000);

      const submitData = {
        ...formData,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString()
      };

      console.log('🕐 Timezone Debug:', {
        userInput: `${startHour}:${startMinute}`,
        selectedDate: selectedDate,
        localDate: startDate.toString(),
        isoString: startDate.toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezoneOffset: startDate.getTimezoneOffset()
      });

      onSubmit(submitData);
    }
  };

  const handleInputChange = (field: keyof CalendarFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Update start and end times based on date, time, and duration (LOCAL TIME)
  const updateTimes = () => {
    // Create local datetime string for form input (this stays local for display)
    const startDateTime = `${selectedDate}T${startHour}:${startMinute}`;
    const endDateTime = new Date(new Date(startDateTime).getTime() + duration * 60000);

    // Format end time for datetime-local input (local time for form display)
    const endDateTimeString = endDateTime.getFullYear() + '-' +
      String(endDateTime.getMonth() + 1).padStart(2, '0') + '-' +
      String(endDateTime.getDate()).padStart(2, '0') + 'T' +
      String(endDateTime.getHours()).padStart(2, '0') + ':' +
      String(endDateTime.getMinutes()).padStart(2, '0');

    setFormData(prev => ({
      ...prev,
      start_time: startDateTime,
      end_time: endDateTimeString
    }));

    console.log('Time updated:', {
      selectedTime: `${startHour}:${startMinute}`,
      localDateTime: startDateTime,
      userTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
  };

  // Update times whenever date, time, or duration changes
  React.useEffect(() => {
    updateTimes();
  }, [selectedDate, startHour, startMinute, duration]);

  // Simplified duration options
  const quickDurationOptions = [
    { label: '15m', value: 15 },
    { label: '30m', value: 30 },
    { label: '45m', value: 45 },
    { label: '1h', value: 60 }
  ];

  // Time buckets for intuitive selection - UPDATED VERSION 2.0
  const timeBuckets = [
    { label: 'Morning', times: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'] },
    { label: 'Afternoon', times: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'] },
    { label: 'Evening', times: ['16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'] },
    { label: 'Night', times: ['20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'] }
  ];

  const [selectedTimeBucket, setSelectedTimeBucket] = useState<string>('Morning');

  return (
    <div className="ios-card p-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-ios-blue bg-opacity-20 rounded-ios">
          <Calendar className="w-5 h-5 text-ios-blue" />
        </div>
        <h2 className="text-xl font-semibold text-white">
          {initialData.title ? 'Edit Event' : 'New Calendar Event'} <span className="text-xs text-ios-blue">(v2.0)</span>
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
            Event Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`ios-input ${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Enter event title"
            disabled={isLoading}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-400">{errors.title}</p>
          )}
        </div>

        {/* Quick Date Selection */}
        <div>
          <label className="block text-sm font-medium text-white mb-3">
            Date *
          </label>
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => setSelectedDate(today)}
              className={`px-4 py-2 rounded-ios font-medium transition-all ${
                selectedDate === today
                  ? 'bg-ios-blue text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                setSelectedDate(tomorrow.toISOString().split('T')[0]);
              }}
              className={`px-4 py-2 rounded-ios font-medium transition-all ${
                selectedDate === new Date(Date.now() + 86400000).toISOString().split('T')[0]
                  ? 'bg-ios-blue text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Tomorrow
            </button>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="ios-input"
            disabled={isLoading}
          />
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
            placeholder="Add event description (optional)"
            disabled={isLoading}
          />
        </div>

        {/* Intuitive Time Selection */}
        <div>
          <label className="block text-sm font-medium text-white mb-3">
            <Clock className="w-4 h-4 inline mr-1" />
            Start Time *
          </label>

          {/* Time Bucket Selection */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {timeBuckets.map((bucket) => (
              <button
                key={bucket.label}
                type="button"
                onClick={() => setSelectedTimeBucket(bucket.label)}
                className={`px-3 py-2 text-sm rounded-ios font-medium transition-all ${
                  selectedTimeBucket === bucket.label
                    ? 'bg-ios-blue text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {bucket.label}
              </button>
            ))}
          </div>

          {/* Time Options for Selected Bucket */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {timeBuckets
              .find(bucket => bucket.label === selectedTimeBucket)
              ?.times.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => {
                    const [hour, minute] = time.split(':');
                    setStartHour(hour);
                    setStartMinute(minute);
                  }}
                  className={`px-3 py-2 text-sm rounded-ios font-medium transition-all ${
                    `${startHour}:${startMinute}` === time
                      ? 'bg-ios-green text-white'
                      : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                  }`}
                >
                  {time}
                </button>
              ))}
          </div>

          {/* Manual Time Input */}
          <div className="flex gap-2 items-center">
            <span className="text-gray-300 text-sm">Custom:</span>
            <input
              type="number"
              min="0"
              max="23"
              value={startHour}
              onChange={(e) => setStartHour(e.target.value.padStart(2, '0'))}
              className="ios-input w-20 text-center"
              placeholder="HH"
            />
            <span className="text-white">:</span>
            <input
              type="number"
              min="0"
              max="59"
              step="15"
              value={startMinute}
              onChange={(e) => setStartMinute(e.target.value.padStart(2, '0'))}
              className="ios-input w-20 text-center"
              placeholder="MM"
            />
          </div>
        </div>

        {/* Simplified Duration Selection */}
        <div>
          <label className="block text-sm font-medium text-white mb-3">
            Duration *
          </label>

          {/* Quick Duration Buttons */}
          <div className="flex gap-2 mb-4">
            {quickDurationOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setDuration(option.value)}
                className={`px-4 py-2 rounded-ios font-medium transition-all ${
                  duration === option.value
                    ? 'bg-ios-blue text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Plus/Minus for longer durations (only show if duration > 1 hour) */}
          {duration >= 60 && (
            <div className="flex items-center gap-3 bg-gray-700 rounded-ios p-3">
              <span className="text-gray-300 text-sm">Custom duration:</span>
              <button
                type="button"
                onClick={() => setDuration(Math.max(60, duration - 60))}
                className="p-2 bg-gray-600 text-gray-300 rounded-ios hover:bg-gray-500"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-white min-w-[100px] text-center font-medium">
                {duration >= 60 ? `${Math.floor(duration / 60)}h ${duration % 60 > 0 ? `${duration % 60}m` : ''}` : `${duration}m`}
              </span>
              <button
                type="button"
                onClick={() => setDuration(duration + 60)}
                className="p-2 bg-gray-600 text-gray-300 rounded-ios hover:bg-gray-500"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-white mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Location
          </label>
          <input
            type="text"
            id="location"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="ios-input"
            placeholder="Add location (optional)"
            disabled={isLoading}
          />
        </div>

        {/* Attendees */}
        <div>
          <label htmlFor="attendees" className="block text-sm font-medium text-white mb-2">
            <Users className="w-4 h-4 inline mr-1" />
            Attendees
          </label>
          <input
            type="text"
            id="attendees"
            value={formData.attendees}
            onChange={(e) => handleInputChange('attendees', e.target.value)}
            className="ios-input"
            placeholder="Enter email addresses, separated by commas"
            disabled={isLoading}
          />
          <p className="mt-1 text-xs text-ios-gray-500">
            Separate multiple attendees with commas
          </p>
        </div>

        {/* Action Buttons */}
        {!hideButtons && (
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
              {isLoading ? 'Saving...' : (initialData.title ? 'Update Event' : 'Create Event')}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
