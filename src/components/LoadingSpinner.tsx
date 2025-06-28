import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'gray' | 'white';
  text?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'blue',
  text,
  fullScreen = false
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const colorClasses = {
    blue: 'border-ios-blue',
    gray: 'border-ios-gray-400',
    white: 'border-white'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`
          ${sizeClasses[size]} 
          ${colorClasses[color]} 
          border-2 border-t-transparent 
          rounded-full 
          animate-spin
        `}
      />
      {text && (
        <p className={`text-sm ${color === 'white' ? 'text-white' : 'text-ios-gray-600'}`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-ios-gray-50 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

// Skeleton loading components for better perceived performance
export const SkeletonCard: React.FC = () => (
  <div className="ios-card p-4 animate-pulse">
    <div className="flex items-start gap-3 mb-3">
      <div className="w-8 h-8 bg-ios-gray-200 rounded-ios"></div>
      <div className="flex-1">
        <div className="h-4 bg-ios-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-ios-gray-200 rounded w-1/2"></div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-ios-gray-200 rounded w-full"></div>
      <div className="h-3 bg-ios-gray-200 rounded w-2/3"></div>
    </div>
  </div>
);

export const SkeletonList: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }, (_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);
