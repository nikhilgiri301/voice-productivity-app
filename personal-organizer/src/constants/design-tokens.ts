/**
 * Design Tokens System - Centralized Design Values
 * 
 * This file defines all design system values including colors, typography,
 * spacing, shadows, and other visual properties. These tokens ensure
 * consistent visual design across the entire application.
 */

import { PRIORITY_COLORS, CONTEXT_COLORS, TASK_STATE_COLORS, VOICE_STATE_COLORS } from './index';

// =============================================================================
// COLOR SYSTEM
// =============================================================================

/**
 * Base color palette - foundational colors for the dark theme
 */
export const BASE_COLORS = {
  // Background Colors (dark theme)
  'bg-primary': '#0f0f23',    // Main background
  'bg-secondary': '#1a1a2e',  // Secondary background
  'bg-tertiary': '#16213e',   // Tertiary background
  'bg-card': '#2a2a3e',       // Card backgrounds
  'bg-hover': '#3a3a4e',      // Hover states
  
  // Text Colors
  'text-primary': '#ffffff',   // Primary text (white)
  'text-secondary': '#8b9dc3', // Secondary text (muted blue)
  'text-tertiary': '#6b7280',  // Tertiary text (gray)
  
  // Border Colors
  'border-default': 'rgba(255, 255, 255, 0.1)', // Default borders
  'border-hover': 'rgba(255, 255, 255, 0.2)',   // Hover borders
  'border-focus': 'rgba(255, 255, 255, 0.3)',   // Focus borders
  
  // Accent Color
  'accent': '#e91e63', // Pink/magenta for interactions
} as const;

/**
 * Complete color system combining base colors with semantic colors
 */
export const COLORS = {
  ...BASE_COLORS,
  
  // Priority Colors (from constants)
  'priority-critical': PRIORITY_COLORS.critical,
  'priority-useful': PRIORITY_COLORS.useful,
  
  // Legacy priority names for backward compatibility
  'priority-urgent': PRIORITY_COLORS.critical,
  
  // Context Colors (from constants)
  'context-work': CONTEXT_COLORS.work,
  'context-personal': CONTEXT_COLORS.personal,
  
  // Task State Colors (from constants)
  'state-not-started': TASK_STATE_COLORS['not-started'],
  'state-in-progress': TASK_STATE_COLORS['in-progress'],
  'state-blocked': TASK_STATE_COLORS.blocked,
  'state-deferred': TASK_STATE_COLORS.deferred,
  'state-cancelled': TASK_STATE_COLORS.cancelled,
  'state-completed': TASK_STATE_COLORS.completed,
  
  // Voice State Colors (from constants)
  'voice-idle': VOICE_STATE_COLORS.idle,
  'voice-listening': VOICE_STATE_COLORS.listening,
  'voice-processing': VOICE_STATE_COLORS.processing,
  'voice-error': VOICE_STATE_COLORS.error,
} as const;

// =============================================================================
// TYPOGRAPHY SYSTEM
// =============================================================================

/**
 * Font family definitions
 */
export const FONT_FAMILIES = {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
} as const;

/**
 * Font size scale with semantic naming
 */
export const FONT_SIZES = {
  // Micro text (10px)
  micro: '0.625rem',
  
  // Small text (12px)
  xs: '0.75rem',
  
  // Secondary text (14px)
  sm: '0.875rem',
  secondary: '0.875rem',
  
  // Body text (16px) - default
  base: '1rem',
  body: '1rem',
  
  // Large text (18px)
  lg: '1.125rem',
  
  // Card titles (20px)
  xl: '1.25rem',
  'card-title': '1.25rem',
  
  // Section headings (24px)
  '2xl': '1.5rem',
  heading: '1.5rem',
  
  // Page titles (30px)
  '3xl': '1.875rem',
  'page-title': '1.875rem',
  
  // Large displays (36px)
  '4xl': '2.25rem',
  display: '2.25rem',
} as const;

/**
 * Font weight scale
 */
export const FONT_WEIGHTS = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

/**
 * Line height scale
 */
export const LINE_HEIGHTS = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
} as const;

// =============================================================================
// SPACING SYSTEM
// =============================================================================

/**
 * Spacing scale based on 4px base unit
 */
export const SPACING = {
  0: '0',
  px: '1px',
  0.5: '0.125rem', // 2px
  1: '0.25rem',    // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem',     // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem',    // 12px
  3.5: '0.875rem', // 14px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  7: '1.75rem',    // 28px
  8: '2rem',       // 32px
  9: '2.25rem',    // 36px
  10: '2.5rem',    // 40px
  11: '2.75rem',   // 44px
  12: '3rem',      // 48px
  14: '3.5rem',    // 56px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  32: '8rem',      // 128px
  40: '10rem',     // 160px
  48: '12rem',     // 192px
  56: '14rem',     // 224px
  64: '16rem',     // 256px
} as const;

/**
 * Semantic spacing values for common use cases
 */
export const SEMANTIC_SPACING = {
  'card-padding': SPACING[4],      // 16px - standard card padding
  'section-gap': SPACING[6],       // 24px - gap between sections
  'element-gap': SPACING[3],       // 12px - gap between elements
  'touch-target': SPACING[11],     // 44px - minimum touch target size
  'icon-size': SPACING[5],         // 20px - standard icon size
  'button-padding-x': SPACING[4],  // 16px - horizontal button padding
  'button-padding-y': SPACING[2],  // 8px - vertical button padding
} as const;

// =============================================================================
// BORDER RADIUS SYSTEM
// =============================================================================

/**
 * Border radius scale
 */
export const BORDER_RADIUS = {
  none: '0',
  sm: '0.125rem',   // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',   // Fully rounded
} as const;

/**
 * Semantic border radius values
 */
export const SEMANTIC_BORDER_RADIUS = {
  card: BORDER_RADIUS.lg,        // 8px - card corners
  button: BORDER_RADIUS.md,      // 6px - button corners
  input: BORDER_RADIUS.DEFAULT,  // 4px - input corners
  chip: BORDER_RADIUS.full,      // fully rounded chips
} as const;

// =============================================================================
// SHADOW SYSTEM
// =============================================================================

/**
 * Box shadow definitions for depth and elevation
 */
export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
} as const;

/**
 * Semantic shadow values for specific use cases
 */
export const SEMANTIC_SHADOWS = {
  card: SHADOWS.md,           // Card elevation
  'card-hover': SHADOWS.lg,   // Card hover state
  modal: SHADOWS['2xl'],      // Modal overlay
  dropdown: SHADOWS.lg,       // Dropdown menus
  button: SHADOWS.sm,         // Button depth
  'button-hover': SHADOWS.md, // Button hover state
} as const;

// =============================================================================
// ANIMATION & TRANSITION SYSTEM
// =============================================================================

/**
 * Transition duration values
 */
export const TRANSITION_DURATION = {
  75: '75ms',
  100: '100ms',
  150: '150ms',
  200: '200ms',
  300: '300ms',
  500: '500ms',
  700: '700ms',
  1000: '1000ms',
} as const;

/**
 * Transition timing functions
 */
export const TRANSITION_TIMING = {
  linear: 'linear',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

/**
 * Semantic transition values
 */
export const SEMANTIC_TRANSITIONS = {
  fast: `all ${TRANSITION_DURATION[150]} ${TRANSITION_TIMING.out}`,
  normal: `all ${TRANSITION_DURATION[200]} ${TRANSITION_TIMING.out}`,
  slow: `all ${TRANSITION_DURATION[300]} ${TRANSITION_TIMING.out}`,
} as const;

// =============================================================================
// BREAKPOINT SYSTEM
// =============================================================================

/**
 * Responsive breakpoints for mobile-first design
 */
export const BREAKPOINTS = {
  sm: '640px',   // Small devices
  md: '768px',   // Medium devices
  lg: '1024px',  // Large devices
  xl: '1280px',  // Extra large devices
  '2xl': '1536px', // 2X large devices
} as const;

// =============================================================================
// Z-INDEX SYSTEM
// =============================================================================

/**
 * Z-index scale for layering elements
 */
export const Z_INDEX = {
  auto: 'auto',
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  
  // Semantic z-index values
  dropdown: '1000',
  sticky: '1020',
  fixed: '1030',
  modal: '1040',
  popover: '1050',
  tooltip: '1060',
  toast: '1070',
} as const;

// =============================================================================
// EXPORTS
// =============================================================================

// Named exports for Tailwind config
export {
  COLORS,
  FONT_FAMILIES,
  FONT_SIZES,
  FONT_WEIGHTS,
  LINE_HEIGHTS,
  SPACING,
  SEMANTIC_SPACING,
  BORDER_RADIUS,
  SEMANTIC_BORDER_RADIUS,
  SHADOWS,
  SEMANTIC_SHADOWS,
  TRANSITION_DURATION,
  TRANSITION_TIMING,
  SEMANTIC_TRANSITIONS,
  BREAKPOINTS,
  Z_INDEX,
};

export default {
  COLORS,
  FONT_FAMILIES,
  FONT_SIZES,
  FONT_WEIGHTS,
  LINE_HEIGHTS,
  SPACING,
  SEMANTIC_SPACING,
  BORDER_RADIUS,
  SEMANTIC_BORDER_RADIUS,
  SHADOWS,
  SEMANTIC_SHADOWS,
  TRANSITION_DURATION,
  TRANSITION_TIMING,
  SEMANTIC_TRANSITIONS,
  BREAKPOINTS,
  Z_INDEX,
};
