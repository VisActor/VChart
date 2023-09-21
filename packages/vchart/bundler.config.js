const fs = require('fs');
const path = require('path');
const { visualizer } = require('rollup-plugin-visualizer');
const gzipPlugin = require('rollup-plugin-gzip').default;
const sizes = require('rollup-plugin-sizes');
const bundleSize = require('rollup-plugin-bundle-size');

function copyFile(source, target) {
  fs.copyFile(source, target, error => {
    if (error) {
      console.error(error);
    }
    console.log('File copied successfully!');
  });
}

function copyStart(source, destinations) {
  destinations.forEach(target => {
    copyFile(source, target);
  });
}

const bundle_analyze_mode = process.env.BUNDLE_ANALYZE;
let umdInput = 'index.ts';
let umdOutput = 'index';
if (bundle_analyze_mode && bundle_analyze_mode !== 'full') {
  umdInput = `vchart-${bundle_analyze_mode}.ts`;
  umdOutput = `index-${bundle_analyze_mode}`;
}

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
  name: 'VChart',
  formats: ['umd'],
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
    // generateEntries: (config, projectRoot, rawPackageJson) => {
    //   ['core', 'chart', 'series', 'mark', 'component', 'layout'].forEach(entryName => {
    //     const jsCode = fs.readFileSync(path.join(__dirname, `../../common/template/${entryName}.js`), 'utf-8');
    //     fs.writeFileSync(path.join(__dirname, `./${entryName}.js`), jsCode, 'utf-8');

    //     const dtsCode = fs.readFileSync(path.join(__dirname, `../../common/template/${entryName}.d.ts`), 'utf-8');
    //     fs.writeFileSync(path.join(__dirname, `./${entryName}.d.ts`), dtsCode, 'utf-8');
    //   });
    // },
    copy: (config, projectRoot, rawPackageJson) => {
      const vchartSource = path.join(__dirname, config.outputDir.umd, 'index.min.js');
      const packagesDestinations = [
        path.join(__dirname, '../block-vchart/block/vchart/index.js'),
        path.join(__dirname, '../tt-vchart/src/vchart/index.js'),
        path.join(__dirname, '../lark-vchart/src/vchart/index.js'),
        path.join(__dirname, '../wx-vchart/miniprogram/src/vchart/index.js')
      ];

      copyStart(vchartSource, packagesDestinations);
    }
  }
};
