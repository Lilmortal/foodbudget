// eslint-disable-next-line @typescript-eslint/no-var-requires
const findConfig = require('find-config');

module.exports = {
  extends: findConfig('.eslintrc.js'),
  rules: {
    'no-console': 'off',
  },
};
