import React from 'react';
import TaskCardV2, { type TaskV2 } from './TaskCardV2';

interface SwipeListV2Props {
  items: TaskV2[];
  onComplete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

const SwipeableRow: React.FC<{ item: TaskV2; onComplete?: (id: string) => void; onEdit?: (id: string) => void; }>
= ({ item, onComplete, onEdit }) => {
  // Simple swipe without hooks to avoid invalid hook call issues in HMR
  let startX = 0;
  let delta = 0;
  const threshold = 70;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    startX = e.clientX;
  };
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    delta = e.clientX - startX;
  };
  const handlePointerUp = () => {
    if (delta <= -threshold) onComplete?.(item.id);
    if (delta >= threshold) onEdit?.(item.id);
    startX = 0; delta = 0;
  };

  return (
    <div
      className='relative'
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div className='absolute inset-0 flex items-center justify-between px-4 text-[12px] text-text-secondary pointer-events-none'>
        <span className='text-blue-300'>Edit</span>
        <span className='text-green-300'>Complete</span>
      </div>
      <TaskCardV2 task={item} />
    </div>
  );
};

const SwipeListV2: React.FC<SwipeListV2Props> = ({ items, onComplete, onEdit }) => {
  return (
    <div className='space-y-3'>
      {items.map(it => (
        <SwipeableRow key={it.id} item={it} onComplete={onComplete} onEdit={onEdit} />
      ))}
    </div>
  );
};

export default SwipeListV2;

