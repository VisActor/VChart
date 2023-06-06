import { UserConfig, defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// let localConf: UserConfig = {};

// try {
//   localConf = require('./vite.config.local').default;
// } catch (e) {
//   console.warn('vite.config.local.ts not found', e);
// }

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __DEV__: true,
    __VERSION__: JSON.stringify(require('../../vchart/package.json').version)
  },
  optimizeDeps: {},
  server: {
    host: '0.0.0.0',
    port: 3100
    // port: localConf.server?.port || 3100
  },
  resolve: {
    alias: {
      '@visactor/vchart': path.resolve(__dirname, '../../vchart/src/index.ts')
      // ...localConf.resolve?.alias
    }
  }
});
