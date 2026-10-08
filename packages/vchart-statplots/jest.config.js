const path = require('path');
const { moduleNameMapper } = require('../vchart/jest.config');

// 复用 VChart 对 Jest 26 的 D3 / VRender 模块映射，测试使用真实主题实现。
const engineModuleMappers = Object.fromEntries(
  Object.entries(moduleNameMapper).filter(([name]) => name.startsWith('d3-') || name.startsWith('^@visactor/vrender'))
);

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/unit/**/*.test.ts'],
  globals: { 'ts-jest': { tsconfig: 'tsconfig.test.json' } },
  transform: { '^.+\\.[jt]s$': 'ts-jest' },
  transformIgnorePatterns: ['/node_modules/', '/packages/[^/]+/cjs/'],
  moduleNameMapper: {
    ...engineModuleMappers,
    'd3-array': path.resolve(__dirname, '../vchart/node_modules/d3-array/dist/d3-array.min.js')
  }
};
