import React from 'react';
import { ProductivityItem } from '../../types';
import { CalendarCard } from './CalendarCard';
import { TaskCard } from './TaskCard';
import { NoteCard } from './NoteCard';

interface ItemCardProps {
  item: ProductivityItem;
  onEdit: (item: ProductivityItem) => void;
  onDelete: (id: string) => void;
  onToggleComplete?: (id: string) => void;
  onShowLinks?: (item: ProductivityItem) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onEdit,
  onDelete,
  onToggleComplete,
  onShowLinks
}) => {
  switch (item.type) {
    case 'calendar':
      return (
        <CalendarCard
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          onShowLinks={onShowLinks}
        />
      );
    case 'task':
      return (
        <TaskCard
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
          onShowLinks={onShowLinks}
        />
      );
    case 'note':
      return (
        <NoteCard
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          onShowLinks={onShowLinks}
        />
      );
    default:
      return null;
  }
};
