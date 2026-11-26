/**
 * 検討のページ用の Tailwind 設定。リポジトリの preset (tokens/preset.cjs) をそのまま継承し、
 * このフォルダの src と、本物の部品 (components/) を読む。
 */
const path = require('node:path');

const repo = path.resolve(__dirname, '../../../..');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require(path.join(repo, 'tokens/preset.cjs'))],
  content: [
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'src/**/*.{ts,tsx}'),
    path.join(repo, 'components/**/*.tsx'),
    `!${path.join(repo, 'components/**/*.stories.tsx')}`,
  ],
  plugins: [],
};
