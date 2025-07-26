import React, { useEffect, useState } from 'react';

export interface WaveformAnimationProps {
  isActive?: boolean;
  barCount?: number;
  height?: number;
  color?: string;
  className?: string;
}

const WaveformAnimation: React.FC<WaveformAnimationProps> = ({
  isActive = false,
  barCount = 12,
  height = 40,
  color = 'currentColor',
  className = '',
}) => {
  const [animationValues, setAnimationValues] = useState<number[]>([]);

  // Generate random animation values for realistic waveform
  useEffect(() => {
    if (!isActive) {
      setAnimationValues(new Array(barCount).fill(0.1));
      return undefined;
    }

    const interval = setInterval(() => {
      const newValues = Array.from({ length: barCount }, () => {
        // Generate values that create a realistic waveform pattern
        const baseValue = 0.2 + Math.random() * 0.3; // Base height
        const spike = Math.random() > 0.7 ? Math.random() * 0.5 : 0; // Occasional spikes
        return Math.min(baseValue + spike, 1);
      });
      setAnimationValues(newValues);
    }, 150); // Update every 150ms for smooth animation

    return () => clearInterval(interval);
  }, [isActive, barCount]);

  const containerClasses = [
    'flex',
    'items-end',
    'justify-center',
    'gap-1',
    'transition-opacity',
    'duration-300',
    isActive ? 'opacity-100' : 'opacity-50',
    className,
  ].join(' ');

  const getBarClasses = (index: number): string => {
    const baseClasses = [
      'transition-all',
      'duration-150',
      'ease-out',
      'rounded-full',
      'min-h-1',
    ];

    // Add slight delay to each bar for wave effect
    const delayClass = `delay-${(index * 25) % 200}`;
    
    return [...baseClasses, delayClass].join(' ');
  };

  const getBarHeight = (value: number): number => {
    return Math.max(4, value * height); // Minimum height of 4px
  };

  const getBarWidth = (): number => {
    // Responsive bar width based on container
    return Math.max(2, Math.floor(height / 10));
  };

  return (
    <div 
      className={containerClasses}
      style={{ height: `${height}px` }}
      role="img"
      aria-label={isActive ? 'Recording waveform animation' : 'Inactive waveform'}
    >
      {animationValues.map((value, index) => (
        <div
          key={index}
          className={getBarClasses(index)}
          style={{
            height: `${getBarHeight(value)}px`,
            width: `${getBarWidth()}px`,
            backgroundColor: color,
            transform: isActive ? 'scaleY(1)' : 'scaleY(0.3)',
          }}
        />
      ))}
    </div>
  );
};

export default WaveformAnimation;
