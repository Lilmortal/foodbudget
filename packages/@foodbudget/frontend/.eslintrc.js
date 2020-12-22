module.exports = {
  extends: ['../../../.eslintrc.js'],
  plugins: ['react', 'react-hooks'],
  rules: {
    'no-console': 'off',
    camelcase: 'off',
    // TODO: Temporary hack to ignore test-utils, look into this
    'import/no-unresolved': ['error', { ignore: ['test-utils'] }],
  },
};
