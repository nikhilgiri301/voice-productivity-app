import React, { useState, useRef, useEffect } from 'react';
import TaskCard, { type TaskCardProps } from './TaskCard';

export interface SwipeableTaskCardProps extends TaskCardProps {
  onSwipeComplete?: (taskId: string) => void;
  onSwipeEdit?: (taskId: string) => void;
  swipeThreshold?: number;
}

const SwipeableTaskCard: React.FC<SwipeableTaskCardProps> = ({
  onSwipeComplete,
  onSwipeEdit,
  swipeThreshold = 100,
  ...taskCardProps
}) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showLeftAction, setShowLeftAction] = useState(false);
  const [showRightAction, setShowRightAction] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const currentX = useRef(0);

  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent): void => {
    if (e.touches[0]) {
      startX.current = e.touches[0].clientX;
      currentX.current = startX.current;
      setIsDragging(true);
    }
  };

  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent): void => {
    if (!isDragging || !e.touches[0]) return;

    currentX.current = e.touches[0].clientX;
    const deltaX = currentX.current - startX.current;
    
    // Limit swipe distance
    const maxSwipe = 120;
    const limitedDelta = Math.max(-maxSwipe, Math.min(maxSwipe, deltaX));
    
    setSwipeOffset(limitedDelta);
    
    // Show action indicators
    if (limitedDelta > 30) {
      setShowRightAction(true);
      setShowLeftAction(false);
    } else if (limitedDelta < -30) {
      setShowLeftAction(true);
      setShowRightAction(false);
    } else {
      setShowLeftAction(false);
      setShowRightAction(false);
    }
  };

  // Handle touch end
  const handleTouchEnd = (): void => {
    if (!isDragging) return;

    const deltaX = currentX.current - startX.current;
    
    // Check if swipe threshold is met
    if (Math.abs(deltaX) >= swipeThreshold) {
      if (deltaX > 0 && onSwipeEdit) {
        // Right swipe - edit action
        onSwipeEdit(taskCardProps.task.id);
      } else if (deltaX < 0 && onSwipeComplete) {
        // Left swipe - complete action
        onSwipeComplete(taskCardProps.task.id);
      }
    }

    // Reset state
    setSwipeOffset(0);
    setIsDragging(false);
    setShowLeftAction(false);
    setShowRightAction(false);
    startX.current = 0;
    currentX.current = 0;
  };

  // Handle mouse events for desktop testing
  const handleMouseDown = (e: React.MouseEvent): void => {
    startX.current = e.clientX;
    currentX.current = startX.current;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent): void => {
    if (!isDragging) return;
    
    currentX.current = e.clientX;
    const deltaX = currentX.current - startX.current;
    
    const maxSwipe = 120;
    const limitedDelta = Math.max(-maxSwipe, Math.min(maxSwipe, deltaX));
    
    setSwipeOffset(limitedDelta);
    
    if (limitedDelta > 30) {
      setShowRightAction(true);
      setShowLeftAction(false);
    } else if (limitedDelta < -30) {
      setShowLeftAction(true);
      setShowRightAction(false);
    } else {
      setShowLeftAction(false);
      setShowRightAction(false);
    }
  };

  const handleMouseUp = (): void => {
    if (!isDragging) return;

    const deltaX = currentX.current - startX.current;
    
    if (Math.abs(deltaX) >= swipeThreshold) {
      if (deltaX > 0 && onSwipeEdit) {
        onSwipeEdit(taskCardProps.task.id);
      } else if (deltaX < 0 && onSwipeComplete) {
        onSwipeComplete(taskCardProps.task.id);
      }
    }

    setSwipeOffset(0);
    setIsDragging(false);
    setShowLeftAction(false);
    setShowRightAction(false);
    startX.current = 0;
    currentX.current = 0;
  };

  // Add global mouse move and up listeners when dragging
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent): void => {
        currentX.current = e.clientX;
        const deltaX = currentX.current - startX.current;
        
        const maxSwipe = 120;
        const limitedDelta = Math.max(-maxSwipe, Math.min(maxSwipe, deltaX));
        
        setSwipeOffset(limitedDelta);
        
        if (limitedDelta > 30) {
          setShowRightAction(true);
          setShowLeftAction(false);
        } else if (limitedDelta < -30) {
          setShowLeftAction(true);
          setShowRightAction(false);
        } else {
          setShowLeftAction(false);
          setShowRightAction(false);
        }
      };

      const handleGlobalMouseUp = (): void => {
        handleMouseUp();
      };

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
    return undefined;
  }, [isDragging]);

  const containerClasses = [
    'relative',
    'overflow-hidden',
    'rounded-card',
  ].join(' ');

  const cardClasses = [
    'relative',
    // Removed transition classes to test if they're causing width calculation issues
  ].join(' ');

  const actionClasses = (side: 'left' | 'right', show: boolean) => [
    'absolute',
    'top-0',
    'bottom-0',
    'w-20',
    'flex',
    'items-center',
    'justify-center',
    'transition-all',
    'duration-200',
    side === 'left' ? 'right-0' : 'left-0',
    side === 'left' ? 'bg-accent' : 'bg-priority-urgent',
    show ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
  ].join(' ');

  return (
    <div className={containerClasses}>
      {/* Left Action (Complete) */}
      <div className={actionClasses('left', showLeftAction)}>
        <div className="flex flex-col items-center gap-1">
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-micro text-white font-medium">Complete</span>
        </div>
      </div>

      {/* Right Action (Edit) */}
      <div className={actionClasses('right', showRightAction)}>
        <div className="flex flex-col items-center gap-1">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <span className="text-micro text-white font-medium">Edit</span>
        </div>
      </div>

      {/* Task Card */}
      <div
        ref={cardRef}
        className={cardClasses}
        // Removed transform to test if it's causing width calculation issues
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={isDragging ? handleMouseMove : undefined}
        onMouseUp={isDragging ? handleMouseUp : undefined}
      >
        <TaskCard {...taskCardProps} />
      </div>

      {/* Swipe Hint Overlay (shown on first render) */}
      {!isDragging && swipeOffset === 0 && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="bg-bg-primary bg-opacity-90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-text-secondary animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>
            <span className="text-micro text-text-secondary">Swipe for actions</span>
            <svg
              className="w-4 h-4 text-text-secondary animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwipeableTaskCard;
