import React from 'react';
import TaskCardV2, { type TaskV2 } from '@/components/tasks-v2/TaskCardV2';
import FiltersV2, { type FilterId } from '@/components/tasks-v2/FiltersV2';
import SwipeListV2 from '@/components/tasks-v2/SwipeListV2';

// Color picker demo data - Extended blue options (10 total), green stays at 5
// Option 1 = Current color, then progressively more vibrant (not lighter)
const colorOptions = [
  { id: 'blue1', name: 'Blue Option 1 (Current)', color: '#4a90e2', type: 'work' },
  { id: 'blue2', name: 'Blue Option 2', color: '#4a95ff', type: 'work' },
  { id: 'blue3', name: 'Blue Option 3', color: '#4a9aff', type: 'work' },
  { id: 'blue4', name: 'Blue Option 4', color: '#3d8eff', type: 'work' },
  { id: 'blue5', name: 'Blue Option 5', color: '#2d7eff', type: 'work' },
  { id: 'blue6', name: 'Blue Option 6', color: '#1d6eff', type: 'work' },
  { id: 'blue7', name: 'Blue Option 7', color: '#0d5eff', type: 'work' },
  { id: 'blue8', name: 'Blue Option 8', color: '#0050ff', type: 'work' },
  { id: 'blue9', name: 'Blue Option 9', color: '#0040ff', type: 'work' },
  { id: 'blue10', name: 'Blue Option 10', color: '#0030ff', type: 'work' },
  { id: 'green1', name: 'Green Option A', color: '#3d8b40', type: 'personal' },
  { id: 'green2', name: 'Green Option B', color: '#42a045', type: 'personal' },
  { id: 'green3', name: 'Green Option C', color: '#47b54a', type: 'personal' },
  { id: 'green4', name: 'Green Option D', color: '#4cca4f', type: 'personal' },
  { id: 'green5', name: 'Green Option E', color: '#51df54', type: 'personal' },
];

// Simple color picker card component
const ColorCard: React.FC<{ option: typeof colorOptions[0] }> = ({ option }) => (
  <div
    className='p-6 rounded-xl text-center'
    style={{ backgroundColor: option.color }}
  >
    <h3 className='text-lg font-semibold text-white drop-shadow-lg'>
      {option.name}
    </h3>
  </div>
);

const TasksBetaScreen: React.FC = () => {
  return (
    <div className='flex-1 p-screen-margin space-y-6'>
      <div className='text-center mb-8'>
        <h1 className='text-section-header text-text-primary mb-2'>Color Picker</h1>
        <p className='text-secondary text-text-secondary'>
          Choose your preferred colors for work (blue) and personal (green) contexts
        </p>
      </div>

      {/* Blue Options */}
      <div className='space-y-4'>
        <h2 className='text-base text-text-primary font-semibold'>Work Context (Blue Options)</h2>
        <div className='grid grid-cols-1 gap-4'>
          {colorOptions.filter(opt => opt.type === 'work').map(option => (
            <ColorCard key={option.id} option={option} />
          ))}
        </div>
      </div>

      {/* Green Options */}
      <div className='space-y-4'>
        <h2 className='text-base text-text-primary font-semibold'>Personal Context (Green Options)</h2>
        <div className='grid grid-cols-1 gap-4'>
          {colorOptions.filter(opt => opt.type === 'personal').map(option => (
            <ColorCard key={option.id} option={option} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TasksBetaScreen;

