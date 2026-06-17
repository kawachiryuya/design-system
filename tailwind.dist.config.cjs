/**
 * Tailwind config — 配信バンドル (dist/styles.css) 専用。
 *
 * Storybook 用の root `tailwind.config.cjs` とは分離する。違いは 2 点:
 *  1. corePlugins.preflight = false — ライブラリにリセット CSS を同梱しない (A2 #57)。
 *  2. content は出荷される component source のみ (stories / tokens カタログ / .storybook は除外)。
 *     → styles.css に「実際に出荷するコンポーネントが使う utility」だけを焼き込む。
 *
 * theme (色・spacing・semantic utility) は Storybook と同一の tokens/preset.cjs を再利用するため、
 * utility 定義の二重管理は無い。入力 CSS は styles/dist.css。
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('./tokens/preset.cjs')],
  content: [
    './components/**/*.tsx',
    '!./components/**/*.stories.tsx',
    '!./components/tokens/**',
  ],
  corePlugins: {
    // ライブラリにグローバルリセットを同梱しない (消費側のスタイルを壊さない)。
    preflight: false,
  },
  plugins: [],
};
