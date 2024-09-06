
/**
 * @type {import('@internal/bundler').Config}
 */
module.exports = {
  name: 'VChartExtension',
  formats: ['es', 'cjs', 'umd'],
  outputDir: {
    es: 'esm',
    cjs: 'cjs',
    umd: 'build'
  },
  umdOutputFilename: 'index',
  noEmitOnError: false,
  envs: {
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production')
  },
  globals: {
    '@visactor/vchart': 'VChart',
    '@visactor/vutils': 'VUtils'
  },
  external: ['@visactor/vchart', '@visactor/vutils']
};
