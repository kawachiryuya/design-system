/**
 * Tailwind preset — design-system tokens
 *
 * 各 PJ の tailwind.config.js から `presets: [require('.../tokens/preset')]` で継承。
 * PJ 固有の追加は `theme.extend` に書く。
 *
 * 一次ソース: tokens/source/x.json → Style Dictionary → tokens/build/tokens.json
 * 詳細: docs/ai-roadmap.md §「Phase 1 / 施策 A」
 * 親 Issue: kawachiryuya/ai-management#32
 */

const path = require('path');

let t;
try {
  t = require(path.join(__dirname, 'build/tokens.json'));
} catch (e) {
  throw new Error(
    'Design tokens not built yet.\n' +
    'Run `npm install` (which runs postinstall → tokens:build) at the design-system repo root.\n' +
    'Or run `npm run tokens:build` manually.\n' +
    `Looking for: ${path.join(__dirname, 'build/tokens.json')}`
  );
}

// fontFamily は CSS では comma-separated string、Tailwind では array が望ましい。
const splitFontFamily = (s) =>
  typeof s === 'string' ? s.split(/\s*,\s*/) : s;

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    // ── Core (overrides Tailwind defaults) ──
    spacing: t.spacing,
    colors: {
      primary: t.color.primary,
      neutral: t.color.neutral,
      success: t.color.success,
      error: t.color.error,
      warning: t.color.warning,
      info: t.color.info,
      white: t.color.base.white,
      black: t.color.base.black,
      transparent: t.color.base.transparent,
    },
    fontSize: t.typography['font-size'],
    fontWeight: t.typography['font-weight'],
    lineHeight: t.typography['line-height'],
    letterSpacing: t.typography['letter-spacing'],
    fontFamily: {
      sans: splitFontFamily(t.typography['font-family'].sans),
      serif: splitFontFamily(t.typography['font-family'].serif),
      mono: splitFontFamily(t.typography['font-family'].mono),
    },
    boxShadow: t.shadow,
    borderRadius: t.radius,
    screens: t.screens,
    transitionDuration: t.duration,
    transitionTimingFunction: t.easing,

    extend: {
      // Semantic spacing aliases (component / section)
      spacing: t['spacing-semantic'],

      // ── Semantic color tokens (WHERE × WHAT) ──
      // CSS 変数経由で resolve（実体は tokens/build/variables.css）
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
};
