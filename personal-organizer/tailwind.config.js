/**
 * Tailwind CSS Configuration
 *
 * Colors and design tokens are defined here to match our centralized constants.
 * This ensures consistency between our TypeScript constants and CSS classes.
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Centralized color system - matches src/constants/design-tokens.ts
      colors: {
        // Background Colors (dark theme)
        'bg-primary': '#0f0f23',
        'bg-secondary': '#1a1a2e',
        'bg-tertiary': '#16213e',
        'bg-card': '#2a2a3e',
        'bg-hover': '#3a3a4e',

        // Text Colors
        'text-primary': '#ffffff',
        'text-secondary': '#8b9dc3',
        'text-tertiary': '#6b7280',

        // Border Colors
        'border-default': 'rgba(255, 255, 255, 0.1)',
        'border-hover': 'rgba(255, 255, 255, 0.2)',
        'border-focus': 'rgba(255, 255, 255, 0.3)',

        // Accent Color
        'accent': '#e91e63',

        // Priority Colors (from constants)
        'priority-critical': '#ff6363',
        'priority-useful': '#ffc107',
        'priority-urgent': '#ff6363', // legacy compatibility

        // Context Colors (updated to match TasksBeta)
        'context-work': '#2563eb', // Balanced blue (matches TasksBeta)
        'context-personal': '#52c41a', // Muted green (matches TasksBeta)

        // Task State Colors (from constants)
        'state-not-started': '#6b7280',
        'state-in-progress': '#3b82f6',
        'state-blocked': '#ef4444',
        'state-deferred': '#f59e0b',
        'state-cancelled': '#6b7280',
        'state-completed': '#10b981',

        // Voice State Colors (from constants)
        'voice-idle': '#e91e63',
        'voice-listening': '#ff6363',
        'voice-processing': '#ffc107',
        'voice-error': '#ef4444',
      },

      // Typography system - matches src/constants/design-tokens.ts
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'micro': '0.625rem',
        'xs': '0.75rem',
        'sm': '0.875rem',
        'secondary': '0.875rem',
        'base': '1rem',
        'body': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        'card-title': '1.25rem',
        '2xl': '1.5rem',
        'heading': '1.5rem',
        '3xl': '1.875rem',
        'page-title': '1.875rem',
        '4xl': '2.25rem',
        'display': '2.25rem',
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '1000',
      },

      // Spacing system - matches src/constants/design-tokens.ts (4px base unit)
      spacing: {
        '0.5': '0.125rem', // 2px
        '1.5': '0.375rem', // 6px
        '2.5': '0.625rem', // 10px
        '3.5': '0.875rem', // 14px
        '11': '2.75rem',   // 44px - touch target
        '14': '3.5rem',    // 56px - pl-14 padding
        'card-padding': '1rem', // 16px - p-card-padding
      },

      // Border radius system - matches src/constants/design-tokens.ts
      borderRadius: {
        'sm': '0.125rem',
        'DEFAULT': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'card': '0.5rem',
        'button': '0.375rem',
        'chip': '9999px',
      },

      // Touch targets
      minHeight: {
        'touch-target': '2.75rem', // 44px
      },
      minWidth: {
        'touch-target': '2.75rem', // 44px
      },
      // Backdrop blur effects
      backdropBlur: {
        'glass': '10px',
      },

      // Shadow system - matches src/constants/design-tokens.ts
      boxShadow: {
        'none': 'none',
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },

      // Responsive breakpoints - matches src/constants/design-tokens.ts
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-gentle': 'pulseGentle 2s ease-in-out infinite',
        'waveform': 'waveform 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        waveform: {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(1.5)' },
        },
        'recording-pulse': {
          '0%, 100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)'
          },
          '50%': {
            transform: 'scale(1.05)',
            boxShadow: '0 0 0 10px rgba(239, 68, 68, 0)'
          },
        },
      },
      // Custom z-index values (keeping existing for compatibility)
      zIndex: {
        'fixed': '1000',
        'dropdown': '1050',
        'modal': '1100',
      },
    },
  },
  plugins: [],
}
