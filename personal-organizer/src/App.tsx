import React, { useState, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { Layout, type TabId, type ContextMode } from '@/components/common';
import { ScheduleScreen, TasksScreen, NotesScreen, TasksBetaScreen } from '@/screens';

// App content component that has access to router hooks
const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentContext, setCurrentContext] = useState<ContextMode>('work');

  // Determine active tab based on current route
  const getActiveTabFromPath = (pathname: string): TabId => {
    if (pathname.startsWith('/tasks-beta')) return 'tasks-beta';
    if (pathname.startsWith('/tasks')) return 'tasks';
    if (pathname.startsWith('/voice')) return 'voice';
    if (pathname.startsWith('/notes')) return 'notes';
    return 'schedule';
  };

  const activeTab = getActiveTabFromPath(location.pathname);

  const handleTabChange = useCallback((tabId: TabId): void => {
    // Map 'tasks-beta' to its route explicitly (others map 1:1)
    const path = tabId === 'tasks-beta' ? '/tasks-beta' : `/${tabId}`;
    navigate(path);
  }, [navigate]);

  const handleContextChange = useCallback((context: ContextMode): void => {
    setCurrentContext(context);
  }, []);

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      currentContext={currentContext}
      onContextChange={handleContextChange}
      userName='User' // This will be dynamic in later phases
    >
      <Routes>
        <Route path='/' element={<Navigate to='/schedule' replace />} />
        <Route path='/schedule' element={<ScheduleScreen />} />
        <Route path='/tasks' element={<TasksScreen />} />
        <Route path='/voice' element={<div className="flex items-center justify-center h-full text-text-secondary">Voice functionality coming soon...</div>} />
        {import.meta.env.VITE_ENABLE_TASKS_BETA === 'true' && (
          <Route path='/tasks-beta' element={<TasksBetaScreen />} />
        )}
        <Route path='/notes' element={<NotesScreen />} />
        <Route path='*' element={<Navigate to='/schedule' replace />} />
      </Routes>
    </Layout>
  );
};

function App(): React.JSX.Element {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
