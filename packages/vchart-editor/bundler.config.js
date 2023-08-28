/**
 * @type {import('@internal/bundler').Config}
 */
module.exports = {
  name: 'VChartEditor',
  formats: ['cjs', 'es', 'umd'],
  outputDir: {
    es: 'esm',
    cjs: 'cjs',
    umd: 'build'
  },
  umdOutputFilename: 'index',
  noEmitOnError: false
};
