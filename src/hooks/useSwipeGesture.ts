import { useEffect, useRef, useCallback } from 'react';
import { TabType, useTabNavigation } from '../contexts/TabNavigationContext';

interface SwipeGestureOptions {
  threshold?: number;
  preventDefaultTouchMove?: boolean;
  enableVerticalSwipe?: boolean;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

export const useSwipeGesture = (
  elementRef: React.RefObject<HTMLElement>,
  options: SwipeGestureOptions = {}
) => {
  const {
    threshold = 50,
    preventDefaultTouchMove = true,
    enableVerticalSwipe = false,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
  } = options;

  const startTouch = useRef<TouchPoint | null>(null);
  const currentTouch = useRef<TouchPoint | null>(null);
  const isScrolling = useRef<boolean | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    startTouch.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    currentTouch.current = startTouch.current;
    isScrolling.current = null;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!startTouch.current) return;

    const touch = e.touches[0];
    currentTouch.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };

    const deltaX = Math.abs(currentTouch.current.x - startTouch.current.x);
    const deltaY = Math.abs(currentTouch.current.y - startTouch.current.y);

    // Determine if this is a horizontal or vertical scroll
    if (isScrolling.current === null) {
      isScrolling.current = deltaY > deltaX;
    }

    // Prevent default for horizontal swipes to avoid interfering with vertical scrolling
    if (!isScrolling.current && preventDefaultTouchMove) {
      e.preventDefault();
    }
  }, [preventDefaultTouchMove]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!startTouch.current || !currentTouch.current) return;

    const deltaX = currentTouch.current.x - startTouch.current.x;
    const deltaY = currentTouch.current.y - startTouch.current.y;
    const deltaTime = currentTouch.current.time - startTouch.current.time;

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Only trigger swipe if it's fast enough and crosses the threshold
    const isValidSwipe = deltaTime < 500 && (absDeltaX > threshold || absDeltaY > threshold);

    if (isValidSwipe) {
      // Horizontal swipes
      if (absDeltaX > absDeltaY) {
        if (deltaX > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
      }
      // Vertical swipes (if enabled)
      else if (enableVerticalSwipe) {
        if (deltaY > 0) {
          onSwipeDown?.();
        } else {
          onSwipeUp?.();
        }
      }
    }

    // Reset
    startTouch.current = null;
    currentTouch.current = null;
    isScrolling.current = null;
  }, [threshold, enableVerticalSwipe, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Add touch event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);
};

// Hook specifically for tab navigation swipes
export const useTabSwipeNavigation = (elementRef: React.RefObject<HTMLElement>) => {
  const { activeTab, switchToTab } = useTabNavigation();

  const getNextTab = useCallback((currentTab: TabType, direction: 'left' | 'right'): TabType => {
    const tabs: TabType[] = ['schedule', 'tasks', 'notes'];
    const currentIndex = tabs.indexOf(currentTab);

    if (direction === 'left') {
      // Swipe left = next tab
      return tabs[(currentIndex + 1) % tabs.length];
    } else {
      // Swipe right = previous tab
      return tabs[(currentIndex - 1 + tabs.length) % tabs.length];
    }
  }, []);

  const handleSwipeLeft = useCallback(() => {
    const nextTab = getNextTab(activeTab, 'left');
    switchToTab(nextTab);
    
    // Add haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, [activeTab, getNextTab, switchToTab]);

  const handleSwipeRight = useCallback(() => {
    const nextTab = getNextTab(activeTab, 'right');
    switchToTab(nextTab);
    
    // Add haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, [activeTab, getNextTab, switchToTab]);

  useSwipeGesture(elementRef, {
    threshold: 75, // Slightly higher threshold for tab navigation
    preventDefaultTouchMove: true,
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
  });
};

export default useSwipeGesture;
