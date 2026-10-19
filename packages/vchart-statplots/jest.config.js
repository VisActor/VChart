const path = require('path');
const core = require('../vchart/jest.config');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/unit/**/*.test.ts'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
      // 相邻包由各自单测按自己的 tsconfig 检查，保留 statplots 的严格空值检查。
      diagnostics: { exclude: ['!**/vchart/**', '!**/vutils-extension/**'] }
    }
  },
  transform: { '^.+\\.[jt]s$': 'ts-jest' },
  // 工作区依赖直接使用源码，避免读取缺失或过期的本地构建产物。
  moduleNameMapper: core.moduleNameMapper,
  setupFiles: [path.resolve(__dirname, '../vchart/setup-mock.js')]
};
