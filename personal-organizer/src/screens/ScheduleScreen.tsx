import React, { useState, useMemo } from 'react';
import {
  DayNavigation,
  ScheduleFilters,
  TimeBlockLayout,
  type ScheduleFilterType,
  type EventData,
} from '@/components/schedule';
import { formatDate, isToday } from '@/utils/dates';

const ScheduleScreen: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState<ScheduleFilterType>('today');

  // Sample events data
  const sampleEvents: EventData[] = [
    {
      id: '1',
      title: 'Team Standup',
      description: 'Daily sync with the development team',
      startTime: new Date(2025, 6, 26, 9, 0), // 9:00 AM
      endTime: new Date(2025, 6, 26, 9, 30), // 9:30 AM
      location: 'Conference Room A',
      context: 'work',
      linkedItems: [
        { id: 't1', title: 'Review sprint progress', type: 'task' },
        { id: 't2', title: 'Update project timeline', type: 'task' },
      ],
    },
    {
      id: '2',
      title: 'Client Presentation',
      description: 'Present Q3 project deliverables to stakeholders',
      startTime: new Date(2025, 6, 26, 14, 0), // 2:00 PM
      endTime: new Date(2025, 6, 26, 15, 0), // 3:00 PM
      location: 'Main Conference Room',
      context: 'work',
      linkedItems: [
        { id: 'n1', title: 'Presentation slides', type: 'note' },
        { id: 't3', title: 'Prepare demo environment', type: 'task' },
        { id: 'n2', title: 'Client feedback notes', type: 'note' },
      ],
    },
    {
      id: '3',
      title: 'Gym Session',
      description: 'Strength training and cardio workout',
      startTime: new Date(2025, 6, 26, 18, 0), // 6:00 PM
      endTime: new Date(2025, 6, 26, 19, 0), // 7:00 PM
      location: 'Fitness Center',
      context: 'personal',
    },
    {
      id: '4',
      title: 'Coffee with Sarah',
      description: 'Catch up and discuss weekend plans',
      startTime: new Date(2025, 6, 26, 10, 30), // 10:30 AM
      endTime: new Date(2025, 6, 26, 11, 30), // 11:30 AM
      location: 'Local Coffee Shop',
      context: 'personal',
      linkedItems: [
        { id: 'n3', title: 'Weekend trip ideas', type: 'note' },
      ],
    },
  ];

  const handleDateChange = (date: Date): void => {
    setCurrentDate(date);
  };

  // Get formatted date for display
  const formattedDate = useMemo(() => {
    return formatDate(currentDate, 'long');
  }, [currentDate]);

  // Check if current date is today for special styling
  const isCurrentDateToday = useMemo(() => {
    return isToday(currentDate);
  }, [currentDate]);

  const handleFilterChange = (filter: ScheduleFilterType): void => {
    setActiveFilter(filter);
  };

  const handleEventClick = (event: EventData): void => {
    // Event click handler - will be implemented in Phase 3
    console.log('Event clicked:', event.title);
  };

  return (
    <div className='flex-1 p-screen-margin space-y-4'>
      {/* Screen Header */}
      <div className='text-center mb-6'>
        <h1 className='text-section-header text-text-primary mb-2'>Schedule</h1>
        <p className='text-secondary text-text-secondary mb-1'>
          Your meetings and appointments
        </p>
        <p className={`text-micro font-medium ${
          isCurrentDateToday ? 'text-accent' : 'text-text-secondary'
        }`}>
          {isCurrentDateToday ? 'Today • ' : ''}{formattedDate}
        </p>
      </div>

      {/* Day Navigation */}
      <DayNavigation
        currentDate={currentDate}
        onDateChange={handleDateChange}
      />

      {/* Schedule Filters */}
      <ScheduleFilters
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      {/* Events Timeline */}
      <TimeBlockLayout
        events={sampleEvents}
        onEventClick={handleEventClick}
      />
    </div>
  );
};

export default ScheduleScreen;
