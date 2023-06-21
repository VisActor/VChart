/**
 * @type {import('@internal/bundler').Config}
 */
module.exports = {
  name: 'VChart',
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
    // '@visactor/vrender': 'VRender'
  },
  external: [
    // '@visactor/vrender'
  ]
};
