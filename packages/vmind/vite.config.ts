import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import libCss from 'vite-plugin-libcss';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';
// https://vitejs.dev/config/
import pkg from '../vchart/package.json';
//import css from 'vite-plugin-css';
export default defineConfig({
  plugins: [
    react(),
    libCss(),
    //css(),
    dynamicImportVars({
      //这里配置插件在那个文件夹内生效 这里是在router文件夹内生效
      include: ['src'],
      //这里是哪些文件夹内不生效
      exclude: [],
      //插件在遇到错误时会退出构建过程。如果您将此选项设置为 true，它将引发警告，并且保持代码不变。
      warnOnError: false
    }) as any
  ],
  define: {
    __DEV__: true,
    __VERSION__: JSON.stringify(pkg.version)
  },
  server: {
    host: '0.0.0.0',
    port: 3100
    // port: localConf.server?.port || 3100
  },
  resolve: {
    alias: {
      '@visactor/vchart': path.resolve(__dirname, '../vchart/src/index.ts'),
      '@visactor/vutils-extension': path.resolve('../vutils-extension/src/index.ts')
      // ...localConf.resolve?.alias
    }
  },
  build: {
    cssCodeSplit: true
  },
  css: {
    preprocessorOptions: {
      less: {
        math: 'always',
        relativeUrls: true,
        javascriptEnabled: true
      }
    }
  }
});
