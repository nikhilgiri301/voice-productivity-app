import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Define the available tab types
export type TabType = 'schedule' | 'tasks' | 'notes';

// Define the context interface
interface TabNavigationContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  switchToTab: (tab: TabType) => void;
  isTabActive: (tab: TabType) => boolean;
  previousTab: TabType | null;
  tabHistory: TabType[];
}

// Create the context
const TabNavigationContext = createContext<TabNavigationContextType | undefined>(undefined);

// Provider props interface
interface TabNavigationProviderProps {
  children: ReactNode;
  defaultTab?: TabType;
  persistTab?: boolean;
}

// Local storage key for tab persistence
const TAB_STORAGE_KEY = 'personal-organizer-active-tab';

// Provider component
export const TabNavigationProvider: React.FC<TabNavigationProviderProps> = ({
  children,
  defaultTab = 'schedule',
  persistTab = true,
}) => {
  // Initialize active tab from localStorage or default
  const getInitialTab = (): TabType => {
    if (persistTab && typeof window !== 'undefined') {
      const savedTab = localStorage.getItem(TAB_STORAGE_KEY) as TabType;
      if (savedTab && ['schedule', 'tasks', 'notes'].includes(savedTab)) {
        return savedTab;
      }
    }
    return defaultTab;
  };

  const [activeTab, setActiveTabState] = useState<TabType>(getInitialTab);
  const [previousTab, setPreviousTab] = useState<TabType | null>(null);
  const [tabHistory, setTabHistory] = useState<TabType[]>([getInitialTab()]);

  // Enhanced tab switching with history tracking
  const switchToTab = useCallback((tab: TabType) => {
    if (tab === activeTab) return; // No need to switch if already active

    // Update previous tab
    setPreviousTab(activeTab);
    
    // Update tab history (keep last 10 entries)
    setTabHistory(prev => {
      const newHistory = [...prev, tab];
      return newHistory.slice(-10);
    });

    // Update active tab
    setActiveTabState(tab);

    // Persist to localStorage if enabled
    if (persistTab && typeof window !== 'undefined') {
      localStorage.setItem(TAB_STORAGE_KEY, tab);
    }

    // Dispatch custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('tabChanged', { 
      detail: { 
        activeTab: tab, 
        previousTab: activeTab 
      } 
    }));
  }, [activeTab, persistTab]);

  // Simple setter that uses switchToTab internally
  const setActiveTab = useCallback((tab: TabType) => {
    switchToTab(tab);
  }, [switchToTab]);

  // Check if a tab is currently active
  const isTabActive = useCallback((tab: TabType) => {
    return activeTab === tab;
  }, [activeTab]);

  // Context value
  const contextValue: TabNavigationContextType = {
    activeTab,
    setActiveTab,
    switchToTab,
    isTabActive,
    previousTab,
    tabHistory,
  };

  return (
    <TabNavigationContext.Provider value={contextValue}>
      {children}
    </TabNavigationContext.Provider>
  );
};

// Custom hook to use the tab navigation context
export const useTabNavigation = (): TabNavigationContextType => {
  const context = useContext(TabNavigationContext);
  
  if (context === undefined) {
    throw new Error('useTabNavigation must be used within a TabNavigationProvider');
  }
  
  return context;
};

// Hook for tab-specific effects
export const useTabEffect = (tab: TabType, effect: () => void | (() => void), deps?: React.DependencyList) => {
  const { activeTab } = useTabNavigation();
  
  React.useEffect(() => {
    if (activeTab === tab) {
      return effect();
    }
  }, [activeTab, tab, ...(deps || [])]);
};

// Hook for tab visibility
export const useTabVisibility = (tab: TabType) => {
  const { activeTab } = useTabNavigation();
  return activeTab === tab;
};
