import React from 'react';
import {
  Header,
  TabBar,
  type ContextMode,
  type TabId,
} from '@/components/common';

export interface LayoutProps {
  children: React.ReactNode;
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
  currentContext?: ContextMode;
  onContextChange?: (context: ContextMode) => void;
  userName?: string;
  className?: string;
  showHeader?: boolean;
  showTabBar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  activeTab,
  onTabChange,
  currentContext = 'work',
  onContextChange,
  userName = 'User',
  className = '',
  showHeader = true,
  showTabBar = true,
}) => {
  const layoutClasses = [
    'min-h-screen',
    'bg-bg-primary',
    'text-text-primary',
    'flex',
    'flex-col',
    'relative',
    className,
  ].join(' ');

  const mainClasses = [
    'flex-1',
    'flex',
    'flex-col',
    'max-w-md',
    'mx-auto',
    'w-full',
    // Add top padding for header if shown
    showHeader ? 'pt-[120px]' : 'pt-0',
    // Add bottom padding for tab bar if shown
    showTabBar ? 'pb-[80px]' : 'pb-0',
    // Safe area handling
    'safe-area-left',
    'safe-area-right',
  ].join(' ');

  const contentClasses = [
    'flex-1',
    'overflow-y-auto',
    'overflow-x-hidden',
    // Smooth scrolling
    'scroll-smooth',
    // Custom scrollbar styling is handled in globals.css
  ].join(' ');

  return (
    <div className={layoutClasses}>
      {/* Header */}
      {showHeader && (
        <Header
          currentContext={currentContext}
          onContextChange={onContextChange || undefined}
          userName={userName}
        />
      )}

      {/* Main Content Area */}
      <main className={mainClasses}>
        <div className={contentClasses}>{children}</div>
      </main>

      {/* Tab Bar */}
      {showTabBar && <TabBar activeTab={activeTab} onTabChange={onTabChange} />}

      {/* Background Pattern (Optional) */}
      <div className='fixed inset-0 pointer-events-none z-[-1]'>
        <div className='absolute inset-0 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary opacity-50' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(233,30,99,0.1)_0%,transparent_50%)]' />
      </div>
    </div>
  );
};

export default Layout;
