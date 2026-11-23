/**
 * @type {import('@internal/bundler').Config}
 */
module.exports = {
  name: 'ReactVChart',
  formats: ['es', 'cjs', 'umd'],
  outputDir: {
    es: 'esm',
    cjs: 'cjs',
    umd: 'build'
  },
  umdOutputFilename: 'index',
  umdCompress: false,
  noEmitOnError: false,
  globals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  external: ['react', 'react-dom'],
  envs: {
    'process.env.NODE_ENV': JSON.stringify('production')
  }
};
