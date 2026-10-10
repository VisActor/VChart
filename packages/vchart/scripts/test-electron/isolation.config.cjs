const path = require('path');
const base = require('../../jest.config.js');

module.exports = {
  ...base,
  rootDir: path.resolve(__dirname, '../..'),
  roots: [path.join(__dirname, 'fixtures')],
  testRegex: process.env.ELECTRON_ISOLATION_FAILURE
    ? '/fixtures/0[123]-.*\\.case\\.js$'
    : '/fixtures/0[12]-.*\\.case\\.js$',
  testSequencer: path.join(__dirname, 'sequencer.cjs')
};
