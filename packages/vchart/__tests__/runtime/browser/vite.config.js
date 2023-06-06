import localConf from './vite.config.local';

export default {
  optimizeDeps: {
    exclude: [
      '@visactor/vrender',
      '@visactor/vgrammar',
      '@visactor/vgrammar-projection',
      '@visactor/vgrammar-hierarchical',
      '@visactor/vgrammar-label',
      '@visactor/vgrammar-wordcloud',
      '@visactor/vgrammar-wordcloud-fast',
      '@visactor/vscale',
    ]
  },
  server: {
    host: '0.0.0.0',
    port: localConf.port || 3000,
    https: !!process.env.HTTPS
  },
  define: {
    __DEV__: true,
    __VERSION__: JSON.stringify(require('../../../package.json').version)
  },
  resolve: localConf.resolve || {}
};
