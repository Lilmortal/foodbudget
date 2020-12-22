const autoprefixer = require('autoprefixer');

module.exports = {
  addons: [
    '@storybook/addon-actions/register',
    '@storybook/addon-a11y/register',
    '@storybook/addon-viewport/register',
  ],
  stories: ['../src/**/*.stories.tsx', '../components/**/*.stories.tsx'],
};
