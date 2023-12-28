module.exports = {
  preset: 'ts-jest',
  runner: 'jest-electron/runner',
  testEnvironment: 'jest-electron/environment',
  globals: {
    'ts-jest': {
      resolveJsonModule: true,
      esModuleInterop: true,
      experimentalDecorators: true,
      module: 'ESNext',
      tsconfig: './tsconfig.test.json'
    }
  },
  moduleNameMapper: {
    'axios': 'axios/dist/node/axios.cjs',
    'd3-hierarchy': 'd3-hierarchy/dist/d3-hierarchy.min.js',
  },

  verbose: true,
  // 在测试之前设置环境变量
  setupFiles: ['./test-setup.js']
};
