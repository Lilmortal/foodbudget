// eslint-disable-next-line @typescript-eslint/no-empty-function
window.scroll = () => {};

module.exports = {
  // eslint-disable-next-line global-require
  ...require('@testing-library/jest-dom/extend-expect'),
  // eslint-disable-next-line global-require
  ...require('whatwg-fetch'),
};
