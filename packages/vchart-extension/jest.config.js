const path = require('path');
const core = require('../vchart/jest.config');

module.exports = {
  ...core,
  rootDir: __dirname,
  globals: { 'ts-jest': { ...core.globals['ts-jest'], tsconfig: path.join(__dirname, 'tsconfig.test.json') } },
  setupFiles: [path.resolve(__dirname, '../vchart/setup-mock.js')]
};
