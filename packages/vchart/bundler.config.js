const fs = require('fs');
const path = require('path');
const { visualizer } = require('rollup-plugin-visualizer');
const gzipPlugin = require('rollup-plugin-gzip').default;
const sizes = require('rollup-plugin-sizes');
const bundleSize = require('rollup-plugin-bundle-size');

function copyFile(source, target) {
  try {
    fs.copyFileSync(source, target);
  } catch(err) {
    throw new Error(err);
  }
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

const crossEnvs = {
  lark: {
    input: 'index-lark',
    output: '../lark-vchart/src/vchart/index.js'
  },
  block: {
    input: 'index-lark',
    output: '../block-vchart/block/vchart/index.js'
  },
  tt: {
    input: 'index-lark',
    output: '../tt-vchart/src/vchart/index.js'
  },
  wx: {
    input: 'index-wx',
    output: '../wx-vchart/miniprogram/src/vchart/index.js'
  },
  'index-wx-simple':{
    input:'index-wx-simple',
    output:'./dist/index-wx-simple.min.js'
  }
};
const umdEntries = Object.keys(crossEnvs)
  .map(env => crossEnvs[env].input)
  .filter((input, index, arr) => arr.indexOf(input, 0) === index);
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
  esTotalFile: true,
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
  umdEntries,
  postTasks: {
    // generateEntries: (config, projectRoot, rawPackageJson) => {
    //   ['core', 'chart', 'series', 'mark', 'component', 'layout'].forEach(entryName => {
    //     const jsCode = fs.readFileSync(path.join(__dirname, `../../common/template/${entryName}.js`), 'utf-8');
    //     fs.writeFileSync(path.join(__dirname, `./${entryName}.js`), jsCode, 'utf-8');

    //     const dtsCode = fs.readFileSync(path.join(__dirname, `../../common/template/${entryName}.d.ts`), 'utf-8');
    //     fs.writeFileSync(path.join(__dirname, `./${entryName}.d.ts`), dtsCode, 'utf-8');
    //   });
    // },
    copyCrossEnv: config => {
      Object.keys(crossEnvs).forEach(env => {
        const source = `${crossEnvs[env].input}.min.js`;
        const dest = crossEnvs[env].output;
        const envSource = path.join(__dirname, config.outputDir.umd, source);
        copyFile(envSource, path.join(__dirname, dest));
      });
      umdEntries.forEach(entry => {
        fs.unlinkSync(path.join(__dirname, config.outputDir.umd, `${entry}.min.js`));
      });
      // harmonyOS
      const source = 'index.es.js';
      const dest = '../harmony_vchart/library/src/main/ets/vchart_dist.js';
      const envSource = path.join(__dirname, config.outputDir.umd, source);
      copyFile(envSource, path.join(__dirname, dest));
    }
  }
};
