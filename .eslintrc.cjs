module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  plugins: ['@typescript-eslint'],
  env: {
    node: true,
    es2022: true,
  },
  ignorePatterns: ['dist', 'jest.config.ts'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { args: 'after-used', argsIgnorePattern: '^_', vars: 'all' }],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-inferrable-types': 'warn',
    '@typescript-eslint/prefer-nullish-coalescing': 'warn',
    'prefer-const': 'warn',
    'no-nested-ternary': 'warn',
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/__test__/**/*.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
      parserOptions: {
        project: ['./tsconfig.test.json'],
      },
    },
  ],
};
