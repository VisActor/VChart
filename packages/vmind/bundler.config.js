/**
 * @type {Partial<import('@internal/bundler').Config>}
 */
const json = require('@rollup/plugin-json');

module.exports = {
  formats: ['cjs', 'es', 'umd'],
  outputDir: {
    es: 'esm',
    cjs: 'cjs',
    umd: 'build'
  },
  name: 'VMind',
  umdOutputFilename: 'index',
  rollupOptions: {
    plugins: [json()]
  },
};
