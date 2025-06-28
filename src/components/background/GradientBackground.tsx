import React, { useEffect, useState, useMemo } from 'react';

interface GradientBackgroundProps {
  className?: string;
  style?: React.CSSProperties;
  animated?: boolean;
  timeBasedGradient?: boolean;
  customGradient?: string;
  opacity?: number;
  children?: React.ReactNode;
}

// Time-based gradient configurations
const TIME_GRADIENTS = {
  dawn: {
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
    name: 'Dawn',
    timeRange: [5, 7], // 5 AM - 7 AM
  },
  morning: {
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    name: 'Morning',
    timeRange: [7, 11], // 7 AM - 11 AM
  },
  midday: {
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    name: 'Midday',
    timeRange: [11, 15], // 11 AM - 3 PM
  },
  afternoon: {
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    name: 'Afternoon',
    timeRange: [15, 18], // 3 PM - 6 PM
  },
  evening: {
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    name: 'Evening',
    timeRange: [18, 21], // 6 PM - 9 PM
  },
  night: {
    gradient: 'linear-gradient(135deg, #4c63d2 0%, #152331 100%)',
    name: 'Night',
    timeRange: [21, 24], // 9 PM - 12 AM
  },
  lateNight: {
    gradient: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 100%)',
    name: 'Late Night',
    timeRange: [0, 5], // 12 AM - 5 AM
  },
} as const;

// Seasonal gradient variations
const SEASONAL_GRADIENTS = {
  spring: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  summer: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  autumn: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
  winter: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
};

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  className = '',
  style = {},
  animated = true,
  timeBasedGradient = true,
  customGradient,
  opacity = 0.1,
  children,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isVisible, setIsVisible] = useState(false);

  // Update time every minute for time-based gradients
  useEffect(() => {
    if (!timeBasedGradient) return;

    const updateTime = () => setCurrentTime(new Date());
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [timeBasedGradient]);

  // Fade in effect
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Get current season
  const getCurrentSeason = (date: Date): keyof typeof SEASONAL_GRADIENTS => {
    const month = date.getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  };

  // Get time-based gradient
  const getTimeBasedGradient = useMemo(() => {
    if (!timeBasedGradient) return null;

    const hour = currentTime.getHours();
    
    // Find the appropriate time gradient
    for (const [key, config] of Object.entries(TIME_GRADIENTS)) {
      const [start, end] = config.timeRange;
      
      // Handle overnight range (late night)
      if (start > end) {
        if (hour >= start || hour < end) {
          return config;
        }
      } else {
        if (hour >= start && hour < end) {
          return config;
        }
      }
    }
    
    // Default to night if no match
    return TIME_GRADIENTS.night;
  }, [currentTime, timeBasedGradient]);

  // Calculate gradient with seasonal influence
  const finalGradient = useMemo(() => {
    if (customGradient) return customGradient;
    
    if (timeBasedGradient && getTimeBasedGradient) {
      // Add subtle seasonal influence
      const season = getCurrentSeason(currentTime);
      const baseGradient = getTimeBasedGradient.gradient;
      
      // For now, return the time-based gradient
      // In the future, we could blend with seasonal colors
      return baseGradient;
    }
    
    // Default gradient
    return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  }, [customGradient, timeBasedGradient, getTimeBasedGradient, currentTime]);

  const backgroundStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: finalGradient,
    opacity: isVisible ? opacity : 0,
    transition: animated ? 'all 2s ease-in-out' : 'none',
    zIndex: -1,
    pointerEvents: 'none',
    ...style,
  };

  // Performance optimization: use transform3d to enable hardware acceleration
  const optimizedStyle: React.CSSProperties = {
    ...backgroundStyle,
    transform: 'translate3d(0, 0, 0)',
    willChange: animated ? 'opacity, background' : 'auto',
  };

  return (
    <>
      {/* Main gradient background */}
      <div
        className={`gradient-background ${className}`}
        style={optimizedStyle}
        aria-hidden="true"
      />
      
      {/* Optional overlay for additional effects */}
      {animated && (
        <div
          className="gradient-background-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 70%)',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 3s ease-in-out',
            zIndex: -1,
            pointerEvents: 'none',
            transform: 'translate3d(0, 0, 0)',
          }}
          aria-hidden="true"
        />
      )}
      
      {/* Content */}
      {children}
      
      {/* Debug info (only in development) */}
      {process.env.NODE_ENV === 'development' && timeBasedGradient && getTimeBasedGradient && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            fontFamily: 'monospace',
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        >
          {getTimeBasedGradient.name} ({currentTime.getHours()}:
          {currentTime.getMinutes().toString().padStart(2, '0')})
        </div>
      )}
    </>
  );
};

// Hook for getting current time-based gradient info
export const useTimeBasedGradient = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date());
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const getCurrentGradientInfo = useMemo(() => {
    const hour = currentTime.getHours();
    
    for (const [key, config] of Object.entries(TIME_GRADIENTS)) {
      const [start, end] = config.timeRange;
      
      if (start > end) {
        if (hour >= start || hour < end) {
          return { key, ...config };
        }
      } else {
        if (hour >= start && hour < end) {
          return { key, ...config };
        }
      }
    }
    
    return { key: 'night', ...TIME_GRADIENTS.night };
  }, [currentTime]);

  return {
    currentTime,
    gradientInfo: getCurrentGradientInfo,
    gradients: TIME_GRADIENTS,
  };
};

export default GradientBackground;
