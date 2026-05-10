/**
 * Tailwind config for demo (rail-demo) — design-system 検証サイト
 *
 * Theme values inherit from tokens/preset.cjs (tokens/build/tokens.json).
 * 設計トークンを変更したら repo root で `npm run tokens:build` を実行。
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('../tokens/preset.cjs')],
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}',
    './index.html',
    '../components/**/*.{js,jsx,ts,tsx}',
  ],
  plugins: [],
};
