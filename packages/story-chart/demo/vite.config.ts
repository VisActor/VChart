import { defineConfig } from 'vite';
import * as path from 'path';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({ jsxRuntime: 'classic' })],
  define: {
    __VERSION__: JSON.stringify(require('../../../package.json').version)
  },
  resolve: {
    alias: {
      '@visactor/vchart': path.resolve(__dirname, '../../vchart/src/index'),
      '@visactor/vutils-extension': path.resolve(__dirname, '../../vutils-extension/src/index.ts')
    }
  }
});
