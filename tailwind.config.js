/**
 * Tailwind config for the design-system repo (Storybook root).
 *
 * Theme values come from tokens/preset.cjs which loads tokens/build/tokens.json.
 * Edit tokens/source/*.json and run `npm run tokens:build` to update.
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('./tokens/preset.cjs')],
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}',
    './components/**/*.{html,js,jsx,ts,tsx,mdx}',
    './.storybook/**/*.{js,ts,tsx}',
  ],
  plugins: [],
};
