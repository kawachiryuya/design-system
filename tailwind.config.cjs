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
    './components/**/*.{html,js,jsx,ts,tsx,mdx}',
    './.storybook/**/*.{js,ts,tsx}',
  ],
  // Tokens/Color/Semantic カタログはクラス名を文字列連結 (`bg-state-${key}` 等) で作るため、
  // 出荷コンポーネントに literal が無い token (bg-state-active 等) は content スキャンで拾われず
  // swatch が透明になる (#109)。semantic color utility を全量 safelist して Storybook では常に生成する。
  // 配信用 tailwind.dist.config.cjs には入れない (dist は実際に使う utility だけを焼き込む)。
  safelist: [
    { pattern: /^(bg-(surface|state|background)|text-onSurface|border-border|ring-border|divide-border)(-[a-z0-9]+)*$/ },
  ],
  plugins: [],
};
