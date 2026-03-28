// base: '/site/' でデプロイ先サブパス指定。パスエイリアス @ds → src/ds, @tokens → tokens
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/site/',
  plugins: [react()],
  resolve: {
    alias: {
      '@ds': path.resolve(__dirname, 'src/ds'),
      '@tokens': path.resolve(__dirname, 'tokens'),
    },
  },
});
