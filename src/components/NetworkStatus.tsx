import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

export const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const handleNetworkChange = (event: CustomEvent) => {
      const { online } = event.detail;
      setIsOnline(online);
      
      if (!online) {
        setShowOfflineMessage(true);
      } else {
        // Hide offline message after a delay when coming back online
        setTimeout(() => setShowOfflineMessage(false), 3000);
      }
    };

    window.addEventListener('networkstatus', handleNetworkChange as EventListener);

    return () => {
      window.removeEventListener('networkstatus', handleNetworkChange as EventListener);
    };
  }, []);

  if (!showOfflineMessage && isOnline) {
    return null;
  }

  return (
    <div className={`
      fixed top-0 left-0 right-0 z-50 p-3 text-center text-sm font-medium transition-all duration-300
      ${isOnline 
        ? 'bg-ios-green text-white' 
        : 'bg-ios-red text-white'
      }
    `}>
      <div className="flex items-center justify-center gap-2">
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4" />
            <span>Back online</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span>You're offline. Some features may not work.</span>
          </>
        )}
      </div>
    </div>
  );
};
