/**
 * @type {Partial<import('@internal/bundler').Config>}
 */
module.exports = {
  formats: ['cjs', 'es', 'umd'],
  outputDir: {
    es: 'esm',
    cjs: 'cjs',
    umd: 'build'
  },
  name: 'VMind',
  umdOutputFilename: 'index'
};
