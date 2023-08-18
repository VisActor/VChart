import pkg from '../packages/vchart/package.json';
import * as path from 'path';
import react from '@vitejs/plugin-react';

const { plugin: mdPlugin, Mode } = require('vite-plugin-markdown');

export default {
  optimizeDeps: {},
  server: {
    host: '0.0.0.0',
    port: 3020,
    https: !!process.env.HTTPS
  },
  define: {
    __DEV__: true,
    __VERSION__: JSON.stringify(pkg.version)
  },
  plugins: [react(), mdPlugin({ mode: [Mode.HTML, Mode.MARKDOWN, Mode.TOC] })]
};
