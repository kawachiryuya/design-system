/**
 * Tailwind config for demo (rail-demo) — design-system 検証サイト
 *
 * design-system は npm package として参照（@kawachiryuya/design-system）。
 * 設計トークンを変更したら repo root で `npm run build` を実行して dist を更新。
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@kawachiryuya/design-system/tokens/preset')],
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}',
    './index.html',
    './node_modules/@kawachiryuya/design-system/dist/**/*.js',
  ],
  plugins: [],
};
