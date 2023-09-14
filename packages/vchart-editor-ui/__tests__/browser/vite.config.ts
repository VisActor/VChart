import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  define: {
    __DEV__: true,
    __VERSION__: JSON.stringify(require('../../../vchart/package.json').version)
  },
  optimizeDeps: {},
  server: {
    host: '0.0.0.0',
    port: 3200
  },
  resolve: {
    alias: {
      '@visactor/vchart': path.resolve(__dirname, '../../../vchart/src/index.ts')
    }
  }
});
