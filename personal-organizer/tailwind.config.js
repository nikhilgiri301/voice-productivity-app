/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background Colors
        'bg-primary': '#0f0f23',
        'bg-secondary': '#1a1a2e', 
        'bg-tertiary': '#16213e',
        'bg-card': '#2a2a3e',
        
        // Text Colors
        'text-primary': '#ffffff',
        'text-secondary': '#8b9dc3',
        
        // Semantic Colors (each with single purpose)
        'priority-urgent': '#ff6363',     // red - only for urgent items
        'priority-important': '#ff9800',  // orange - only for important items
        'priority-optional': '#ffc107',   // yellow - only for optional items
        'context-work': '#4a90e2',        // blue - only for work borders
        'context-personal': '#4caf50',    // green - only for personal borders
        'accent': '#e91e63',              // pink/magenta - only for interactions
        
        // Neutral
        'border-default': 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'app-title': ['24px', { lineHeight: '1.2', fontWeight: '700' }],
        'section-header': ['18px', { lineHeight: '1.3', fontWeight: '600' }],
        'card-title': ['16px', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'secondary': ['12px', { lineHeight: '1.4', fontWeight: '400' }],
        'micro': ['11px', { lineHeight: '1.3', fontWeight: '400' }],
      },
      spacing: {
        'card-padding': '20px',
        'screen-margin': '20px',
        'element-sm': '8px',
        'element-md': '12px',
        'element-lg': '16px',
      },
      minHeight: {
        'touch-target': '44px',
      },
      minWidth: {
        'touch-target': '44px',
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
        'chip': '20px',
      },
      backdropBlur: {
        'glass': '10px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'card': '0 4px 16px 0 rgba(0, 0, 0, 0.1)',
        'button': '0 2px 8px 0 rgba(0, 0, 0, 0.15)',
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
      },
      zIndex: {
        'fixed': '1000',
        'dropdown': '1050',
        'modal': '1100',
      },
    },
  },
  plugins: [],
}
