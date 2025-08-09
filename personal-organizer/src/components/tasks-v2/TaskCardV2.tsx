import React from 'react';

export interface LinkedCount {
  events?: number;
  tasks?: number;
  notes?: number;
}

export type PriorityV2 = 'urgent' | 'important' | 'optional';
export type StateV2 = 'not-started' | 'in-progress' | 'blocked' | 'deferred' | 'cancelled' | 'completed';
export type ContextV2 = 'work' | 'personal';

export interface TaskV2 {
  id: string;
  title: string;
  description?: string;
  state: StateV2;
  priority: PriorityV2;
  context: ContextV2;
  dueDate?: Date;
  tags?: string[];
  linked?: LinkedCount;
}

interface TaskCardV2Props {
  task: TaskV2;
}

const StateIcon: React.FC<{ state: StateV2 }> = ({ state }) => {
  const common = 'w-4 h-4 text-text-secondary';
  switch (state) {
    case 'in-progress':
      return (
        <svg className={common} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
          <circle cx='12' cy='12' r='9' className='opacity-40' />
          <path d='M12 7v5l3 2' />
        </svg>
      );
    case 'blocked':
      return (
        <svg className={common} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
          <circle cx='12' cy='12' r='9' className='opacity-40' />
          <path d='M8 8l8 8M16 8l-8 8' />
        </svg>
      );
    case 'completed':
      return (
        <svg className={common} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
          <circle cx='12' cy='12' r='9' className='opacity-40' />
          <path d='M8 12l2.5 2.5L16 9' />
        </svg>
      );
    default:
      return (
        <svg className={common} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
          <circle cx='12' cy='12' r='9' className='opacity-40' />
        </svg>
      );
  }
};

const formatDue = (d?: Date): { text: string; tone: 'default' | 'soon' | 'overdue' } => {
  if (!d) return { text: 'No due', tone: 'default' };
  const now = new Date();
  const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { text: `${Math.abs(diffDays)}d overdue`, tone: 'overdue' };
  if (diffDays <= 2) return { text: `due in ${diffDays}d`, tone: 'soon' };
  return { text: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), tone: 'default' };
};

const PriorityPill: React.FC<{ p: PriorityV2 }> = ({ p }) => {
  const map: Record<PriorityV2, string> = {
    urgent: 'text-red-300 bg-red-500/15',
    important: 'text-orange-300 bg-orange-500/15',
    optional: 'text-yellow-300 bg-yellow-500/15',
  };
  const label = p === 'urgent' ? 'Urgent' : p === 'important' ? 'Important' : 'Optional';
  return <span className={`px-2.5 py-1 rounded-full text-[12px] font-medium ${map[p]}`}>{label}</span>;
};

const MetaChip: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 text-text-secondary text-[11px]'>
    {icon}
    {label}
  </span>
);

const TaskCardV2: React.FC<TaskCardV2Props> = ({ task }) => {
  const { text: dueText, tone } = formatDue(task.dueDate);
  const leftBorder = task.context === 'work' ? 'before:bg-blue-400' : 'before:bg-green-400';
  const isCompleted = task.state === 'completed';

  const container = [
    'relative',
    'rounded-xl',
    'bg-surface-secondary/50',
    'border border-white/8',
    'p-5',
    'transition-all duration-200',
    'hover:bg-surface-secondary/70',
    'active:scale-[0.99]',
    'before:absolute before:inset-y-3 before:left-0 before:w-[2px] before:rounded-full',
    leftBorder,
    isCompleted ? 'opacity-50' : 'opacity-100',
  ].join(' ');

  const dueTone = tone === 'overdue' ? 'text-red-300' : tone === 'soon' ? 'text-amber-300' : 'text-text-secondary';

  // Tags (quiet, single line)
  const tags = (task.tags || []).slice(0, 3);
  const extra = (task.tags || []).length - tags.length;

  return (
    <div className={container} role='button' aria-label={`Task ${task.title}`}>
      {/* ROW 1: Icon + Title + Priority */}
      <div className='flex items-start gap-3 mb-2'>
        <div className='flex-shrink-0 mt-0.5'>
          <StateIcon state={task.state} />
        </div>
        <div className='flex-1 min-w-0'>
          <h3 className='text-[17px] font-medium text-text-primary leading-[1.3] truncate'>
            {task.title}
          </h3>
        </div>
        {!isCompleted && (
          <div className='flex-shrink-0'>
            <PriorityPill p={task.priority} />
          </div>
        )}
      </div>

      {/* ROW 2: Description */}
      {task.description && (
        <div className='mb-3 pl-6'>
          <p className='text-[14px] text-text-secondary/85 leading-[1.4] line-clamp-2'>
            {task.description}
          </p>
        </div>
      )}

      {/* ROW 3: Metadata */}
      <div className='flex items-center justify-between gap-4 pl-6 text-[12px]'>
        {/* Left: Due status */}
        <div className='flex items-center gap-1.5 min-w-0'>
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
            tone === 'overdue' ? 'bg-red-400' :
            tone === 'soon' ? 'bg-amber-400' :
            'bg-white/25'
          }`} />
          <span className={`truncate ${dueTone}`}>{dueText}</span>
        </div>

        {/* Center: Links */}
        <div className='flex items-center gap-2 flex-shrink-0'>
          {typeof task.linked?.events === 'number' && task.linked.events > 0 && (
            <div className='flex items-center gap-1'>
              <div className='w-2 h-2 rounded-full bg-accent/50' />
              <span className='text-text-secondary'>{task.linked.events}</span>
            </div>
          )}
          {typeof task.linked?.notes === 'number' && task.linked.notes > 0 && (
            <div className='flex items-center gap-1'>
              <div className='w-2 h-2 rounded-sm bg-white/35' />
              <span className='text-text-secondary'>{task.linked.notes}</span>
            </div>
          )}
        </div>

        {/* Right: Tags */}
        <div className='flex items-center gap-1 overflow-hidden'>
          {tags.slice(0, 2).map(t => (
            <span key={t} className='px-1.5 py-0.5 rounded text-[11px] bg-white/8 text-text-secondary/70 whitespace-nowrap'>
              {t}
            </span>
          ))}
          {extra > 0 && (
            <span className='text-[11px] text-text-secondary/60'>+{extra}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCardV2;

