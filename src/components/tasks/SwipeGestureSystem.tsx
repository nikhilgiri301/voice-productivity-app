import React, { useRef, useState, useCallback, ReactNode } from 'react';

interface SwipeGestureSystemProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: SwipeAction;
  rightAction?: SwipeAction;
  threshold?: number;
  maxSwipeDistance?: number;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

interface SwipeAction {
  icon: string;
  color: string;
  backgroundColor: string;
  label?: string;
  hapticFeedback?: boolean;
}

interface TouchState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  startTime: number;
  isActive: boolean;
  direction: 'left' | 'right' | null;
}

export const SwipeGestureSystem: React.FC<SwipeGestureSystemProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction,
  threshold = 60,
  maxSwipeDistance = 120,
  disabled = false,
  className = '',
  style = {},
}) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const [activeAction, setActiveAction] = useState<'left' | 'right' | null>(null);
  
  const touchState = useRef<TouchState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    startTime: 0,
    isActive: false,
    direction: null,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Haptic feedback helper
  const triggerHapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: 50,
        medium: 100,
        heavy: 200,
      };
      navigator.vibrate(patterns[type]);
    }
  }, []);

  // Handle touch start
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;

    const touch = e.touches[0];
    touchState.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      startTime: Date.now(),
      isActive: false,
      direction: null,
    };
  }, [disabled]);

  // Handle touch move
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (disabled || !touchState.current) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchState.current.startX;
    const deltaY = touch.clientY - touchState.current.startY;
    
    touchState.current.currentX = touch.clientX;
    touchState.current.currentY = touch.clientY;

    // Determine if this is a horizontal swipe
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10;
    
    if (isHorizontalSwipe && !touchState.current.isActive) {
      touchState.current.isActive = true;
      setIsSwipeActive(true);
      
      // Determine direction
      touchState.current.direction = deltaX > 0 ? 'right' : 'left';
      
      // Prevent default scrolling
      e.preventDefault();
    }

    if (touchState.current.isActive) {
      // Clamp the swipe distance
      const clampedOffset = Math.max(-maxSwipeDistance, Math.min(maxSwipeDistance, deltaX));
      setSwipeOffset(clampedOffset);

      // Determine active action
      const newActiveAction = deltaX > threshold ? 'right' : deltaX < -threshold ? 'left' : null;
      
      if (newActiveAction !== activeAction) {
        setActiveAction(newActiveAction);
        
        // Trigger haptic feedback when crossing threshold
        if (newActiveAction) {
          const action = newActiveAction === 'left' ? leftAction : rightAction;
          if (action?.hapticFeedback !== false) {
            triggerHapticFeedback('medium');
          }
        }
      }

      e.preventDefault();
    }
  }, [disabled, threshold, maxSwipeDistance, activeAction, leftAction, rightAction, triggerHapticFeedback]);

  // Handle touch end
  const handleTouchEnd = useCallback(() => {
    if (disabled || !touchState.current.isActive) return;

    const deltaX = swipeOffset;
    const deltaTime = Date.now() - touchState.current.startTime;
    const velocity = Math.abs(deltaX) / deltaTime;

    // Check if swipe meets threshold or has sufficient velocity
    const shouldTriggerAction = Math.abs(deltaX) > threshold || velocity > 0.5;

    if (shouldTriggerAction) {
      if (deltaX > 0 && onSwipeRight && rightAction) {
        // Right swipe
        onSwipeRight();
        if (rightAction.hapticFeedback !== false) {
          triggerHapticFeedback('heavy');
        }
      } else if (deltaX < 0 && onSwipeLeft && leftAction) {
        // Left swipe
        onSwipeLeft();
        if (leftAction.hapticFeedback !== false) {
          triggerHapticFeedback('heavy');
        }
      }
    }

    // Reset state
    setSwipeOffset(0);
    setIsSwipeActive(false);
    setActiveAction(null);
    touchState.current.isActive = false;
    touchState.current.direction = null;
  }, [disabled, swipeOffset, threshold, onSwipeLeft, onSwipeRight, leftAction, rightAction, triggerHapticFeedback]);

  // Handle mouse events for desktop testing
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;

    touchState.current = {
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
      startTime: Date.now(),
      isActive: false,
      direction: null,
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!touchState.current) return;

      const deltaX = e.clientX - touchState.current.startX;
      const deltaY = e.clientY - touchState.current.startY;
      
      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10;
      
      if (isHorizontalSwipe && !touchState.current.isActive) {
        touchState.current.isActive = true;
        setIsSwipeActive(true);
        touchState.current.direction = deltaX > 0 ? 'right' : 'left';
      }

      if (touchState.current.isActive) {
        const clampedOffset = Math.max(-maxSwipeDistance, Math.min(maxSwipeDistance, deltaX));
        setSwipeOffset(clampedOffset);

        const newActiveAction = deltaX > threshold ? 'right' : deltaX < -threshold ? 'left' : null;
        setActiveAction(newActiveAction);
      }
    };

    const handleMouseUp = () => {
      if (touchState.current?.isActive) {
        const deltaX = swipeOffset;
        const shouldTriggerAction = Math.abs(deltaX) > threshold;

        if (shouldTriggerAction) {
          if (deltaX > 0 && onSwipeRight && rightAction) {
            onSwipeRight();
          } else if (deltaX < 0 && onSwipeLeft && leftAction) {
            onSwipeLeft();
          }
        }
      }

      setSwipeOffset(0);
      setIsSwipeActive(false);
      setActiveAction(null);
      if (touchState.current) {
        touchState.current.isActive = false;
      }

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [disabled, threshold, maxSwipeDistance, swipeOffset, onSwipeLeft, onSwipeRight, leftAction, rightAction]);

  return (
    <div
      ref={containerRef}
      className={`swipe-gesture-container ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        touchAction: isSwipeActive ? 'none' : 'auto',
        ...style,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
    >
      {/* Left action background */}
      {leftAction && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: `${Math.min(Math.abs(swipeOffset), maxSwipeDistance)}px`,
            background: leftAction.backgroundColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: '16px',
            opacity: swipeOffset < 0 ? 1 : 0,
            transition: isSwipeActive ? 'none' : 'opacity var(--transition-fast)',
            zIndex: 1,
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            color: leftAction.color,
            transform: activeAction === 'left' ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform var(--transition-fast)',
          }}>
            <span style={{ fontSize: '20px' }}>{leftAction.icon}</span>
            {leftAction.label && (
              <span style={{
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-semibold)',
                textAlign: 'center',
              }}>
                {leftAction.label}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Right action background */}
      {rightAction && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${Math.min(swipeOffset, maxSwipeDistance)}px`,
            background: rightAction.backgroundColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingLeft: '16px',
            opacity: swipeOffset > 0 ? 1 : 0,
            transition: isSwipeActive ? 'none' : 'opacity var(--transition-fast)',
            zIndex: 1,
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            color: rightAction.color,
            transform: activeAction === 'right' ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform var(--transition-fast)',
          }}>
            <span style={{ fontSize: '20px' }}>{rightAction.icon}</span>
            {rightAction.label && (
              <span style={{
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-semibold)',
                textAlign: 'center',
              }}>
                {rightAction.label}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isSwipeActive ? 'none' : 'transform var(--transition-normal)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {children}
      </div>

      {/* CSS-in-JS styles */}
      <style jsx>{`
        .swipe-gesture-container {
          user-select: none;
          -webkit-user-select: none;
        }
        
        .swipe-gesture-container * {
          pointer-events: ${isSwipeActive ? 'none' : 'auto'};
        }
        
        /* Prevent text selection during swipe */
        .swipe-gesture-container.swiping {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }
        
        /* Smooth transitions */
        @media (prefers-reduced-motion: reduce) {
          .swipe-gesture-container * {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SwipeGestureSystem;
