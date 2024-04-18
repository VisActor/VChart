import { defineConfig } from 'vite';
import * as path from 'path';
import react from '@vitejs/plugin-react';
import localConf from './vite.config.local';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({ jsxRuntime: 'classic' }),
    {
      name: 'configure-response-headers',
      configureServer: server => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
          res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
          next();
        });
      }
    }
  ],
  define: {
    __VERSION__: JSON.stringify(require('../../../package.json').version)
  },
  resolve: {
    alias: {
      '@visactor/vchart': path.resolve(__dirname, '../../vchart/src/index'),
      '@visactor/vutils-extension': path.resolve(__dirname, '../../vutils-extension/src/index.ts'),
      ...localConf?.resolve?.alias
    }
  }
});
