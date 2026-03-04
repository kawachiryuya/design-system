import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@ds': path.resolve(__dirname, '../components'),
      '@tokens': path.resolve(__dirname, '../tokens'),
    },
  },
});
