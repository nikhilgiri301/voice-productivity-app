import React from 'react';

export type FilterId = 'all' | 'urgent' | 'important' | 'optional' | 'view';

interface FiltersV2Props {
  active: FilterId;
  counts?: Partial<Record<Exclude<FilterId, 'view'>, number>>;
  onChange: (f: FilterId) => void;
}

const btnBase = 'px-4 py-2.5 rounded-xl text-[13px] bg-white/5 text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all duration-200';

const FiltersV2: React.FC<FiltersV2Props> = ({ active, counts, onChange }) => {
  const items: Array<{ id: FilterId; label: string }> = [
    { id: 'view', label: 'View' },
    { id: 'all', label: `All${counts?.all ? ` (${counts.all})` : ''}` },
    { id: 'urgent', label: `Urgent${counts?.urgent ? ` (${counts.urgent})` : ''}` },
    { id: 'important', label: `Important${counts?.important ? ` (${counts.important})` : ''}` },
    { id: 'optional', label: `Optional${counts?.optional ? ` (${counts.optional})` : ''}` },
  ];

  return (
    <div className='flex gap-2'>
      {items.map(it => (
        <button
          key={it.id}
          className={[btnBase, active === it.id ? 'bg-accent/15 text-accent' : ''].join(' ')}
          onClick={() => onChange(it.id)}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
};

export default FiltersV2;

