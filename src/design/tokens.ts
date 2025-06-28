// Design Tokens for Personal Organizer App
// Based on Apple's Human Interface Guidelines and modern design systems

export const designTokens = {
  // Color Palette
  colors: {
    // Primary Background Colors
    background: {
      primary: '#0a0a0b',      // Deep black for main background
      secondary: '#1a1a1d',    // Dark gray for secondary surfaces
      tertiary: '#2a2a2f',     // Medium gray for tertiary surfaces
      card: '#1e1e23',         // Card background with slight transparency
      cardHover: '#252529',    // Card hover state
    },

    // Text Colors
    text: {
      primary: '#ffffff',      // Pure white for primary text
      secondary: '#b4b4b8',    // Light gray for secondary text
      tertiary: '#8a8a8f',     // Medium gray for tertiary text
      muted: '#6a6a6f',        // Muted gray for disabled/placeholder text
      inverse: '#000000',      // Black text for light backgrounds
    },

    // Accent Colors (iOS-inspired)
    accent: {
      blue: '#007aff',         // iOS Blue
      blueHover: '#0056cc',
      green: '#30d158',        // iOS Green
      greenHover: '#28a745',
      purple: '#af52de',       // iOS Purple
      purpleHover: '#8e44ad',
      orange: '#ff9f0a',       // iOS Orange
      orangeHover: '#e6900a',
      red: '#ff453a',          // iOS Red
      redHover: '#e63946',
      yellow: '#ffd60a',       // iOS Yellow
      yellowHover: '#e6c200',
      pink: '#ff2d92',         // iOS Pink
      pinkHover: '#e6297a',
      indigo: '#5856d6',       // iOS Indigo
      indigoHover: '#4c4bc2',
    },

    // Semantic Colors
    semantic: {
      success: '#30d158',
      warning: '#ff9f0a',
      error: '#ff453a',
      info: '#007aff',
    },

    // Border Colors
    border: {
      primary: '#3a3a3f',      // Primary border color
      secondary: '#2a2a2f',    // Secondary border color
      accent: '#4a4a4f',       // Accent border color
      focus: '#007aff',        // Focus state border
    },

    // Gradients
    gradients: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      blue: 'linear-gradient(135deg, #007aff 0%, #0056cc 100%)',
      green: 'linear-gradient(135deg, #30d158 0%, #28a745 100%)',
      purple: 'linear-gradient(135deg, #af52de 0%, #8e44ad 100%)',
      orange: 'linear-gradient(135deg, #ff9f0a 0%, #e6900a 100%)',
      red: 'linear-gradient(135deg, #ff453a 0%, #e63946 100%)',
      sunset: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
      ocean: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      forest: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    },
  },

  // Typography Scale (SF Pro Display inspired)
  typography: {
    fontFamily: {
      primary: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", "Roboto", sans-serif',
      mono: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
    },

    fontSize: {
      xs: '12px',      // 12px
      sm: '14px',      // 14px
      base: '16px',    // 16px - base size
      lg: '18px',      // 18px
      xl: '20px',      // 20px
      '2xl': '24px',   // 24px
      '3xl': '28px',   // 28px
      '4xl': '32px',   // 32px
      '5xl': '36px',   // 36px
      '6xl': '48px',   // 48px
      '7xl': '64px',   // 64px
    },

    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },

    lineHeight: {
      tight: '1.2',
      normal: '1.5',
      relaxed: '1.6',
      loose: '1.8',
    },

    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },

  // Spacing System (4px base unit)
  spacing: {
    0: '0px',
    1: '4px',      // 4px
    2: '8px',      // 8px
    3: '12px',     // 12px
    4: '16px',     // 16px
    5: '20px',     // 20px
    6: '24px',     // 24px
    7: '28px',     // 28px
    8: '32px',     // 32px
    9: '36px',     // 36px
    10: '40px',    // 40px
    12: '48px',    // 48px
    14: '56px',    // 56px
    16: '64px',    // 64px
    20: '80px',    // 80px
    24: '96px',    // 96px
    32: '128px',   // 128px
    40: '160px',   // 160px
    48: '192px',   // 192px
    56: '224px',   // 224px
    64: '256px',   // 256px
  },

  // Border Radius Values
  borderRadius: {
    none: '0px',
    sm: '8px',     // Small radius
    md: '12px',    // Medium radius
    lg: '16px',    // Large radius
    xl: '24px',    // Extra large radius
    '2xl': '32px', // 2X large radius
    full: '9999px', // Full circle
  },

  // Shadow System
  shadows: {
    none: 'none',
    sm: '0 2px 8px rgba(0, 0, 0, 0.3)',
    md: '0 4px 16px rgba(0, 0, 0, 0.4)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.5)',
    xl: '0 16px 64px rgba(0, 0, 0, 0.6)',
    '2xl': '0 32px 128px rgba(0, 0, 0, 0.7)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
  },

  // Transition Timing
  transitions: {
    fast: '0.15s ease-out',
    normal: '0.25s ease-out',
    slow: '0.4s ease-out',
    bounce: '0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Z-Index Scale
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },

  // Breakpoints for Responsive Design
  breakpoints: {
    xs: '320px',   // Extra small devices
    sm: '480px',   // Small devices
    md: '768px',   // Medium devices
    lg: '1024px',  // Large devices
    xl: '1280px',  // Extra large devices
    '2xl': '1536px', // 2X large devices
  },

  // Animation Curves
  easings: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },

  // Component-specific tokens
  components: {
    button: {
      height: {
        sm: '32px',
        md: '40px',
        lg: '48px',
      },
      padding: {
        sm: '8px 16px',
        md: '12px 20px',
        lg: '16px 24px',
      },
    },
    input: {
      height: {
        sm: '36px',
        md: '44px',
        lg: '52px',
      },
    },
    card: {
      padding: {
        sm: '16px',
        md: '24px',
        lg: '32px',
      },
    },
  },
} as const;

// Type definitions for better TypeScript support
export type DesignTokens = typeof designTokens;
export type ColorTokens = typeof designTokens.colors;
export type TypographyTokens = typeof designTokens.typography;
export type SpacingTokens = typeof designTokens.spacing;

export default designTokens;
