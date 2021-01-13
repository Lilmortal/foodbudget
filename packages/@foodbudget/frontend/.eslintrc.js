module.exports = {
  extends: ['../../../.eslintrc.js'],
  plugins: ['react', 'react-hooks'],
  rules: {
    'no-console': 'off',
    camelcase: 'off',
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'react-hooks/rules-of-hooks': 'error',
  },
};
