module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:import/warnings',
    'plugin:import/errors',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'max-len': ['error', { code: 125 }],
    'no-restricted-globals': [
      'error',
      {
        name: 'event',
        message: 'Use local parameter instead.',
      },
      {
        name: 'fdescribe',
        message: 'Do not commit fdescribe. Use describe instead.',
      },
    ],
    semi: 'off',
    '@typescript-eslint/semi': ['error'],
  },
};
