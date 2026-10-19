import { defineConfig } from 'vite';
import path from 'path';
export default defineConfig(({ mode }) => ({
  publicDir: path.resolve(__dirname, '../vchart/build'),
  optimizeDeps: { include: ['@visactor/vutils'] },
  server: {
    host: '127.0.0.1',
    port: 4180,
    open: mode === 'test' ? false : '/examples/index.html',
    fs: { allow: [path.resolve(__dirname, '../..')] }
  }
}));
