import React from 'react';
import TaskCardV2, { type TaskV2 } from '@/components/tasks-v2/TaskCardV2';
import FiltersV2, { type FilterId } from '@/components/tasks-v2/FiltersV2';
import SwipeListV2 from '@/components/tasks-v2/SwipeListV2';

const demo: TaskV2[] = [
  {
    id: 't1',
    title: 'Review project proposal',
    description: 'Tighten scope, call out risks, and propose milestones for delivery.',
    state: 'in-progress',
    priority: 'urgent',
    context: 'work',
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // overdue
    tags: ['review', 'project'],
    linked: { events: 1, notes: 2 },
  },
  {
    id: 't2',
    title: 'Plan weekend trip',
    description: 'Shortlist places and check travel times; keep it minimal.',
    state: 'not-started',
    priority: 'important',
    context: 'personal',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    tags: ['family', 'travel', 'budget', 'itinerary'],
    linked: { notes: 1 },
  },
  {
    id: 't3',
    title: 'Migrate analytics',
    description: 'Move events to the new schema and verify dashboards.',
    state: 'completed',
    priority: 'optional',
    context: 'work',
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
    tags: ['analytics'],
  },
];

const TasksBetaScreen: React.FC = () => {
  const [active, setActive] = React.useState<FilterId>('all');

  const filtered = React.useMemo(() => {
    if (active === 'all' || active === 'view') return demo;
    return demo.filter(t => t.priority === active);
  }, [active]);

  const counts = React.useMemo(() => ({
    all: demo.length,
    urgent: demo.filter(t => t.priority === 'urgent').length,
    important: demo.filter(t => t.priority === 'important').length,
    optional: demo.filter(t => t.priority === 'optional').length,
  }), []);

  return (
    <div className='flex-1 p-screen-margin space-y-4'>
      <div className='text-center mb-6'>
        <h1 className='text-section-header text-text-primary mb-2'>Tasks (Beta)</h1>
        <p className='text-secondary text-text-secondary'>
          Clean, modern, and informative—built fresh to iterate visuals quickly.
        </p>
      </div>

      <FiltersV2 active={active} onChange={setActive} counts={counts} />

      {/* Active tasks (clean list) */}
      <div className='space-y-3'>
        {filtered.filter(t => t.state !== 'completed').map(t => (
          <TaskCardV2 key={t.id} task={t} />
        ))}
      </div>

      {/* Completed (collapsed) */}
      {filtered.some(t => t.state === 'completed') && (
        <details className='mt-4'>
          <summary className='text-text-secondary text-[13px] cursor-pointer select-none'>
            Completed ({filtered.filter(t => t.state === 'completed').length})
          </summary>
          <div className='mt-2 space-y-3'>
            {filtered.filter(t => t.state === 'completed').map(t => (
              <TaskCardV2 key={t.id} task={t} />
            ))}
          </div>
        </details>
      )}
    </div>
  );
};

export default TasksBetaScreen;

