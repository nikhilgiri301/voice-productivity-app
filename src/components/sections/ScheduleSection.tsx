import React, { useState, useEffect } from 'react';
import BaseSection from './BaseSection';
import { ScheduleHeader, EventList } from '../schedule';

interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  location?: string;
  type: 'meeting' | 'personal' | 'travel' | 'work';
  priority: 'high' | 'medium' | 'low';
  status: 'upcoming' | 'current' | 'completed' | 'cancelled';
  linkedItems?: LinkedItem[];
  attendees?: string[];
  isRecurring?: boolean;
  reminderMinutes?: number;
  date: string;
}

interface LinkedItem {
  id: string;
  type: 'task' | 'note';
  title: string;
  status?: 'completed' | 'pending';
}

export const ScheduleSection: React.FC = () => {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const mockEvents: ScheduleEvent[] = [
      {
        id: '1',
        title: 'Team Meeting',
        description: 'Weekly team sync',
        startTime: '10:00 AM',
        endTime: '11:00 AM',
        duration: 60,
        location: 'Conference Room A',
        type: 'meeting',
        priority: 'high',
        status: 'upcoming',
        date: today,
        attendees: ['John Doe', 'Jane Smith'],
        linkedItems: [
          { id: 't1', type: 'task', title: 'Prepare meeting agenda', status: 'completed' },
          { id: 'n1', type: 'note', title: 'Meeting notes template' },
        ],
      },
      {
        id: '2',
        title: 'Lunch with Client',
        description: 'Discuss project requirements',
        startTime: '12:30 PM',
        endTime: '1:30 PM',
        duration: 60,
        location: 'Downtown Restaurant',
        type: 'meeting',
        priority: 'medium',
        status: 'upcoming',
        date: today,
        attendees: ['Client Name'],
      },
      {
        id: '3',
        title: 'Gym Session',
        startTime: '6:00 PM',
        endTime: '7:00 PM',
        duration: 60,
        location: 'Local Gym',
        type: 'personal',
        priority: 'low',
        status: 'upcoming',
        date: today,
      },
      {
        id: '4',
        title: 'Code Review',
        description: 'Review pull requests',
        startTime: '2:00 PM',
        endTime: '3:00 PM',
        duration: 60,
        type: 'work',
        priority: 'high',
        status: 'current',
        date: today,
        linkedItems: [
          { id: 't2', type: 'task', title: 'Review PR #123', status: 'pending' },
          { id: 't3', type: 'task', title: 'Review PR #124', status: 'pending' },
        ],
      },
    ];
    setEvents(mockEvents);
  }, [currentDate]);

  const handleSectionEnter = () => {
    console.log('Schedule section entered');
    // Refresh events or perform other actions
  };

  const handleSectionExit = () => {
    console.log('Schedule section exited');
  };

  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
    // In a real app, you would fetch events for the new date
  };

  const handleEventEdit = (event: ScheduleEvent) => {
    console.log('Edit event:', event);
    // Open edit modal or navigate to edit page
  };

  const handleEventDelete = (eventId: string) => {
    console.log('Delete event:', eventId);
    setEvents(events.filter(e => e.id !== eventId));
  };

  const handleEventStatusChange = (eventId: string, status: 'upcoming' | 'current' | 'completed' | 'cancelled') => {
    console.log('Change event status:', eventId, status);
    setEvents(events.map(e => e.id === eventId ? { ...e, status } : e));
  };

  const handleFilterChange = (filters: any) => {
    console.log('Filter change:', filters);
    // Apply filters to events
  };

  const handleRefresh = async () => {
    console.log('Refreshing events...');
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  return (
    <BaseSection
      tabType="schedule"
      onEnter={handleSectionEnter}
      onExit={handleSectionExit}
    >
      {/* Schedule Header with Navigation and Filters */}
      <ScheduleHeader
        currentDate={currentDate}
        onDateChange={handleDateChange}
        onFilterChange={handleFilterChange}
        style={{ marginBottom: '24px' }}
      />

      {/* Events List */}
      <EventList
        events={events}
        onEventEdit={handleEventEdit}
        onEventDelete={handleEventDelete}
        onEventStatusChange={handleEventStatusChange}
        onRefresh={handleRefresh}
        loading={loading}
        hasMore={false}
        enablePullToRefresh={true}
        groupByTime={true}
        style={{
          height: 'calc(100vh - 200px)', // Adjust based on header height
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-primary)',
          backdropFilter: 'blur(20px)',
        }}
      />
    </BaseSection>
  );
};

export default ScheduleSection;
