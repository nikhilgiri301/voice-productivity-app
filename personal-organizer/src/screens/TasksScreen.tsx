import React from 'react';
import { Card, Chip } from '@/components/common';

const TasksScreen: React.FC = () => {
  return (
    <div className='flex-1 p-screen-margin space-y-4'>
      {/* Screen Header */}
      <div className='text-center'>
        <h1 className='text-section-header text-text-primary mb-2'>Tasks</h1>
        <p className='text-secondary text-text-secondary'>
          Your to-dos and action items
        </p>
      </div>

      {/* Filter Chips */}
      <div className='flex gap-2 overflow-x-auto pb-2'>
        <Chip variant='filter' active>
          All
        </Chip>
        <Chip variant='filter'>Today</Chip>
        <Chip variant='filter'>Urgent</Chip>
        <Chip variant='filter'>Work</Chip>
        <Chip variant='filter'>Personal</Chip>
      </div>

      {/* Placeholder Content */}
      <div className='space-y-4'>
        <Card variant='glass' padding='md'>
          <div className='text-center py-8'>
            <div className='w-16 h-16 mx-auto mb-4 bg-accent bg-opacity-20 rounded-full flex items-center justify-center'>
              <svg
                className='w-8 h-8 text-accent'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
                />
              </svg>
            </div>
            <h3 className='text-card-title text-text-primary mb-2'>
              Task Management Coming Soon
            </h3>
            <p className='text-body text-text-secondary'>
              Full task management with priorities and contexts will be
              available in Phase 2.
            </p>
          </div>
        </Card>

        {/* Sample Task Items */}
        <div className='space-y-3'>
          <Card variant='glass' padding='md'>
            <div className='flex items-start gap-3'>
              <div className='w-5 h-5 mt-0.5 border-2 border-accent rounded'></div>
              <div className='flex-1'>
                <h4 className='text-card-title text-text-primary'>
                  Review project proposal
                </h4>
                <p className='text-secondary text-text-secondary mb-2'>
                  Due today
                </p>
                <div className='flex gap-2'>
                  <Chip variant='priority' color='urgent' size='sm'>
                    Urgent
                  </Chip>
                  <Chip variant='context' color='work' size='sm'>
                    Work
                  </Chip>
                </div>
              </div>
            </div>
          </Card>

          <Card variant='glass' padding='md'>
            <div className='flex items-start gap-3'>
              <div className='w-5 h-5 mt-0.5 border-2 border-text-secondary rounded'></div>
              <div className='flex-1'>
                <h4 className='text-card-title text-text-primary'>
                  Call dentist for appointment
                </h4>
                <p className='text-secondary text-text-secondary mb-2'>
                  This week
                </p>
                <div className='flex gap-2'>
                  <Chip variant='priority' color='important' size='sm'>
                    Important
                  </Chip>
                  <Chip variant='context' color='personal' size='sm'>
                    Personal
                  </Chip>
                </div>
              </div>
            </div>
          </Card>

          <Card variant='glass' padding='md'>
            <div className='flex items-start gap-3'>
              <div className='w-5 h-5 mt-0.5 bg-accent rounded flex items-center justify-center'>
                <svg
                  className='w-3 h-3 text-white'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div className='flex-1'>
                <h4 className='text-card-title text-text-primary line-through opacity-60'>
                  Update portfolio website
                </h4>
                <p className='text-secondary text-text-secondary mb-2'>
                  Completed yesterday
                </p>
                <div className='flex gap-2'>
                  <Chip variant='priority' color='optional' size='sm'>
                    Optional
                  </Chip>
                  <Chip variant='context' color='personal' size='sm'>
                    Personal
                  </Chip>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TasksScreen;
