require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  extends: ['@internal/eslint-config/profile/react'],
  globals: {
    __DEV__: 'readonly',
    __VERSION__: 'readonly',
    NodeJS: true
  },
  parserOptions: { tsconfigRootDir: __dirname, project: './tsconfig.eslint.json' },
  // ignorePatterns: [],
  overrides: [
    {
      files: ['jest.config.js', 'jest.setup.js'],
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'script'
      }
    }
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": "warn",
    "react/display-name": "off",
    "no-console": "warn"
  }
};
