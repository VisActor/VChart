/**
 * @type {import('@internal/bundler').Config}
 */
const fs = require('fs');
const path = require('path');

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
  ],
  postTasks: {
    generateEntries: (config, projectRoot, rawPackageJson) => {
      ['core', 'chart', 'series', 'mark', 'component', 'layout'].forEach(entryName => {
        const jsCode = fs.readFileSync(path.join(__dirname, `../../common/template/${entryName}.js`), 'utf-8');
        fs.writeFileSync(path.join(__dirname, `./${entryName}.js`), jsCode, 'utf-8');

        const dtsCode = fs.readFileSync(path.join(__dirname, `../../common/template/${entryName}.d.ts`), 'utf-8');
        fs.writeFileSync(path.join(__dirname, `./${entryName}.d.ts`), dtsCode, 'utf-8');
      });
    }
  }
};
