/**
 * @type {Partial<import('@internal/bundler').Config>}
 */
module.exports = {
  name: 'Test',
  formats: ['umd'],

  umdOutputFilename: 'index',
  minify: false,
  browserUmd: true,
  // 分阶段 Worker 交接已编译依赖，串行 Worker 仍可从同一检出的源码打包。
  browserTsconfig: 'tsconfig.browser.json',

  external: [],

  globals: {}
};
