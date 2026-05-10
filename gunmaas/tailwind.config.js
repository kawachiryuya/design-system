/**
 * Tailwind config for gunmaas — GunMaaS PJ デモ
 *
 * Theme values inherit from tokens/preset.cjs (tokens/build/tokens.json).
 * GunMaaS ブランド固有の拡張色（accent / sand / mist）のみここに追加。
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('../tokens/preset.cjs')],
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}',
    './index.html',
    '../components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      // GunMaaS ブランド拡張色（CSS 変数は gunmaas の各 PJ CSS で定義）
      colors: {
        accent: {
          DEFAULT: 'var(--gm-accent)',
          dark: 'var(--gm-accent-dark)',
        },
        sand: {
          DEFAULT: 'var(--gm-sand)',
          light: 'var(--gm-sand-light)',
        },
        mist: {
          DEFAULT: 'var(--gm-secondary)',
          light: 'var(--gm-secondary-light)',
        },
      },
    },
  },
  plugins: [],
};
