require('@rushstack/eslint-patch/modern-module-resolution');
module.exports = {
  extends: ['@internal/eslint-config/profile/lib'],
  parserOptions: { tsconfigRootDir: __dirname, project: './tsconfig.eslint.json' },
  env: { browser: true, node: true, jest: true },
  ignorePatterns: ['src/generated/**', 'esm/**', 'cjs/**', 'build/**'],
  rules: { '@typescript-eslint/consistent-type-imports': 'warn' }
};
