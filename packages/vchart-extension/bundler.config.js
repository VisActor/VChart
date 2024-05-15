const fs = require('fs');
const path = require('path');
const { visualizer } = require('rollup-plugin-visualizer');
const gzipPlugin = require('rollup-plugin-gzip').default;
const sizes = require('rollup-plugin-sizes');
const bundleSize = require('rollup-plugin-bundle-size');

const bundle_analyze_mode = process.env.BUNDLE_ANALYZE;
const umdInput = 'index.ts';
const umdOutput = 'index';

const plugins = bundle_analyze_mode
  ? [
      visualizer({
        open: true,
        gzipSize: true,
        emitFile: true,
        filename: `stats-${bundle_analyze_mode}`,
        template: 'treemap'
      }),
      gzipPlugin({
        filter: /\.(js)$/
      }),
      bundleSize(),
      sizes()
    ]
  : [];

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
  input: {
    umd: umdInput
  },
  umdOutputFilename: umdOutput,
  noEmitOnError: false,
  envs: {
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production')
  },
  rollupOptions: {
    plugins
  },
  globals: {
    // '@visactor/vrender': 'VRender'
  },
  external: [
    // '@visactor/vrender'
  ],
  postTasks: {
    
  }
};
