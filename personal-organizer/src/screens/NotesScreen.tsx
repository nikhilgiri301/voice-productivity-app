import React from 'react';
import { Card, Chip } from '@/components/common';

const NotesScreen: React.FC = () => {
  return (
    <div className='flex-1 p-screen-margin space-y-4'>
      {/* Screen Header */}
      <div className='text-center'>
        <h1 className='text-section-header text-text-primary mb-2'>Notes</h1>
        <p className='text-secondary text-text-secondary'>
          Your thoughts and meeting notes
        </p>
      </div>

      {/* Filter Chips */}
      <div className='flex gap-2 overflow-x-auto pb-2'>
        <Chip variant='filter' active>
          All Notes
        </Chip>
        <Chip variant='filter'>Recent</Chip>
        <Chip variant='filter'>Meeting Notes</Chip>
        <Chip variant='filter'>Ideas</Chip>
        <Chip variant='filter'>Work</Chip>
      </div>

      {/* Placeholder Content */}
      <div className='space-y-4'>
        <Card variant='glass' padding='md'>
          <div className='text-center py-8'>
            <div className='w-16 h-16 mx-auto mb-4 bg-priority-optional bg-opacity-20 rounded-full flex items-center justify-center'>
              <svg
                className='w-8 h-8 text-priority-optional'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                />
              </svg>
            </div>
            <h3 className='text-card-title text-text-primary mb-2'>
              Note Taking Coming Soon
            </h3>
            <p className='text-body text-text-secondary'>
              Voice-to-text notes and smart organization will be available in
              Phase 2.
            </p>
          </div>
        </Card>

        {/* Sample Note Items */}
        <div className='space-y-3'>
          <Card variant='glass' padding='md'>
            <div className='space-y-3'>
              <div className='flex items-start justify-between'>
                <h4 className='text-card-title text-text-primary'>
                  Project Kickoff Meeting
                </h4>
                <p className='text-micro text-text-secondary'>2 hours ago</p>
              </div>
              <p className='text-body text-text-secondary'>
                Discussed project timeline, key milestones, and team
                responsibilities. Next steps: finalize requirements document and
                set up development environment.
              </p>
              <div className='flex gap-2'>
                <Chip variant='tag' size='sm'>
                  Meeting Notes
                </Chip>
                <Chip variant='context' color='work' size='sm'>
                  Work
                </Chip>
              </div>
            </div>
          </Card>

          <Card variant='glass' padding='md'>
            <div className='space-y-3'>
              <div className='flex items-start justify-between'>
                <h4 className='text-card-title text-text-primary'>
                  App Feature Ideas
                </h4>
                <p className='text-micro text-text-secondary'>Yesterday</p>
              </div>
              <p className='text-body text-text-secondary'>
                • Voice command shortcuts for common actions • Smart scheduling
                based on energy levels • Integration with calendar apps •
                Offline mode for notes
              </p>
              <div className='flex gap-2'>
                <Chip variant='tag' size='sm'>
                  Ideas
                </Chip>
                <Chip variant='context' color='personal' size='sm'>
                  Personal
                </Chip>
              </div>
            </div>
          </Card>

          <Card variant='glass' padding='md'>
            <div className='space-y-3'>
              <div className='flex items-start justify-between'>
                <h4 className='text-card-title text-text-primary'>
                  Weekly Review
                </h4>
                <p className='text-micro text-text-secondary'>3 days ago</p>
              </div>
              <p className='text-body text-text-secondary'>
                Completed 8 out of 10 planned tasks this week. Need to improve
                time estimation for complex projects. Focus areas for next week:
                client presentations and code reviews.
              </p>
              <div className='flex gap-2'>
                <Chip variant='tag' size='sm'>
                  Review
                </Chip>
                <Chip variant='context' color='work' size='sm'>
                  Work
                </Chip>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotesScreen;
