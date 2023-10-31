require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  extends: ['@internal/eslint-config/profile/lib'],
  overrides: [
    {
      files: ['**/__tests__/**', '**/*.test.ts'],
      // 测试文件允许以下规则
      rules: {
        '@typescript-eslint/no-empty-function': 'off',
        'no-console': 'off',
        'dot-notation': 'off',
        'promise/catch-or-return': 'off'
      }
    }
  ],
  parserOptions: { tsconfigRootDir: __dirname, project: './tsconfig.eslint.json' }
  // ignorePatterns: [],
};
