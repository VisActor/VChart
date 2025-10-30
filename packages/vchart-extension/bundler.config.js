
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
  },
  external: [
    '@visactor/vchart',
    // vchart 已经引入了 下面这些包， 这里不需要再打包
    '@visactor/vlayouts',
    '@visactor/vdataset',
    '@visactor/vutils',
    '@visactor/vrender-core',
    '@visactor/vrender-components',
    '@visactor/vrender-kits',
    '@visactor/vrender-animate']
};
