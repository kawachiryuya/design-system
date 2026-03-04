/** @type {import('tailwindcss').Config} */

// デザインシステム本体のトークンを共有
const spacing = require('../tokens/spacing.json');
const colors = require('../tokens/colors.json');
const typography = require('../tokens/typography.json');
const shadows = require('../tokens/shadows.json');
const radius = require('../tokens/radius.json');
const breakpoints = require('../tokens/breakpoints.json');
const animation = require('../tokens/animation.json');

module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}',
    './index.html',
    // デザインシステムのコンポーネント
    '../components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    spacing: spacing.spacing,
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
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,
    lineHeight: typography.lineHeight,
    letterSpacing: typography.letterSpacing,
    fontFamily: typography.fontFamily,
    boxShadow: shadows.shadow,
    borderRadius: radius.radius,
    screens: breakpoints.screens,
    transitionDuration: animation.duration,
    transitionTimingFunction: animation.easing,
    extend: {
      spacing: spacing.semantic,
      backgroundColor: {
        background: 'var(--color-bg-default)',
        surface: {
          DEFAULT:  'var(--color-surface-default)',
          raised:   'var(--color-surface-raised)',
          overlay:  'var(--color-surface-overlay)',
          primary:   'var(--color-surface-primary)',
          secondary: 'var(--color-surface-secondary)',
          success:         'var(--color-surface-success)',
          'success-muted': 'var(--color-surface-success-muted)',
          error:           'var(--color-surface-error)',
          'error-muted':   'var(--color-surface-error-muted)',
          warning:         'var(--color-surface-warning)',
          'warning-muted': 'var(--color-surface-warning-muted)',
          info:            'var(--color-surface-info)',
          'info-muted':    'var(--color-surface-info-muted)',
          disabled:  'var(--color-surface-disabled)',
          skeleton:  'var(--color-surface-skeleton)',
          neutral:   'var(--color-surface-neutral)',
          inset:     'var(--color-surface-inset)',
        },
        state: {
          hover:   'var(--color-state-hover)',
          active:  'var(--color-state-active)',
          dragged: 'var(--color-state-dragged)',
        },
      },
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
      borderColor: {
        border: {
          DEFAULT:  'var(--color-border-default)',
          muted:    'var(--color-border-muted)',
          strong:   'var(--color-border-strong)',
          focus:    'var(--color-border-focus)',
          primary:  'var(--color-border-primary)',
          error:    'var(--color-border-error)',
          success:  'var(--color-border-success)',
          warning:  'var(--color-border-warning)',
          info:     'var(--color-border-info)',
          disabled: 'var(--color-border-disabled)',
          'success-muted': 'var(--color-border-success-muted)',
          'error-muted':   'var(--color-border-error-muted)',
          'warning-muted': 'var(--color-border-warning-muted)',
          'info-muted':    'var(--color-border-info-muted)',
        },
      },
      ringColor: {
        border: {
          focus:   'var(--color-border-focus)',
          primary: 'var(--color-border-primary)',
          error:   'var(--color-border-error)',
        },
        surface: 'var(--color-surface-default)',
      },
      divideColor: {
        border: {
          DEFAULT: 'var(--color-border-default)',
          muted:   'var(--color-border-muted)',
        },
      },
    },
  },
  plugins: [],
};
