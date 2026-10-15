/** @type {import('@internal/bundler').Config} */
module.exports = {
  name: 'VChartStatPlots',
  formats: ['es', 'cjs', 'umd'],
  outputDir: { es: 'esm', cjs: 'cjs', umd: 'build' },
  umdOutputFilename: 'index',
  noEmitOnError: true,
  sourcemap: false,
  external: ['@visactor/vchart'],
  globals: { '@visactor/vchart': 'VChart' }
};
