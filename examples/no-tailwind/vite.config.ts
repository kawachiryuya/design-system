import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Tailwind は一切設定しない (mode① の検証が目的)。React プラグインのみ。
export default defineConfig({
  plugins: [react()],
  resolve: {
    // DS を file:../.. でローカルリンクすると、DS 自身の devDependency react が
    // 混ざり React が 2 重ロードされ hooks (useId 等) が壊れる。実消費者 (registry 経由)
    // では react は peerDependency で 1 本に dedupe されるため、ここで同じ状態を再現する。
    dedupe: ['react', 'react-dom'],
  },
});
