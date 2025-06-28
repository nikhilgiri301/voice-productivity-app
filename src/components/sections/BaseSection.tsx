import React, { ReactNode, useEffect, useRef } from 'react';
import { useTabNavigation, TabType } from '../../contexts/TabNavigationContext';
import { useTabSwipeNavigation } from '../../hooks/useSwipeGesture';

interface BaseSectionProps {
  tabType: TabType;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onEnter?: () => void;
  onExit?: () => void;
  enableSafeArea?: boolean;
  scrollable?: boolean;
  enableSwipeNavigation?: boolean;
}

export const BaseSection: React.FC<BaseSectionProps> = ({
  tabType,
  children,
  className = '',
  style = {},
  onEnter,
  onExit,
  enableSafeArea = true,
  scrollable = true,
  enableSwipeNavigation = true,
}) => {
  const { activeTab, isTabActive } = useTabNavigation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = isTabActive(tabType);
  const wasVisibleRef = useRef(isVisible);

  // Enable swipe navigation if requested
  useTabSwipeNavigation(enableSwipeNavigation ? sectionRef : { current: null });

  // Handle section enter/exit effects
  useEffect(() => {
    const wasVisible = wasVisibleRef.current;
    const isCurrentlyVisible = isVisible;

    if (!wasVisible && isCurrentlyVisible) {
      // Section is becoming visible
      onEnter?.();
    } else if (wasVisible && !isCurrentlyVisible) {
      // Section is becoming hidden
      onExit?.();
    }

    wasVisibleRef.current = isCurrentlyVisible;
  }, [isVisible, onEnter, onExit]);

  // Scroll to top when section becomes active
  useEffect(() => {
    if (isVisible && sectionRef.current && scrollable) {
      sectionRef.current.scrollTop = 0;
    }
  }, [isVisible, scrollable]);

  // Handle safe area calculations
  const getSafeAreaStyle = (): React.CSSProperties => {
    if (!enableSafeArea) return {};

    return {
      paddingTop: 'env(safe-area-inset-top, 0px)',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      paddingLeft: 'env(safe-area-inset-left, 0px)',
      paddingRight: 'env(safe-area-inset-right, 0px)',
    };
  };

  const sectionStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'var(--bg-primary)',
    zIndex: isVisible ? 10 : 1,
    opacity: isVisible ? 1 : 0,
    visibility: isVisible ? 'visible' : 'hidden',
    transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
    transition: 'all var(--transition-normal)',
    overflow: scrollable ? 'auto' : 'hidden',
    ...getSafeAreaStyle(),
    ...style,
  };

  const contentStyle: React.CSSProperties = {
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px',
    paddingBottom: '100px', // Space for tab bar
  };

  return (
    <div
      ref={sectionRef}
      className={`section section-${tabType} ${className}`}
      style={sectionStyle}
      aria-hidden={!isVisible}
      role="tabpanel"
      aria-labelledby={`tab-${tabType}`}
    >
      <div style={contentStyle}>
        {children}
      </div>
    </div>
  );
};

export default BaseSection;
