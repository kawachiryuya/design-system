// 検討のページ (Issue #91、07 実物の案) のビルド設定。出荷するものではない。
// design-system の本物の token・Tailwind の preset・部品を、リポジトリの相対パスで読む。
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../../../..');

export default defineConfig({
  root: here,
  // index.html と assets/ だけで、どこに置いても (file:// でも、別のパスの下でも) 開けるように
  base: './',
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss({ config: path.join(here, 'tailwind.config.cjs') }), autoprefixer()],
    },
  },
  resolve: { dedupe: ['react', 'react-dom'] },
  server: { fs: { allow: [repo] } },
  build: {
    outDir: path.join(here, 'dist'),
    emptyOutDir: true,
  },
});
