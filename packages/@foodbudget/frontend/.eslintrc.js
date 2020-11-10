module.exports = {
  extends: ['../../../.eslintrc.js', 'plugin:relay/recommended'],
  rules: {
    'no-console': 'off',
    camelcase: 'off',
    'relay/graphql-syntax': 'error',
    'relay/compat-uses-vars': 'warn',
    'relay/graphql-naming': 'error',
    'relay/generated-flow-types': 'off',
    'relay/must-colocate-fragment-spreads': 'warn',
    'relay/no-future-added-value': 'warn',
    'relay/unused-fields': 'warn',
  },
  plugins: ['relay'],
};
