import React from 'react';
import { ConfirmationCard as ConfirmationCardType } from '../../types';
import { CalendarConfirmationCard } from './CalendarConfirmationCard';
import { TaskConfirmationCard } from './TaskConfirmationCard';
import { NoteConfirmationCard } from './NoteConfirmationCard';

interface ConfirmationCardProps {
  card: ConfirmationCardType;
  onApprove: (cardId: string) => void;
  onReject: (cardId: string) => void;
  onEdit: (cardId: string, item: Partial<ConfirmationCardType['item']>) => void;
}

export const ConfirmationCard: React.FC<ConfirmationCardProps> = ({
  card,
  onApprove,
  onReject,
  onEdit
}) => {
  const handleEdit = (updatedItem: Partial<ConfirmationCardType['item']>) => {
    onEdit(card.id, updatedItem);
  };

  switch (card.item.type) {
    case 'calendar':
      return (
        <CalendarConfirmationCard
          card={card}
          onApprove={onApprove}
          onReject={onReject}
          onEdit={handleEdit}
        />
      );
    case 'task':
      return (
        <TaskConfirmationCard
          card={card}
          onApprove={onApprove}
          onReject={onReject}
          onEdit={handleEdit}
        />
      );
    case 'note':
      return (
        <NoteConfirmationCard
          card={card}
          onApprove={onApprove}
          onReject={onReject}
          onEdit={handleEdit}
        />
      );
    default:
      return null;
  }
};
