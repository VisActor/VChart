import pkg from '../packages/vchart/package.json';
import * as path from 'path';
import react from '@vitejs/plugin-react';

export default {
  optimizeDeps: {},
  server: {
    host: '0.0.0.0',
    port: 3020,
    https: !!process.env.HTTPS,
    open: true
  },
  define: {
    __DEV__: true,
    __VERSION__: JSON.stringify(pkg.version)
  },
  resolve: {
    alias: {
      '@visactor/vchart': path.resolve('../packages/vchart/src/index.ts'),
      '@internal/story-player': path.resolve('../tools/story-player/src/index.ts')
    }
  },
  plugins: [react()]
};
