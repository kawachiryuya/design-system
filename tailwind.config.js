/** @type {import('tailwindcss').Config} */

const spacing = require('./tokens/spacing.json');
const colors = require('./tokens/colors.json');
const typography = require('./tokens/typography.json');
const shadows = require('./tokens/shadows.json');
const radius = require('./tokens/radius.json');
const breakpoints = require('./tokens/breakpoints.json');
const animation = require('./tokens/animation.json');

module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}',
    './components/**/*.{html,js,jsx,ts,tsx,mdx}',
    './.storybook/**/*.{js,ts,tsx}',
  ],
  theme: {
    // Spacing (8px base scale)
    spacing: spacing.spacing,
    
    // Colors (Primary, Neutral, Semantic)
    colors: {
      primary: colors.primary,
      neutral: colors.neutral,
      success: colors.success,
      error: colors.error,
      warning: colors.warning,
      info: colors.info,
      white: colors.base.white,
      black: colors.base.black,
      transparent: colors.base.transparent,
    },
    
    // Typography
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,
    lineHeight: typography.lineHeight,
    letterSpacing: typography.letterSpacing,
    fontFamily: typography.fontFamily,
    
    // Shadows
    boxShadow: shadows.shadow,
    
    // Border Radius
    borderRadius: radius.radius,
    
    // Breakpoints
    screens: breakpoints.screens,
    
    // Animation
    transitionDuration: animation.duration,
    transitionTimingFunction: animation.easing,
    
    extend: {
      // Semantic spacing aliases
      spacing: spacing.semantic,

      // ── Semantic color tokens (WHERE × WHAT) ──
      // CSS custom properties defined in .storybook/tailwind.css

      // bg-background, bg-surface-*, bg-state-*
      backgroundColor: {
        background: 'var(--color-bg-default)',
        surface: {
          DEFAULT:  'var(--color-surface-default)',
          raised:   'var(--color-surface-raised)',
          overlay:  'var(--color-surface-overlay)',
          primary:   'var(--color-surface-primary)',
          secondary: 'var(--color-surface-secondary)',
          success:   'var(--color-surface-success)',
          error:     'var(--color-surface-error)',
          warning:   'var(--color-surface-warning)',
          info:      'var(--color-surface-info)',
          disabled:  'var(--color-surface-disabled)',
          skeleton:  'var(--color-surface-skeleton)',
        },
        state: {
          hover:   'var(--color-state-hover)',
          active:  'var(--color-state-active)',
          dragged: 'var(--color-state-dragged)',
        },
      },

      // text-onSurface-*
      textColor: {
        onSurface: {
          DEFAULT:  'var(--color-on-default)',
          muted:    'var(--color-on-muted)',
          subtle:   'var(--color-on-subtle)',
          primary:  'var(--color-on-primary)',
          success:  'var(--color-on-success)',
          error:    'var(--color-on-error)',
          warning:  'var(--color-on-warning)',
          info:     'var(--color-on-info)',
          disabled: 'var(--color-on-disabled)',
          inverse:  'var(--color-on-inverse)',
        },
      },

      // border-border-*
      borderColor: {
        border: {
          DEFAULT:  'var(--color-border-default)',
          muted:    'var(--color-border-muted)',
          strong:   'var(--color-border-strong)',
          focus:    'var(--color-border-focus)',
          primary:  'var(--color-border-primary)',
          error:    'var(--color-border-error)',
          disabled: 'var(--color-border-disabled)',
        },
      },

      // ring-border-*
      ringColor: {
        border: {
          focus:   'var(--color-border-focus)',
          primary: 'var(--color-border-primary)',
          error:   'var(--color-border-error)',
        },
      },
    },
  },
  plugins: [],
}
