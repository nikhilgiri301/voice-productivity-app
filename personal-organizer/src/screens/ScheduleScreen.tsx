import React from 'react';
import { Card } from '@/components/common';

const ScheduleScreen: React.FC = () => {
  return (
    <div className='flex-1 p-screen-margin space-y-4'>
      {/* Screen Header */}
      <div className='text-center'>
        <h1 className='text-section-header text-text-primary mb-2'>Schedule</h1>
        <p className='text-secondary text-text-secondary'>
          Your meetings and appointments
        </p>
      </div>

      {/* Placeholder Content */}
      <div className='space-y-4'>
        <Card variant='glass' padding='md'>
          <div className='text-center py-8'>
            <div className='w-16 h-16 mx-auto mb-4 bg-context-work bg-opacity-20 rounded-full flex items-center justify-center'>
              <svg
                className='w-8 h-8 text-context-work'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                />
              </svg>
            </div>
            <h3 className='text-card-title text-text-primary mb-2'>
              Schedule Coming Soon
            </h3>
            <p className='text-body text-text-secondary'>
              Calendar integration and meeting management will be available in
              Phase 2.
            </p>
          </div>
        </Card>

        {/* Sample Schedule Items */}
        <div className='space-y-3'>
          <Card
            variant='glass'
            padding='md'
            className='border-l-4 border-context-work'
          >
            <div className='flex items-center justify-between'>
              <div>
                <h4 className='text-card-title text-text-primary'>
                  Team Standup
                </h4>
                <p className='text-secondary text-text-secondary'>
                  9:00 AM - 9:30 AM
                </p>
              </div>
              <div className='w-3 h-3 bg-context-work rounded-full'></div>
            </div>
          </Card>

          <Card
            variant='glass'
            padding='md'
            className='border-l-4 border-priority-important'
          >
            <div className='flex items-center justify-between'>
              <div>
                <h4 className='text-card-title text-text-primary'>
                  Client Presentation
                </h4>
                <p className='text-secondary text-text-secondary'>
                  2:00 PM - 3:00 PM
                </p>
              </div>
              <div className='w-3 h-3 bg-priority-important rounded-full'></div>
            </div>
          </Card>

          <Card
            variant='glass'
            padding='md'
            className='border-l-4 border-context-personal'
          >
            <div className='flex items-center justify-between'>
              <div>
                <h4 className='text-card-title text-text-primary'>
                  Gym Session
                </h4>
                <p className='text-secondary text-text-secondary'>
                  6:00 PM - 7:00 PM
                </p>
              </div>
              <div className='w-3 h-3 bg-context-personal rounded-full'></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScheduleScreen;
