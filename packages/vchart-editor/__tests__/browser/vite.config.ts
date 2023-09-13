import * as path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    open: true,
    port: 3366,
    host: true
  },
  define: {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    __VERSION__: JSON.stringify(require('../../package.json').version)
  },
  resolve: {
    alias: {
      '@visactor/vchart': path.resolve(__dirname, '../../../vchart/src/index.ts'),
      '@visactor/vutils-extension': path.resolve(__dirname, '../../../vutils-extension/src/index.ts')
    }
  }
});
