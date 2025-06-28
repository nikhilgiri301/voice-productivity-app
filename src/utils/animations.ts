// Animation utilities for Personal Organizer App
// Hardware-accelerated transforms and micro-interactions

import { CSSProperties } from 'react';

// Easing functions
export const easings = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  decelerated: 'cubic-bezier(0, 0, 0.2, 1)',
  accelerated: 'cubic-bezier(0.4, 0, 1, 1)',
} as const;

// Duration constants
export const durations = {
  instant: '0ms',
  fast: '150ms',
  normal: '250ms',
  slow: '400ms',
  slower: '600ms',
  slowest: '800ms',
} as const;

// Common animation presets
export const animations = {
  // Fade animations
  fadeIn: {
    opacity: 1,
    transition: `opacity ${durations.normal} ${easings.easeOut}`,
  },
  fadeOut: {
    opacity: 0,
    transition: `opacity ${durations.normal} ${easings.easeOut}`,
  },
  
  // Scale animations
  scaleIn: {
    transform: 'scale(1)',
    transition: `transform ${durations.normal} ${easings.bounce}`,
  },
  scaleOut: {
    transform: 'scale(0.95)',
    transition: `transform ${durations.normal} ${easings.easeOut}`,
  },
  
  // Slide animations
  slideInUp: {
    transform: 'translateY(0)',
    transition: `transform ${durations.normal} ${easings.easeOut}`,
  },
  slideInDown: {
    transform: 'translateY(0)',
    transition: `transform ${durations.normal} ${easings.easeOut}`,
  },
  slideInLeft: {
    transform: 'translateX(0)',
    transition: `transform ${durations.normal} ${easings.easeOut}`,
  },
  slideInRight: {
    transform: 'translateX(0)',
    transition: `transform ${durations.normal} ${easings.easeOut}`,
  },
  
  // Hover effects
  hoverLift: {
    transform: 'translateY(-2px)',
    transition: `transform ${durations.fast} ${easings.easeOut}`,
  },
  hoverScale: {
    transform: 'scale(1.05)',
    transition: `transform ${durations.fast} ${easings.easeOut}`,
  },
  
  // Press effects
  pressDown: {
    transform: 'scale(0.95)',
    transition: `transform ${durations.fast} ${easings.easeOut}`,
  },
  
  // Rotation
  rotate90: {
    transform: 'rotate(90deg)',
    transition: `transform ${durations.normal} ${easings.easeOut}`,
  },
  rotate180: {
    transform: 'rotate(180deg)',
    transition: `transform ${durations.normal} ${easings.easeOut}`,
  },
} as const;

// Hardware acceleration helpers
export const hardwareAcceleration = {
  enable: {
    transform: 'translate3d(0, 0, 0)',
    willChange: 'transform',
  },
  disable: {
    willChange: 'auto',
  },
} as const;

// Micro-interaction helpers
export const microInteractions = {
  // Button interactions
  buttonPress: (pressed: boolean): CSSProperties => ({
    transform: pressed ? 'scale(0.95)' : 'scale(1)',
    transition: `transform ${durations.fast} ${easings.easeOut}`,
    ...hardwareAcceleration.enable,
  }),
  
  // Card interactions
  cardHover: (hovered: boolean): CSSProperties => ({
    transform: hovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
    boxShadow: hovered ? 'var(--shadow-lg)' : 'var(--shadow-md)',
    transition: `all ${durations.normal} ${easings.easeOut}`,
    ...hardwareAcceleration.enable,
  }),
  
  // Tab interactions
  tabSwitch: (active: boolean): CSSProperties => ({
    transform: active ? 'scale(1.1)' : 'scale(1)',
    opacity: active ? 1 : 0.7,
    transition: `all ${durations.fast} ${easings.easeOut}`,
    ...hardwareAcceleration.enable,
  }),
  
  // Modal animations
  modalEnter: (): CSSProperties => ({
    transform: 'scale(1) translateY(0)',
    opacity: 1,
    transition: `all ${durations.normal} ${easings.bounce}`,
    ...hardwareAcceleration.enable,
  }),
  
  modalExit: (): CSSProperties => ({
    transform: 'scale(0.9) translateY(20px)',
    opacity: 0,
    transition: `all ${durations.fast} ${easings.easeOut}`,
    ...hardwareAcceleration.enable,
  }),
  
  // Loading animations
  pulse: (): CSSProperties => ({
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    ...hardwareAcceleration.enable,
  }),
  
  spin: (): CSSProperties => ({
    animation: 'spin 1s linear infinite',
    ...hardwareAcceleration.enable,
  }),
  
  bounce: (): CSSProperties => ({
    animation: 'bounce 1s infinite',
    ...hardwareAcceleration.enable,
  }),
} as const;

// Stagger animation helper
export const staggerAnimation = (index: number, baseDelay: number = 100): CSSProperties => ({
  animationDelay: `${index * baseDelay}ms`,
  ...hardwareAcceleration.enable,
});

// Parallax helper
export const parallaxTransform = (scrollY: number, speed: number = 0.5): CSSProperties => ({
  transform: `translate3d(0, ${scrollY * speed}px, 0)`,
  ...hardwareAcceleration.enable,
});

// Spring animation helper
export const springAnimation = (
  property: string,
  duration: keyof typeof durations = 'normal'
): string => {
  return `${property} ${durations[duration]} ${easings.bounce}`;
};

// Keyframe animations (to be added to CSS)
export const keyframes = {
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  
  slideInUp: `
    @keyframes slideInUp {
      from { 
        transform: translate3d(0, 100%, 0);
        opacity: 0;
      }
      to { 
        transform: translate3d(0, 0, 0);
        opacity: 1;
      }
    }
  `,
  
  slideInDown: `
    @keyframes slideInDown {
      from { 
        transform: translate3d(0, -100%, 0);
        opacity: 0;
      }
      to { 
        transform: translate3d(0, 0, 0);
        opacity: 1;
      }
    }
  `,
  
  slideInLeft: `
    @keyframes slideInLeft {
      from { 
        transform: translate3d(-100%, 0, 0);
        opacity: 0;
      }
      to { 
        transform: translate3d(0, 0, 0);
        opacity: 1;
      }
    }
  `,
  
  slideInRight: `
    @keyframes slideInRight {
      from { 
        transform: translate3d(100%, 0, 0);
        opacity: 0;
      }
      to { 
        transform: translate3d(0, 0, 0);
        opacity: 1;
      }
    }
  `,
  
  scaleIn: `
    @keyframes scaleIn {
      from { 
        transform: scale3d(0.3, 0.3, 0.3);
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      to { 
        transform: scale3d(1, 1, 1);
        opacity: 1;
      }
    }
  `,
  
  pulse: `
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
  `,
  
  spin: `
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `,
  
  bounce: `
    @keyframes bounce {
      0%, 100% {
        transform: translateY(-25%);
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
      }
      50% {
        transform: translateY(0);
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
      }
    }
  `,
  
  wiggle: `
    @keyframes wiggle {
      0%, 7% {
        transform: rotateZ(0);
      }
      15% {
        transform: rotateZ(-15deg);
      }
      20% {
        transform: rotateZ(10deg);
      }
      25% {
        transform: rotateZ(-10deg);
      }
      30% {
        transform: rotateZ(6deg);
      }
      35% {
        transform: rotateZ(-4deg);
      }
      40%, 100% {
        transform: rotateZ(0);
      }
    }
  `,
} as const;

// Performance optimization helpers
export const performanceOptimizations = {
  // Enable GPU acceleration
  gpuAcceleration: {
    transform: 'translate3d(0, 0, 0)',
    backfaceVisibility: 'hidden' as const,
    perspective: 1000,
  },
  
  // Optimize for animations
  animationOptimization: {
    willChange: 'transform, opacity',
    transformStyle: 'preserve-3d' as const,
  },
  
  // Disable during animation
  disablePointerEvents: {
    pointerEvents: 'none' as const,
  },
  
  // Re-enable after animation
  enablePointerEvents: {
    pointerEvents: 'auto' as const,
  },
} as const;

// Animation class names for CSS
export const animationClasses = {
  fadeIn: 'animate-fade-in',
  slideInUp: 'animate-slide-in-up',
  slideInDown: 'animate-slide-in-down',
  slideInLeft: 'animate-slide-in-left',
  slideInRight: 'animate-slide-in-right',
  scaleIn: 'animate-scale-in',
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  bounce: 'animate-bounce',
  wiggle: 'animate-wiggle',
} as const;

export default {
  easings,
  durations,
  animations,
  microInteractions,
  hardwareAcceleration,
  staggerAnimation,
  parallaxTransform,
  springAnimation,
  keyframes,
  performanceOptimizations,
  animationClasses,
};
